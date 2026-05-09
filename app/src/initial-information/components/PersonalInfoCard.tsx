import React from "react";
import { useTranslation } from "react-i18next";
import { useFormContext, useWatch } from "react-hook-form";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const PersonalInfoCard: React.FC = () => {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const hasChildren = useWatch({ control, name: "hasChildren" });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("initialInformation.personalInfo.title")}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("initialInformation.personalInfo.nationality")} *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("initialInformation.personalInfo.nationalityPlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="COLOMBIAN">{t("initialInformation.nationality.COLOMBIAN")}</SelectItem>
                  <SelectItem value="VENEZUELAN">{t("initialInformation.nationality.VENEZUELAN")}</SelectItem>
                  <SelectItem value="FOREIGN">{t("initialInformation.nationality.FOREIGN")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("initialInformation.personalInfo.gender")} *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("initialInformation.personalInfo.genderPlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="FEMALE">{t("initialInformation.gender.FEMALE")}</SelectItem>
                  <SelectItem value="MALE">{t("initialInformation.gender.MALE")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="maritalStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("initialInformation.personalInfo.maritalStatus")}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("initialInformation.personalInfo.maritalStatusPlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="SINGLE">{t("initialInformation.maritalStatus.SINGLE")}</SelectItem>
                  <SelectItem value="MARRIED">{t("initialInformation.maritalStatus.MARRIED")}</SelectItem>
                  <SelectItem value="WIDOWED">{t("initialInformation.maritalStatus.WIDOWED")}</SelectItem>
                  <SelectItem value="FREE_UNION">{t("initialInformation.maritalStatus.FREE_UNION")}</SelectItem>
                  <SelectItem value="DIVORCED">{t("initialInformation.maritalStatus.DIVORCED")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="hasChildren"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("initialInformation.personalInfo.hasChildren")} *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex gap-4 pt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="YES" id="hasChildren-yes" />
                    <Label htmlFor="hasChildren-yes">{t("initialInformation.yes")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="NO" id="hasChildren-no" />
                    <Label htmlFor="hasChildren-no">{t("initialInformation.no")}</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {hasChildren === "YES" && (
          <FormField
            control={control}
            name="childrenAttendChurch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("initialInformation.personalInfo.childrenAttendChurch")} *</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex gap-4 pt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="YES" id="childrenChurch-yes" />
                      <Label htmlFor="childrenChurch-yes">{t("initialInformation.yes")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="NO" id="childrenChurch-no" />
                      <Label htmlFor="childrenChurch-no">{t("initialInformation.no")}</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={control}
          name="address"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>{t("initialInformation.personalInfo.address")} *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>{t("initialInformation.personalInfo.addressHint")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="housingComplex"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("initialInformation.personalInfo.housingComplex")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="neighborhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("initialInformation.personalInfo.neighborhood")} *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="municipality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("initialInformation.personalInfo.municipality")} *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("initialInformation.personalInfo.municipalityPlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MOSQUERA">{t("initialInformation.municipality.MOSQUERA")}</SelectItem>
                  <SelectItem value="FUNZA">{t("initialInformation.municipality.FUNZA")}</SelectItem>
                  <SelectItem value="MADRID">{t("initialInformation.municipality.MADRID")}</SelectItem>
                  <SelectItem value="BOJACA">{t("initialInformation.municipality.BOJACA")}</SelectItem>
                  <SelectItem value="FACATATIVA">{t("initialInformation.municipality.FACATATIVA")}</SelectItem>
                  <SelectItem value="FONTIBON">{t("initialInformation.municipality.FONTIBON")}</SelectItem>
                  <SelectItem value="BOGOTA">{t("initialInformation.municipality.BOGOTA")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="network"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("initialInformation.personalInfo.network")} *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("initialInformation.personalInfo.networkPlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="YOUTH">{t("initialInformation.network.YOUTH")}</SelectItem>
                  <SelectItem value="PRE">{t("initialInformation.network.PRE")}</SelectItem>
                  <SelectItem value="ROCAS">{t("initialInformation.network.ROCAS")}</SelectItem>
                  <SelectItem value="MEN">{t("initialInformation.network.MEN")}</SelectItem>
                  <SelectItem value="WOMEN">{t("initialInformation.network.WOMEN")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="birthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("initialInformation.personalInfo.birthDate")} *</FormLabel>
              <FormControl>
                <Input placeholder="dd/mm/aaaa" {...field} />
              </FormControl>
              <FormDescription>{t("initialInformation.personalInfo.birthDateHint")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default PersonalInfoCard;
