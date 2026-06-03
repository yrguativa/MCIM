import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Plus, X, Users, Check, ExternalLink, Loader2, Search, UserPlus } from "lucide-react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useDiscipleStore, type Disciple } from "@/src/disciples/store/disciple.store";

const IDENTIFICATION_TYPES = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'PPT', label: 'PPT' },
  { value: 'PASSPORT', label: 'Pasaporte' },
  { value: 'OTHER', label: 'Otro' },
];

export interface ChildItem {
  tempId: string;
  attendsChurch: string;
  childDiscipleId?: string;
  name?: string;
  age?: number;
}

interface ChildrenSectionProps {
  items: ChildItem[];
  onChange: (children: ChildItem[]) => void;
  readOnly?: boolean;
  ministryId?: string;
}

const ChildrenSection: React.FC<ChildrenSectionProps> = ({ items: children, onChange, readOnly, ministryId }) => {
  const { t } = useTranslation();
  const { Disciples: disciples, getDisciples, addDisciple } = useDiscipleStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [newAttendsChurch, setNewAttendsChurch] = useState<string>("");
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newChildDiscipleId, setNewChildDiscipleId] = useState("");
  const [childTab, setChildTab] = useState("search");
  const [newIdType, setNewIdType] = useState("CC");
  const [newIdentification, setNewIdentification] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [isCreatingDisciple, setIsCreatingDisciple] = useState(false);

  useEffect(() => {
    if (disciples.length === 0) getDisciples();
  }, []);

  const handleAdd = () => {
    if (!newAttendsChurch) return;
    const child: ChildItem = { tempId: crypto.randomUUID(), attendsChurch: newAttendsChurch };
    if (newAttendsChurch === "NO") {
      if (!newName) return;
      child.name = newName;
      child.age = newAge ? Number(newAge) : undefined;
    } else {
      if (!newChildDiscipleId) return;
      child.childDiscipleId = newChildDiscipleId;
      const d = disciples.find(x => x.id === newChildDiscipleId);
      child.name = d ? `${d.name} ${d.lastName}` : newChildDiscipleId;
    }
    onChange([...children, child]);
    resetModal();
    setModalOpen(false);
  };

  const handleCreateDisciple = async () => {
    if (!newName || !newLastName || !newIdentification) {
      toast(t("initialInformation.validation.formErrors"));
      return;
    }

    setIsCreatingDisciple(true);
    try {
      const newDisciple = {
        identification: newIdentification,
        identificationType: newIdType,
        name: newName,
        lastName: newLastName,
        ministryId: ministryId || '',
        email: undefined,
        phone: undefined,
        createdUser: "initial-info-form",
      };

      const success = await addDisciple(newDisciple as unknown as Disciple);
      if (success) {
        const created = useDiscipleStore.getState().Disciples.find(
          d => d.identification === newIdentification && d.name === newName && d.lastName === newLastName
        );
        if (created) {
          setNewChildDiscipleId(created.id);
          const child: ChildItem = { tempId: crypto.randomUUID(), attendsChurch: "YES", childDiscipleId: created.id, name: `${newName} ${newLastName}` };
          onChange([...children, child]);
          resetModal();
          setModalOpen(false);
        }
      } else {
        toast(t("initialInformation.messages.error"));
      }
    } catch {
      toast(t("initialInformation.messages.error"));
    } finally {
      setIsCreatingDisciple(false);
    }
  };

  const resetModal = () => {
    setNewAttendsChurch("");
    setNewName("");
    setNewAge("");
    setNewChildDiscipleId("");
    setNewIdType("CC");
    setNewIdentification("");
    setNewLastName("");
    setChildTab("search");
  };

  const handleRemove = (tempId: string) => {
    onChange(children.filter(c => c.tempId !== tempId));
  };

  const discipleName = (id: string) => {
    const d = disciples.find(x => x.id === id);
    return d ? `${d.name} ${d.lastName}` : id;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          {t("children.title")}
        </Label>
        {!readOnly && (
          <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            {t("children.addChild")}
          </Button>
        )}
      </div>

      {children.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-3 border rounded-md">
          {t("children.empty")}
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("children.name")}</TableHead>
              <TableHead>{t("children.age")}</TableHead>
              <TableHead>{t("children.attendsChurchLabel")}</TableHead>
              <TableHead className="w-24">{t("initialInformation.cellInfo.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {children.map(c => (
              <TableRow key={c.tempId}>
                <TableCell className="font-medium">{c.name || discipleName(c.childDiscipleId || "")}</TableCell>
                <TableCell>{c.age != null ? c.age : "—"}</TableCell>
                <TableCell>{c.attendsChurch === "YES" ? t("initialInformation.yes") : t("initialInformation.no")}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {c.childDiscipleId && (
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/disciples/${c.childDiscipleId}`}>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    )}
                    {!readOnly && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => handleRemove(c.tempId)}>
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("children.addChild")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("children.attendsChurch")}</Label>
              <RadioGroup value={newAttendsChurch} onValueChange={setNewAttendsChurch} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="YES" id="child-church-yes" />
                  <Label htmlFor="child-church-yes">{t("initialInformation.yes")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="NO" id="child-church-no" />
                  <Label htmlFor="child-church-no">{t("initialInformation.no")}</Label>
                </div>
              </RadioGroup>
            </div>

            {newAttendsChurch === "NO" && (
              <>
                <div className="space-y-2">
                  <Label>{t("children.name")}</Label>
                  <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder={t("children.namePlaceholder")} />
                </div>
                <div className="space-y-2">
                  <Label>{t("children.age")}</Label>
                  <Input type="number" value={newAge} onChange={e => setNewAge(e.target.value)} placeholder={t("children.agePlaceholder")} />
                </div>
              </>
            )}

            {newAttendsChurch === "YES" && (
              <div className="space-y-2">
                <Tabs value={childTab} onValueChange={setChildTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="search">
                      <Search className="h-4 w-4 mr-2" />
                      {t("children.searchTab")}
                    </TabsTrigger>
                    <TabsTrigger value="create">
                      <UserPlus className="h-4 w-4 mr-2" />
                      {t("children.createTab")}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="search">
                    <Label>{t("children.selectChild")}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                          {newChildDiscipleId
                            ? discipleName(newChildDiscipleId)
                            : t("children.selectChildPlaceholder")}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0">
                        <Command>
                          <CommandInput placeholder={t("children.searchDisciple")} />
                          <CommandList>
                            <CommandEmpty>{t("children.noResults")}</CommandEmpty>
                            <CommandGroup className="max-h-64 overflow-auto">
                              {disciples.map(d => (
                                <CommandItem key={d.id} value={`${d.name} ${d.lastName}`}
                                  onSelect={() => setNewChildDiscipleId(d.id)}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", d.id === newChildDiscipleId ? "opacity-100" : "opacity-0")} />
                                  {d.name} {d.lastName}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </TabsContent>

                  <TabsContent value="create" className="space-y-3">
                    <div className="space-y-2">
                      <Label>{t("children.identificationType")}</Label>
                      <Select value={newIdType} onValueChange={setNewIdType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {IDENTIFICATION_TYPES.map(t => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("children.identification")}</Label>
                      <Input value={newIdentification} onChange={e => setNewIdentification(e.target.value)} placeholder={t("children.identificationPlaceholder")} />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("children.names")}</Label>
                      <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder={t("children.namesPlaceholder")} />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("children.lastNames")}</Label>
                      <Input value={newLastName} onChange={e => setNewLastName(e.target.value)} placeholder={t("children.lastNamesPlaceholder")} />
                    </div>
                    <Button type="button" className="w-full" onClick={handleCreateDisciple} disabled={isCreatingDisciple}>
                      {isCreatingDisciple ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <UserPlus className="h-4 w-4 mr-2" />
                      )}
                      {t("children.saveAndAdd")}
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { resetModal(); setModalOpen(false); }}>
              {t("initialInformation.actions.cancel")}
            </Button>
            <Button type="button" onClick={handleAdd} disabled={!newAttendsChurch}>
              {t("initialInformation.actions.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChildrenSection;
