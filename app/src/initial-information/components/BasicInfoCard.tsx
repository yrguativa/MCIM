import React from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  UserCircle,
  Mail,
  Phone,
  IdCard,
  FileText,
} from "lucide-react";

interface BasicInfoCardProps {
  isUpdateMode: boolean;
}

const BasicInfoCard: React.FC<BasicInfoCardProps> = ({ isUpdateMode }) => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          {t("initialInformation.basicInfo.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <UserCircle className="h-3.5 w-3.5 text-muted-foreground" />
                {t("initialInformation.basicInfo.names")} *
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                {t("initialInformation.basicInfo.namesHint")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <UserCircle className="h-3.5 w-3.5 text-muted-foreground" />
                {t("initialInformation.basicInfo.lastNames")} *
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                {t("initialInformation.basicInfo.email")}
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                {t("initialInformation.basicInfo.phone")} *
              </FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="identificationType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <IdCard className="h-3.5 w-3.5 text-muted-foreground" />
                {t("initialInformation.basicInfo.identificationType")} *
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("initialInformation.basicInfo.identificationTypePlaceholder")}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CC">{t("initialInformation.identificationType.CC")}</SelectItem>
                  <SelectItem value="TI">{t("initialInformation.identificationType.TI")}</SelectItem>
                  <SelectItem value="CE">{t("initialInformation.identificationType.CE")}</SelectItem>
                  <SelectItem value="PPT">{t("initialInformation.identificationType.PPT")}</SelectItem>
                  <SelectItem value="PASSPORT">{t("initialInformation.identificationType.PASSPORT")}</SelectItem>
                  <SelectItem value="OTHER">{t("initialInformation.identificationType.OTHER")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="identification"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <IdCard className="h-3.5 w-3.5 text-muted-foreground" />
                {t("initialInformation.basicInfo.identification")} *
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  readOnly={isUpdateMode}
                  disabled={isUpdateMode}
                  className={isUpdateMode ? "bg-muted cursor-not-allowed" : ""}
                />
              </FormControl>
              <FormDescription>
                {isUpdateMode
                  ? t("initialInformation.search.identificationReadOnly")
                  : t("initialInformation.basicInfo.identificationHint")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default BasicInfoCard;
