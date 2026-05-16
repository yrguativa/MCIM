import React, { useState } from 'react';
import { Search, UserPlus, Loader2 } from 'lucide-react';
import { CheckIcon } from '@radix-ui/react-icons';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useDiscipleStore, type Disciple } from '@/src/disciples/store/disciple.store';
import { useAuthStore } from '@/src/app/stores';

interface AddAttendeeModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (disciple: { id: string; name: string; lastName: string }) => void;
  cellLeaderId: string;
  defaultMinistryId?: string;
  defaultCreatedUser?: string;
}

const IDENTIFICATION_TYPES = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'PPT', label: 'PPT' },
  { value: 'PASSPORT', label: 'Pasaporte' },
  { value: 'OTHER', label: 'Otro' },
];

export const AddAttendeeModal: React.FC<AddAttendeeModalProps> = ({ open, onClose, onSelect, cellLeaderId, defaultMinistryId, defaultCreatedUser }) => {
  const disciplesState = useDiscipleStore(state => state.Disciples);
  const addDisciple = useDiscipleStore(state => state.addDisciple);
  const userState = useAuthStore(state => state.user);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('search');

  const [newIdentificationType, setNewIdentificationType] = useState('CC');
  const [newIdentification, setNewIdentification] = useState('');
  const [newName, setNewName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const filteredDisciples = disciplesState.filter(d => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.name?.toLowerCase().includes(q) ||
      d.lastName?.toLowerCase().includes(q) ||
      d.identification?.toLowerCase().includes(q)
    );
  });

  const handleSelectDisciple = (disciple: typeof disciplesState[0]) => {
    onSelect({ id: disciple.id, name: disciple.name, lastName: disciple.lastName });
    onClose();
  };

  const handleCreateDisciple = async () => {
    if (!newName || !newLastName || !newIdentification) {
      toast('Completa todos los campos');
      return;
    }

    setIsCreating(true);
    try {
      const leaderDisciple = disciplesState.find(d => d.id === cellLeaderId);
      const ministryId = leaderDisciple?.ministryId || defaultMinistryId || '';

      const newDisciple = {
        identification: newIdentification,
        identificationType: newIdentificationType,
        name: newName,
        lastName: newLastName,
        ministryId: ministryId,
        leaderId: cellLeaderId,
        email: undefined,
        phone: undefined,
        createdUser: defaultCreatedUser || userState?.id || 'cell-edit',
      };

      const success = await addDisciple(newDisciple as unknown as Disciple);
      if (success) {
        const createdDisciple = useDiscipleStore.getState().Disciples.find(
          d => d.identification === newIdentification && d.name === newName && d.lastName === newLastName
        );
        if (createdDisciple) {
          onSelect({ id: createdDisciple.id, name: newName, lastName: newLastName });
        }
        onClose();
      } else {
        toast('Error al crear el discípulo');
      }
    } catch {
      toast('Error al crear el discípulo');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setNewIdentificationType('CC');
    setNewIdentification('');
    setNewName('');
    setNewLastName('');
    setActiveTab('search');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar Asistente</DialogTitle>
          <DialogDescription>
            Busca un discípulo existente o agrega uno nuevo.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </TabsTrigger>
            <TabsTrigger value="create">
              <UserPlus className="h-4 w-4 mr-2" />
              Nuevo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            <Command className="rounded-lg border">
              <CommandInput
                placeholder="Buscar por nombre o identificación..."
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandList>
                <CommandEmpty>
                  <p className="text-sm text-muted-foreground p-2">
                    No se encontraron discípulos.
                  </p>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={() => setActiveTab('create')}
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Agregar nuevo discípulo
                  </Button>
                </CommandEmpty>
                <CommandGroup>
                  {filteredDisciples.map(d => (
                    <CommandItem
                      key={d.id}
                      value={`${d.name} ${d.lastName} ${d.identification}`}
                      onSelect={() => handleSelectDisciple(d)}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{d.name} {d.lastName}</span>
                        <span className="text-xs text-muted-foreground">
                          {d.identificationType} {d.identification}
                        </span>
                      </div>
                      <CheckIcon className="ml-auto h-4 w-4 opacity-0" />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </TabsContent>

          <TabsContent value="create">
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="identificationType">Tipo de Identificación</Label>
                <Select value={newIdentificationType} onValueChange={setNewIdentificationType}>
                  <SelectTrigger id="identificationType">
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {IDENTIFICATION_TYPES.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="identification">Número de Identificación</Label>
                <Input
                  id="identification"
                  placeholder="1234567890"
                  value={newIdentification}
                  onChange={e => setNewIdentification(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Nombres</Label>
                <Input
                  id="name"
                  placeholder="Juan Carlos"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Apellidos</Label>
                <Input
                  id="lastName"
                  placeholder="Pérez Gómez"
                  value={newLastName}
                  onChange={e => setNewLastName(e.target.value)}
                />
              </div>
              <Button type="button" onClick={handleCreateDisciple} disabled={isCreating}>
                {isCreating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4 mr-2" />
                )}
                Guardar y Agregar
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
