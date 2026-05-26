import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface AddressStandardizerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (address: string) => void;
}

const VIA_TYPES = [
  "Calle",
  "Carrera",
  "Avenida",
  "Diagonal",
  "Transversal",
  "Circular",
  "Vereda",
  "Otro",
] as const;

export const AddressStandardizer: React.FC<AddressStandardizerProps> = ({
  open,
  onOpenChange,
  onSave,
}) => {
  const { t } = useTranslation();

  const [viaType, setViaType] = useState("");
  const [mainNumber, setMainNumber] = useState("");
  const [mainLetter, setMainLetter] = useState("");
  const [mainBis, setMainBis] = useState(false);
  const [mainSur, setMainSur] = useState(false);
  const [secondaryNumber, setSecondaryNumber] = useState("");
  const [secondaryLetter, setSecondaryLetter] = useState("");
  const [compNumber, setCompNumber] = useState("");
  const [compEste, setCompEste] = useState(false);
  const [complements, setComplements] = useState<string[]>([]);
  const [newComplement, setNewComplement] = useState("");

  useEffect(() => {
    if (open) {
      setViaType("");
      setMainNumber("");
      setMainLetter("");
      setMainBis(false);
      setMainSur(false);
      setSecondaryNumber("");
      setSecondaryLetter("");
      setCompNumber("");
      setCompEste(false);
      setComplements([]);
      setNewComplement("");
    }
  }, [open]);

  const mainSuffix = [
    mainLetter,
    mainBis ? "Bis" : "",
    mainSur ? "Sur" : "",
  ].filter(Boolean).join(" ");

  const preview = [
    viaType,
    mainNumber ? `${mainNumber}${mainSuffix ? ` ${mainSuffix}` : ""}` : "",
    secondaryNumber ? "#" : "",
    secondaryNumber ? [secondaryNumber, secondaryLetter].filter(Boolean).join("") : "",
    compNumber ? compNumber : "",
    compEste ? "Este" : "",
    ...complements,
  ]
    .filter(Boolean)
    .join(" ");

  const addComplement = () => {
    const trimmed = newComplement.trim();
    if (trimmed) {
      setComplements((prev) => [...prev, trimmed]);
      setNewComplement("");
    }
  };

  const removeComplement = (index: number) => {
    setComplements((prev) => prev.filter((_, i) => i !== index));
  };

  const handleApply = () => {
    onSave(preview);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            {t("initialInformation.personalInfo.addressStandardizer.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Vía Principal */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              {t("initialInformation.personalInfo.addressStandardizer.mainRoad")}
            </h4>
            <div className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-3 space-y-1.5">
                <Label className="text-xs">{t("initialInformation.personalInfo.addressStandardizer.viaType")}</Label>
                <Select value={viaType} onValueChange={setViaType}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder={t("initialInformation.personalInfo.addressStandardizer.viaTypePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {VIA_TYPES.map((type) => (
                      <SelectItem key={type} value={type} className="text-sm">{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs">{t("initialInformation.personalInfo.addressStandardizer.mainNumber")}</Label>
                <Input value={mainNumber} onChange={(e) => setMainNumber(e.target.value)} className="h-9 text-sm" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs">{t("initialInformation.personalInfo.addressStandardizer.mainLetter")}</Label>
                <Input value={mainLetter} onChange={(e) => setMainLetter(e.target.value)} maxLength={2} className="h-9 text-sm uppercase" placeholder="A" />
              </div>
              <div className="col-span-2 flex items-center gap-1.5 pb-1">
                <Checkbox id="mainBis" checked={mainBis} onCheckedChange={(c) => setMainBis(c === true)} />
                <Label htmlFor="mainBis" className="text-xs cursor-pointer">Bis</Label>
              </div>
              <div className="col-span-2 flex items-center gap-1.5 pb-1">
                <Checkbox id="mainSur" checked={mainSur} onCheckedChange={(c) => setMainSur(c === true)} />
                <Label htmlFor="mainSur" className="text-xs cursor-pointer">Sur</Label>
              </div>
            </div>
          </div>

          {/* Vía Secundaria */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              {t("initialInformation.personalInfo.addressStandardizer.secondaryRoad")}
            </h4>
            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-1 flex justify-center text-muted-foreground font-mono text-lg">#</div>
              <div className="col-span-5 space-y-1.5">
                <Label className="text-xs">{t("initialInformation.personalInfo.addressStandardizer.secondaryNumber")}</Label>
                <Input value={secondaryNumber} onChange={(e) => setSecondaryNumber(e.target.value)} className="h-9 text-sm" />
              </div>
              <div className="col-span-3 space-y-1.5">
                <Label className="text-xs">{t("initialInformation.personalInfo.addressStandardizer.secondaryLetter")}</Label>
                <Input value={secondaryLetter} onChange={(e) => setSecondaryLetter(e.target.value)} maxLength={2} className="h-9 text-sm uppercase" placeholder="B" />
              </div>
            </div>
          </div>

          {/* Vía Complemento */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              {t("initialInformation.personalInfo.addressStandardizer.compRoad")}
            </h4>
            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-1 flex justify-center text-muted-foreground font-mono text-lg">-</div>
              <div className="col-span-5 space-y-1.5">
                <Label className="text-xs">{t("initialInformation.personalInfo.addressStandardizer.compNumber")}</Label>
                <Input value={compNumber} onChange={(e) => setCompNumber(e.target.value)} className="h-9 text-sm" />
              </div>
              <div className="col-span-3 flex items-center gap-1.5 pb-1">
                <Checkbox id="compEste" checked={compEste} onCheckedChange={(c) => setCompEste(c === true)} />
                <Label htmlFor="compEste" className="text-xs cursor-pointer">Este</Label>
              </div>
            </div>
          </div>

          {/* Separator */}
          <hr className="border-muted" />

          {/* Complementos dinámicos */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              {t("initialInformation.personalInfo.addressStandardizer.complements")}
            </h4>
            <div className="space-y-2">
              {complements.map((comp, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex-1 h-9 px-3 rounded-md border bg-muted flex items-center text-sm">
                    {comp}
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => removeComplement(i)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  value={newComplement}
                  onChange={(e) => setNewComplement(e.target.value)}
                  placeholder={t("initialInformation.personalInfo.addressStandardizer.complementPlaceholder")}
                  className="flex-1 h-9 text-sm"
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addComplement(); } }}
                />
                <Button type="button" variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={addComplement} disabled={!newComplement.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Vista previa */}
          {preview && (
            <div className="p-3 rounded-md bg-muted border">
              <p className="text-xs text-muted-foreground mb-1">{t("initialInformation.personalInfo.addressStandardizer.preview")}</p>
              <p className="text-sm font-medium break-words">{preview}</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("initialInformation.personalInfo.addressStandardizer.cancel")}
          </Button>
          <Button onClick={handleApply} disabled={!viaType || !mainNumber}>
            {t("initialInformation.personalInfo.addressStandardizer.apply")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddressStandardizer;
