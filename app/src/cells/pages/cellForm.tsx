import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { CheckCircle, Crown, DoorOpen, Home, MapPin, OctagonX, Pencil, Save, UserPlus, Users, CalendarDays, Clock, XCircle } from 'lucide-react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

import { RecordCellComponent } from '../components/recordCellComponent';
import { AddAttendeeModal } from '../components/AddAttendeeModal';
import { AddressStandardizer } from '@/src/components/AddressStandardizer';
import { CellInput, CellSchema } from '../schemas/cellSchema';
import { useNeighborhoodStore } from '@/src/neighborhood/store/neighborhood.store';
import { CellsService } from '../services/cells.services';

import { useDiscipleStore } from '@/src/disciples/store/disciple.store';
import { useAuthStore } from '@/src/app/stores';
import { useCellStore } from '../store/cell.store';

const DAYS_OF_WEEK = [
  { value: 'Lunes', label: 'Lunes' },
  { value: 'Martes', label: 'Martes' },
  { value: 'Miércoles', label: 'Miércoles' },
  { value: 'Jueves', label: 'Jueves' },
  { value: 'Viernes', label: 'Viernes' },
  { value: 'Sábado', label: 'Sábado' },
  { value: 'Domingo', label: 'Domingo' },
];

const CellForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const userState = useAuthStore(state => state.user);
    const { addCell, updateCell, addAssistant, deactivateAssistant } = useCellStore();
    const disciplesState = useDiscipleStore(state => state.Disciples);
    const getDisciples = useDiscipleStore(state => state.getDisciples);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [neighborhoodSearch, setNeighborhoodSearch] = useState('');

    const neighborhoods = useNeighborhoodStore(state => state.neighborhoods);
    const fetchNeighborhoods = useNeighborhoodStore(state => state.fetchNeighborhoods);
    const createNeighborhood = useNeighborhoodStore(state => state.createNeighborhood);

    const form = useForm<CellInput>({
        resolver: zodResolver(CellSchema as any) as Resolver<CellInput>,
        mode: "onChange",
        defaultValues: {
            id: crypto.randomUUID(),
            createdUser: userState?.id || "",
            createdDate: new Date(),
            address: "",
            leader: "",
            host: "",
            timoteo: "",
            network: 0,
            neighborhood: "",
            day: "",
            time: "",
            yearOpened: undefined,
            assistants: [],
        },
    });

    const discipleName = (id: string) => {
        const d = disciplesState.find(x => x.id === id);
        return d ? `${d.name} ${d.lastName}` : id;
    };

    const currentLeader = form.watch('leader');

    useEffect(() => {
      if (disciplesState.length === 0) {
        getDisciples();
      }
    }, []);

    useEffect(() => {
      if (neighborhoods.length === 0) {
        fetchNeighborhoods();
      }
    }, []);

    useEffect(() => {
        if (!id) return;

        const fetchCell = async () => {
            try {
                const cell = await CellsService.getCell(id);
                if (cell) {
                    form.reset({
                        id: cell.id as string,
                        createdUser: cell.createdUser,
                        createdDate: cell.createdDate ? new Date(cell.createdDate) : new Date(),
                        network: cell.network,
                        neighborhood: cell.neighborhood,
                        address: cell.address,
                        leader: cell.leader,
                        host: cell.host || "",
                        timoteo: cell.timoteo || "",
                        day: cell.day || "",
                        time: cell.time || "",
                        yearOpened: cell.yearOpened || undefined,
                        assistants: (cell.assistants || []).map(a => ({
                            disciple: a.disciple,
                            status: (a.status === 'active' || a.status === 'inactive') ? a.status : 'active',
                            createdDate: new Date(a.createdDate),
                            createdUser: a.createdUser || '',
                            updatedDate: new Date(a.updatedDate),
                            updatedUser: a.updatedUser || '',
                        })),
                    });
                }
            } catch (error) {
                console.error('[CellForm] Error loading cell:', error);
            }
        };

        fetchCell();
    }, [id]);

    const onSubmit = async (data: CellInput) => {
        const isSuccess = id
            ? await updateCell(data)
            : await addCell(data);

        if (isSuccess) {
            toast("Célula guardada correctamente", {
                icon: <CheckCircle className="h-4 w-4 text-green-500" />,
            });
            navigate('/cells');
        } else {
            toast("Error al guardar la célula", {
                icon: <OctagonX className="h-4 w-4 text-red-500" />,
            });
        }
    }

    const handleAddAttendee = async (disciple: { id: string; name: string; lastName: string }) => {
      setShowAddModal(false);
      if (!id) {
        toast("Guarda la célula primero antes de agregar asistentes");
        return;
      }
      const success = await addAssistant(id, disciple.id, userState?.id || "");
      if (success) {
        toast("Asistente agregado a la célula");
      }
    };

    const handleDeactivate = async (discipleId: string) => {
      if (!id) return;
      const success = await deactivateAssistant(id, discipleId, userState?.id || "");
      if (success) {
        toast("Asistente desactivado de la célula");
      }
    };

    const assistants = form.watch('assistants') || [];
    const activeAssistants = assistants.filter(a => a.status === 'active');

    return <>
        <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">{id ? 'Editar Celula' : 'Nueva Celula'}</h1>
        </div>
        <div className="flex items-center items-center justify-center text-start rounded-lg border border-dashed p-4 shadow-sm">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 grid-flow-row gap-2 w-full">
                    <FormField
                        control={form.control}
                        name="network"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-1.5">
                                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                    Red Celula
                                </FormLabel>
                                <Select
                                  onValueChange={(val) => field.onChange(Number(val))}
                                  value={field.value?.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Jovenes, Mujres, Hombres, Kids, etc." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="1">Mujeres</SelectItem>
                                        <SelectItem value="2">Hombres</SelectItem>
                                        <SelectItem value="3">Prejuveniles</SelectItem>
                                        <SelectItem value="4">Mixta</SelectItem>
                                        <SelectItem value="5">Jovenes</SelectItem>
                                        <SelectItem value="6">Kids</SelectItem>
                                        <SelectItem value="7">Rocas</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="neighborhood"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="flex items-center gap-1.5 mt-1 mb-1">
                                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                    Barrio
                                </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? neighborhoods.find((x) => x.id === field.value)?.name : "Alejandria, Alicante, Porvenir, Trebol, etc."}
                                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[400px] p-0">
                                        <Command>
                                            <CommandInput
                                                placeholder="Escribe 2 letras para comentar la busqueda..."
                                                className="h-9"
                                                onValueChange={setNeighborhoodSearch}
                                            />
                                            <CommandList>
                                                <CommandEmpty>
                                                    {neighborhoodSearch.length >= 2 ? (
                                                        <div className="p-2">
                                                            <p className="text-sm mb-2 text-muted-foreground">
                                                                No se encontró "{neighborhoodSearch}"
                                                            </p>
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                className="w-full"
                                                                onClick={async () => {
                                                                    const created = await createNeighborhood(neighborhoodSearch);
                                                                    if (created) {
                                                                        form.setValue("neighborhood", created.id);
                                                                        setNeighborhoodSearch('');
                                                                    }
                                                                }}
                                                            >
                                                                Agregar "{neighborhoodSearch}"
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-muted-foreground p-2">
                                                            Escribe al menos 2 caracteres
                                                        </p>
                                                    )}
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {
                                                        neighborhoods.map((x) => (
                                                            <CommandItem
                                                                value={x.name}
                                                                key={x.id}
                                                                onSelect={() => {
                                                                    form.setValue("neighborhood", x.id);
                                                                }}
                                                            >
                                                                {x.name}
                                                                <CheckIcon className={cn("ml-auto h-4 w-4",
                                                                    x.id === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0")}
                                                                />
                                                            </CommandItem>
                                                        ))
                                                    }
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-1.5">
                                    <Home className="h-3.5 w-3.5 text-muted-foreground" />
                                    Dirección
                                </FormLabel>
                                <div className="flex gap-2">
                                    <FormControl>
                                        <Input placeholder="Calle 12 A N 2 - 4 Torre 2 Apartamento 301" {...field} className="bg-muted text-muted-foreground cursor-not-allowed" readOnly />
                                    </FormControl>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setShowAddressModal(true)}
                                        className="shrink-0"
                                        title="Estandarizar dirección"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </div>
                                <FormDescription>
                                    Ingresa la dirección completa con el complemento, torre, piso, interior, etc.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <AddressStandardizer
                        open={showAddressModal}
                        onOpenChange={setShowAddressModal}
                        onSave={(address) => form.setValue("address", address, { shouldDirty: true })}
                    />

                    <FormField
                        control={form.control}
                        name="day"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-1.5">
                                    <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                                    Día de reunión
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || ''}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona el día" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {DAYS_OF_WEEK.map(d => (
                                            <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                    Hora de reunión
                                </FormLabel>
                                <FormControl>
                                    <Input type="time" {...field} value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="yearOpened"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-1.5">
                                    <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                                    Año de apertura
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        value={field.value?.toString() || ''}
                                        disabled
                                        className="bg-muted text-muted-foreground"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="leader"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="flex items-center gap-1.5 mt-1 mb-1">
                                    <Crown className="h-3.5 w-3.5 text-muted-foreground" />
                                    Lider
                                </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? discipleName(field.value) : "Selecciona un líder"}
                                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[400px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Escribe 2 letras para comentar la busqueda..." className="h-9" />
                                            <CommandList>
                                                <CommandEmpty>
                                                    <p className="text-lg mb-2">
                                                        No se encontró el lider. <br></br>
                                                        ! Próximamente agregaremos funcionalidad para agregar un lider
                                                    </p>
                                                    <Button type="button" disabled>Agregar un nuevo lider</Button>
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {
                                                        disciplesState.map((x) => (
                                                            <CommandItem
                                                                value={`${x.name} ${x.lastName}`}
                                                                key={x.id}
                                                                onSelect={() => {
                                                                    form.setValue("leader", x.id);
                                                                }}
                                                            >
                                                                {x.name} {x.lastName}
                                                                <CheckIcon className={cn("ml-auto h-4 w-4",
                                                                    x.id == field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0")}
                                                                />
                                                            </CommandItem>
                                                        ))
                                                    }
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="host"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="flex items-center gap-1.5 mt-1 mb-1">
                                    <DoorOpen className="h-3.5 w-3.5 text-muted-foreground" />
                                    Anfitrion
                                </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? discipleName(field.value) : "Selecciona un anfitrión"}
                                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[400px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Escribe 2 letras para comentar la busqueda..." className="h-9" />
                                            <CommandList>
                                                <CommandEmpty>
                                                    <p className="text-lg mb-2">No se encontró el anfitrión.</p>
                                                    <Button type="button" disabled>Agregar un nuevo anfitrión</Button>
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {disciplesState.map((x) => (
                                                        <CommandItem
                                                            value={`${x.name} ${x.lastName}`}
                                                            key={x.id}
                                                            onSelect={() => {
                                                                form.setValue("host", x.id);
                                                            }}
                                                        >
                                                            {x.name} {x.lastName}
                                                            <CheckIcon className={cn("ml-auto h-4 w-4",
                                                                x.id == field.value ? "opacity-100" : "opacity-0")}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="timoteo"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="flex items-center gap-1.5 mt-1 mb-1">
                                    <UserPlus className="h-3.5 w-3.5 text-muted-foreground" />
                                    Timoteo
                                </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? discipleName(field.value) : "Selecciona un timoteo"}
                                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[400px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Escribe 2 letras para comentar la busqueda..." className="h-9" />
                                            <CommandList>
                                                <CommandEmpty>
                                                    <p className="text-lg mb-2">No se encontró el timoteo.</p>
                                                    <Button type="button" disabled>Agregar un nuevo timoteo</Button>
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {disciplesState.map((x) => (
                                                        <CommandItem
                                                            value={`${x.name} ${x.lastName}`}
                                                            key={x.id}
                                                            onSelect={() => {
                                                                form.setValue("timoteo", x.id);
                                                            }}
                                                        >
                                                            {x.name} {x.lastName}
                                                            <CheckIcon className={cn("ml-auto h-4 w-4",
                                                                x.id == field.value ? "opacity-100" : "opacity-0")}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="col-span-2">
                        <Save className='mr-2' /> Guardar cambios
                    </Button>
                </form>
            </Form>
        </div>
        <div className="flex flex-col text-start rounded-lg border border-dashed p-4 shadow-sm mt-4">
            <h2 className="text-xl font-semibold mb-4">Asistentes de la Célula</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombres</TableHead>
                        <TableHead>Apellidos</TableHead>
                        <TableHead>Identificación</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!id ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                Guarda la célula para gestionar los asistentes.
                            </TableCell>
                        </TableRow>
                    ) : activeAssistants.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                No hay asistentes activos en esta célula.
                            </TableCell>
                        </TableRow>
                    ) : (
                        activeAssistants.map(a => {
                            const disciple = disciplesState.find(d => d.id === a.disciple);
                            return (
                                <TableRow key={a.disciple}>
                                    <TableCell>{disciple?.name || a.disciple}</TableCell>
                                    <TableCell>{disciple?.lastName || ''}</TableCell>
                                    <TableCell>{disciple?.identification || ''}</TableCell>
                                    <TableCell>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDeactivate(a.disciple)}
                                        >
                                            <XCircle className="h-4 w-4 mr-1" /> Desactivar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
            <div className="flex justify-end mt-2">
                <Button variant="outline" type="button" onClick={() => {
                    if (!id) {
                        toast("Guarda la célula primero antes de agregar asistentes");
                        return;
                    }
                    setShowAddModal(true);
                }}>
                    <UserPlus className="mr-2 h-4 w-4" /> Agregar Asistente
                </Button>
            </div>
            {id && (
                <AddAttendeeModal
                    open={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSelect={handleAddAttendee}
                    cellLeaderId={currentLeader}
                />
            )}
        </div>
        {
            id && id !== 'create' && <RecordCellComponent idCell={id}></RecordCellComponent>
        }
    </>;
}

export default CellForm;