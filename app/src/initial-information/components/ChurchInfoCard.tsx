import React from "react";
import { useTranslation } from "react-i18next";
import { useFormContext, useWatch } from "react-hook-form";
import { Check, ChevronsUpDown, Building2, Users, Calendar, Award, Church, UserCheck, GraduationCap, BookOpen, MapPin } from "lucide-react";
import { MCI_LOCATIONS } from "../constants/mciLocations";
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
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useMinistryStore } from "@/src/ministries/store/ministries.store";
import { useInitialInformationStore } from "../store/initialInformation.store";

const ChurchInfoCard: React.FC = () => {
  const { t } = useTranslation();
  const { control, setValue } = useFormContext();
  const { ministries } = useMinistryStore();
  const { leaders } = useInitialInformationStore();

  const hasAttendedEncounter = useWatch({ control, name: "hasAttendedEncounter" });
  const hasAttendedReencounter = useWatch({ control, name: "hasAttendedReencounter" });
  const attendedAnotherChurch = useWatch({ control, name: "attendedAnotherChurch" });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          {t("initialInformation.churchInfo.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="ministryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <Church className="h-3.5 w-3.5 text-muted-foreground" />
                {t("initialInformation.churchInfo.ministry")} *
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("initialInformation.churchInfo.ministryPlaceholder")}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ministries.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="directLeaderId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                {t("initialInformation.churchInfo.directLeader")}
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? leaders.find((l) => l.id === field.value)
                            ? `${leaders.find((l) => l.id === field.value)?.names} ${
                                leaders.find((l) => l.id === field.value)?.lastNames
                              }`
                            : t("initialInformation.churchInfo.directLeaderPlaceholder")
                        : t("initialInformation.churchInfo.directLeaderPlaceholder")}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput
                      placeholder={t("initialInformation.churchInfo.directLeaderSearch")}
                    />
                    <CommandList>
                      <CommandEmpty>
                        {t("initialInformation.churchInfo.directLeaderEmpty")}
                      </CommandEmpty>
                      <CommandGroup>
                        {leaders.map((leader) => (
                          <CommandItem
                            key={leader.id}
                            value={`${leader.names} ${leader.lastNames}`}
                            onSelect={() => {
                              setValue("directLeaderId", leader.id);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                leader.id === field.value ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {leader.names} {leader.lastNames}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                {t("initialInformation.churchInfo.directLeaderHint")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="yearArrivedAtChurch"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                {t("initialInformation.churchInfo.yearArrivedAtChurch")} *
              </FormLabel>
              <FormControl>
                <Input type="number" placeholder="2020" {...field} />
              </FormControl>
              <FormDescription>
                {t("initialInformation.churchInfo.yearArrivedAtChurchHint")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="attendedAnotherChurch"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                {t("initialInformation.churchInfo.attendedAnotherChurch")}
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex gap-4 pt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="YES" id="another-church-yes" />
                    <Label htmlFor="another-church-yes">{t("initialInformation.yes")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="NO" id="another-church-no" />
                    <Label htmlFor="another-church-no">{t("initialInformation.no")}</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {attendedAnotherChurch === "YES" && (
          <>
            <FormField
              control={control}
              name="yearArrivedAtOtherChurch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {t("initialInformation.churchInfo.yearArrivedAtOtherChurch")} *
                  </FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="2020" {...field} />
                  </FormControl>
                  <FormDescription>
                    {t("initialInformation.churchInfo.yearArrivedAtOtherChurchHint")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="otherChurchName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    {t("initialInformation.churchInfo.otherChurchName")} *
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("initialInformation.churchInfo.otherChurchPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MCI_LOCATIONS.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={control}
          name="hasAttendedEncounter"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-muted-foreground" />
                {t("initialInformation.churchInfo.hasAttendedEncounter")} *
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex gap-4 pt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="YES" id="encounter-yes" />
                    <Label htmlFor="encounter-yes">{t("initialInformation.yes")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="NO" id="encounter-no" />
                    <Label htmlFor="encounter-no">{t("initialInformation.no")}</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {hasAttendedEncounter === "YES" && (
          <>
            <FormField
              control={control}
              name="yearAttendedEncounter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {t("initialInformation.churchInfo.yearAttendedEncounter")} *
                  </FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="2023" {...field} />
                  </FormControl>
                  <FormDescription>
                    {t("initialInformation.churchInfo.yearAttendedEncounterHint")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="hasRepeatedEncounter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-muted-foreground" />
                    {t("initialInformation.churchInfo.hasRepeatedEncounter")} *
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex gap-4 pt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="YES" id="repeatEncounter-yes" />
                        <Label htmlFor="repeatEncounter-yes">{t("initialInformation.yes")}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="NO" id="repeatEncounter-no" />
                        <Label htmlFor="repeatEncounter-no">{t("initialInformation.no")}</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={control}
          name="hasAttendedReencounter"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-muted-foreground" />
                {t("initialInformation.churchInfo.hasAttendedReencounter")} *
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex gap-4 pt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="YES" id="reencounter-yes" />
                    <Label htmlFor="reencounter-yes">{t("initialInformation.yes")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="NO" id="reencounter-no" />
                    <Label htmlFor="reencounter-no">{t("initialInformation.no")}</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {hasAttendedReencounter === "YES" && (
          <FormField
            control={control}
            name="yearAttendedReencounter"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {t("initialInformation.churchInfo.yearAttendedReencounter")} *
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="2024" {...field} />
                </FormControl>
                <FormDescription>
                  {t("initialInformation.churchInfo.yearAttendedReencounterHint")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={control}
          name="baptizedAtMCI"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <Church className="h-3.5 w-3.5 text-muted-foreground" />
                {t("initialInformation.churchInfo.baptizedAtMCI")} *
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex gap-4 pt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="YES" id="baptized-yes" />
                    <Label htmlFor="baptized-yes">{t("initialInformation.yes")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="NO" id="baptized-no" />
                    <Label htmlFor="baptized-no">{t("initialInformation.no")}</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="isLeader"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
                {t("initialInformation.churchInfo.isLeader")}
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex gap-4 pt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="YES" id="leader-yes" />
                    <Label htmlFor="leader-yes">{t("initialInformation.yes")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="NO" id="leader-no" />
                    <Label htmlFor="leader-no">{t("initialInformation.no")}</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="generation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                {t("initialInformation.churchInfo.generation")} *
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex gap-4 pt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="YES" id="generation-yes" />
                    <Label htmlFor="generation-yes">{t("initialInformation.yes")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="NO" id="generation-no" />
                    <Label htmlFor="generation-no">{t("initialInformation.no")}</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="formationSchoolLevel"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                {t("initialInformation.churchInfo.formationSchoolLevel")} *
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("initialInformation.churchInfo.formationSchoolLevelPlaceholder")}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="BASIC_1">
                    {t("initialInformation.formationSchoolLevel.BASIC_1")}
                  </SelectItem>
                  <SelectItem value="BASIC_2">
                    {t("initialInformation.formationSchoolLevel.BASIC_2")}
                  </SelectItem>
                  <SelectItem value="BASIC_3">
                    {t("initialInformation.formationSchoolLevel.BASIC_3")}
                  </SelectItem>
                  <SelectItem value="ADVANCED_1">
                    {t("initialInformation.formationSchoolLevel.ADVANCED_1")}
                  </SelectItem>
                  <SelectItem value="ADVANCED_2">
                    {t("initialInformation.formationSchoolLevel.ADVANCED_2")}
                  </SelectItem>
                  <SelectItem value="ADVANCED_3">
                    {t("initialInformation.formationSchoolLevel.ADVANCED_3")}
                  </SelectItem>
                  <SelectItem value="GRADUATE">
                    {t("initialInformation.formationSchoolLevel.GRADUATE")}
                  </SelectItem>
                  <SelectItem value="NOT_STARTED">
                    {t("initialInformation.formationSchoolLevel.NOT_STARTED")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {t("initialInformation.churchInfo.formationSchoolLevelHint")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default ChurchInfoCard;
