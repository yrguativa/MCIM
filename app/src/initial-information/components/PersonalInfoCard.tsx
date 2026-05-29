import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFormContext, useWatch } from "react-hook-form";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, User, Heart, Globe, MapPin, Network, Users, CalendarDays, Baby, Home, Check, ChevronsUpDown, Search, Droplets, Phone, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddressStandardizer } from "@/src/components/AddressStandardizer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { useDiscipleStore } from "@/src/disciples/store/disciple.store";
import ChildrenSection, { type ChildItem } from "./ChildrenSection";

interface PersonalInfoCardProps {
  childrenList: ChildItem[];
  onChildrenChange: (children: ChildItem[]) => void;
}

const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ childrenList, onChildrenChange }) => {
  const { t, i18n } = useTranslation();
  const { control, setValue } = useFormContext();
  const hasChildren = useWatch({ control, name: "hasChildren" });
  const maritalStatus = useWatch({ control, name: "maritalStatus" });
  const spouseAttendsChurch = useWatch({ control, name: "spouseAttendsChurch" });
  const dateLocale = i18n.language === "es" ? es : undefined;
  const [spouseSearchOpen, setSpouseSearchOpen] = useState(false);
  const [spouseSearchQuery, setSpouseSearchQuery] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const disciplesState = useDiscipleStore(state => state.Disciples);
  const searchByName = useDiscipleStore(state => state.searchByName);
  const getDisciples = useDiscipleStore(state => state.getDisciples);

  useEffect(() => {
    if (disciplesState.length === 0) {
      getDisciples();
    }
  }, []);

  const handleSpouseSearch = (value: string) => {
    setSpouseSearchQuery(value);
    if (value.length >= 2) {
      searchByName(value);
    }
  };

  const filteredDisciples = spouseSearchQuery.length < 2
    ? disciplesState
    : useDiscipleStore.getState().searchResults;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          {t("initialInformation.personalInfo.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                {t("initialInformation.personalInfo.nationality")} *
              </FormLabel>
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
              <FormLabel className="flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-muted-foreground" />
                {t("initialInformation.personalInfo.gender")} *
              </FormLabel>
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
          name="network"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <Network className="h-3.5 w-3.5 text-muted-foreground" />
                {t("initialInformation.personalInfo.network")} *
              </FormLabel>
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
          name="maritalStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-muted-foreground" />
                {t("initialInformation.personalInfo.maritalStatus")}
              </FormLabel>
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

        {(maritalStatus === "MARRIED" || maritalStatus === "FREE_UNION") && (
          <div className="md:col-span-2 space-y-4 rounded-lg border p-4 bg-muted/20">
            <h4 className="text-sm font-medium flex items-center gap-1.5 text-muted-foreground">
              <Heart className="h-4 w-4 text-primary" />
              {t("initialInformation.personalInfo.spouseSection")}
            </h4>

            <FormField
              control={control}
              name="spouseAttendsChurch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    {t("initialInformation.personalInfo.spouseAttendsChurch")} *
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex gap-4 pt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="YES" id="spouse-church-yes" />
                        <Label htmlFor="spouse-church-yes">{t("initialInformation.yes")}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="NO" id="spouse-church-no" />
                        <Label htmlFor="spouse-church-no">{t("initialInformation.no")}</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {spouseAttendsChurch === "YES" && (
              <FormField
                control={control}
                name="spouseId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center gap-1.5">
                      <Search className="h-3.5 w-3.5 text-muted-foreground" />
                      {t("initialInformation.personalInfo.spouseSelect")} *
                    </FormLabel>
                    <Popover open={spouseSearchOpen} onOpenChange={setSpouseSearchOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn("w-full justify-between font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value
                              ? disciplesState.find((d) => d.id === field.value)
                                ? `${disciplesState.find((d) => d.id === field.value)?.name} ${disciplesState.find((d) => d.id === field.value)?.lastName}`
                                : t("initialInformation.personalInfo.spouseSelectPlaceholder")
                              : t("initialInformation.personalInfo.spouseSelectPlaceholder")}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0">
                        <Command shouldFilter={false}>
                          <CommandInput
                            placeholder={t("initialInformation.personalInfo.spouseSearchPlaceholder")}
                            value={spouseSearchQuery}
                            onValueChange={handleSpouseSearch}
                          />
                          <CommandList>
                            <CommandEmpty>{t("initialInformation.personalInfo.spouseSearchEmpty")}</CommandEmpty>
                            <CommandGroup>
                              {filteredDisciples.map((disciple) => (
                                <CommandItem
                                  key={disciple.id}
                                  value={`${disciple.name} ${disciple.lastName}`}
                                  onSelect={() => {
                                    setValue("spouseId", disciple.id);
                                    setSpouseSearchOpen(false);
                                    setSpouseSearchQuery("");
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      disciple.id === field.value ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  {disciple.name} {disciple.lastName}
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
            )}

            {spouseAttendsChurch === "NO" && (
              <FormField
                control={control}
                name="spouseName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      {t("initialInformation.personalInfo.spouseName")} *
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={t("initialInformation.personalInfo.spouseNamePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        )}

        <FormField
          control={control}
          name="hasChildren"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <Baby className="h-3.5 w-3.5 text-muted-foreground" />
                {t("initialInformation.personalInfo.hasChildren")} *
              </FormLabel>
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
          <div className="md:col-span-2 mt-2">
            <ChildrenSection items={childrenList} onChange={onChildrenChange} />
          </div>
        )}

        <FormField
          control={control}
          name="address"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                {t("initialInformation.personalInfo.address")} *
              </FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input {...field} className="flex-1" />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowAddressModal(true)}
                  className="shrink-0"
                  title={t("initialInformation.personalInfo.addressStandardizer.title")}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              <FormDescription>{t("initialInformation.personalInfo.addressHint")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <AddressStandardizer
          open={showAddressModal}
          onOpenChange={setShowAddressModal}
          onSave={(address) => setValue("address", address, { shouldDirty: true })}
        />

        <FormField
          control={control}
          name="housingComplex"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <Home className="h-3.5 w-3.5 text-muted-foreground" />
                {t("initialInformation.personalInfo.housingComplex")}
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
          name="neighborhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                {t("initialInformation.personalInfo.neighborhood")} *
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
          name="municipality"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                {t("initialInformation.personalInfo.municipality")} *
              </FormLabel>
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
          name="birthDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                {t("initialInformation.personalInfo.birthDate")} *
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: dateLocale })
                      ) : (
                        <span>{t("initialInformation.personalInfo.birthDateHint")}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    className="rounded-lg border"
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="rh"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <Droplets className="h-3.5 w-3.5 text-muted-foreground" />
                {t("initialInformation.personalInfo.rh")}
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("initialInformation.personalInfo.rhPlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="O_POSITIVE">O+</SelectItem>
                  <SelectItem value="O_NEGATIVE">O-</SelectItem>
                  <SelectItem value="A_POSITIVE">A+</SelectItem>
                  <SelectItem value="A_NEGATIVE">A-</SelectItem>
                  <SelectItem value="B_POSITIVE">B+</SelectItem>
                  <SelectItem value="B_NEGATIVE">B-</SelectItem>
                  <SelectItem value="AB_POSITIVE">AB+</SelectItem>
                  <SelectItem value="AB_NEGATIVE">AB-</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="contactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                {t("initialInformation.personalInfo.contactName")}
              </FormLabel>
              <FormControl>
                <Input placeholder={t("initialInformation.personalInfo.contactNamePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="contactPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                {t("initialInformation.personalInfo.contactPhone")}
              </FormLabel>
              <FormControl>
                <Input type="tel" placeholder={t("initialInformation.personalInfo.contactPhonePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default PersonalInfoCard;
