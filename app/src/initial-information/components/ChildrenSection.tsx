import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Plus, X, Users, Check } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { useDiscipleStore } from "@/src/disciples/store/disciple.store";

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
}

const ChildrenSection: React.FC<ChildrenSectionProps> = ({ items: children, onChange, readOnly }) => {
  const { t } = useTranslation();
  const { Disciples: disciples, getDisciples } = useDiscipleStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [newAttendsChurch, setNewAttendsChurch] = useState<string>("");
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newChildDiscipleId, setNewChildDiscipleId] = useState("");

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
    setNewAttendsChurch("");
    setNewName("");
    setNewAge("");
    setNewChildDiscipleId("");
    setModalOpen(false);
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
              {!readOnly && <TableHead className="w-20">{t("initialInformation.cellInfo.actions")}</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {children.map(c => (
              <TableRow key={c.tempId}>
                <TableCell className="font-medium">{c.name || discipleName(c.childDiscipleId || "")}</TableCell>
                <TableCell>{c.age != null ? c.age : "—"}</TableCell>
                <TableCell>{c.attendsChurch === "YES" ? t("initialInformation.yes") : t("initialInformation.no")}</TableCell>
                {!readOnly && (
                  <TableCell>
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleRemove(c.tempId)}>
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                )}
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
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { setModalOpen(false); setNewAttendsChurch(""); setNewName(""); setNewAge(""); setNewChildDiscipleId(""); }}>
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
