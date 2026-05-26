import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MapPin } from "lucide-react";
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
  const [secondaryNumber, setSecondaryNumber] = useState("");
  const [secondaryLetter, setSecondaryLetter] = useState("");
  const [complement, setComplement] = useState("");

  useEffect(() => {
    if (open) {
      setViaType("");
      setMainNumber("");
      setMainLetter("");
      setSecondaryNumber("");
      setSecondaryLetter("");
      setComplement("");
    }
  }, [open]);

  const preview = [
    viaType,
    mainNumber,
    mainLetter,
    mainNumber || secondaryNumber ? " #" : "",
    secondaryNumber,
    secondaryLetter,
    complement ? ` - ${complement}` : "",
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+#/, "#");

  const handleApply = () => {
    onSave(preview);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            {t("initialInformation.personalInfo.addressStandardizer.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label>{t("initialInformation.personalInfo.addressStandardizer.viaType")}</Label>
            <Select value={viaType} onValueChange={setViaType}>
              <SelectTrigger>
                <SelectValue placeholder={t("initialInformation.personalInfo.addressStandardizer.viaTypePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {VIA_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("initialInformation.personalInfo.addressStandardizer.mainNumber")}</Label>
            <Input value={mainNumber} onChange={(e) => setMainNumber(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>{t("initialInformation.personalInfo.addressStandardizer.mainLetter")}</Label>
            <Input value={mainLetter} onChange={(e) => setMainLetter(e.target.value)} maxLength={2} className="uppercase" placeholder="A" />
          </div>

          <div className="space-y-2">
            <Label>{t("initialInformation.personalInfo.addressStandardizer.secondaryNumber")}</Label>
            <Input value={secondaryNumber} onChange={(e) => setSecondaryNumber(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>{t("initialInformation.personalInfo.addressStandardizer.secondaryLetter")}</Label>
            <Input value={secondaryLetter} onChange={(e) => setSecondaryLetter(e.target.value)} maxLength={2} className="uppercase" placeholder="B" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>{t("initialInformation.personalInfo.addressStandardizer.complement")}</Label>
            <Input
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
              placeholder={t("initialInformation.personalInfo.addressStandardizer.complementPlaceholder")}
            />
          </div>

          {preview && (
            <div className="md:col-span-2 p-3 rounded-md bg-muted border">
              <p className="text-xs text-muted-foreground mb-1">{t("initialInformation.personalInfo.addressStandardizer.preview")}</p>
              <p className="text-sm font-medium">{preview}</p>
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
