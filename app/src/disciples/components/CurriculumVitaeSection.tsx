import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import {
    CalendarIcon,
    User,
    Heart,
    Globe,
    MapPin,
    Network,
    Users,
    CalendarDays,
    Baby,
    Home,
    Building2,
    Calendar,
    Award,
    Church,
    UserCheck,
    GraduationCap,
    BookOpen,
    Check,
    ChevronsUpDown,
} from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { useDiscipleStore } from "../store/disciple.store";

const CurriculumVitaeSection: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { control, setValue } = useFormContext();
    const { leaders } = useDiscipleStore();
    const hasChildren = useWatch({ control, name: "hasChildren" });
    const hasAttendedEncounter = useWatch({ control, name: "hasAttendedEncounter" });
    const hasAttendedReencounter = useWatch({ control, name: "hasAttendedReencounter" });
    const dateLocale = i18n.language === "es" ? es : undefined;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        {t("disciples.cv.personalInfo")}
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
                                    {t("disciples.cv.nationality")}
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("disciples.cv.placeholders.nationality")} />
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
                                    {t("disciples.cv.gender")}
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("disciples.cv.placeholders.gender")} />
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
                                <FormLabel className="flex items-center gap-1.5">
                                    <Heart className="h-3.5 w-3.5 text-muted-foreground" />
                                    {t("disciples.cv.maritalStatus")}
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("disciples.cv.placeholders.maritalStatus")} />
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
                                <FormLabel className="flex items-center gap-1.5">
                                    <Baby className="h-3.5 w-3.5 text-muted-foreground" />
                                    {t("disciples.cv.hasChildren")}
                                </FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value || ""}
                                        className="flex gap-4 pt-2"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="YES" id="cv-hasChildren-yes" />
                                            <Label htmlFor="cv-hasChildren-yes">{t("disciples.cv.yes")}</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="NO" id="cv-hasChildren-no" />
                                            <Label htmlFor="cv-hasChildren-no">{t("disciples.cv.no")}</Label>
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
                                    <FormLabel className="flex items-center gap-1.5">
                                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                        {t("disciples.cv.childrenAttendChurch")}
                                    </FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value || ""}
                                            className="flex gap-4 pt-2"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="YES" id="cv-childrenChurch-yes" />
                                                <Label htmlFor="cv-childrenChurch-yes">{t("disciples.cv.yes")}</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="NO" id="cv-childrenChurch-no" />
                                                <Label htmlFor="cv-childrenChurch-no">{t("disciples.cv.no")}</Label>
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
                                <FormLabel className="flex items-center gap-1.5">
                                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                    {t("disciples.address")}
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder={t("disciples.cv.placeholders.address")} {...field} value={field.value || ""} />
                                </FormControl>
                                <FormDescription>{t("disciples.cv.descriptions.address")}</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="housingComplex"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-1.5">
                                    <Home className="h-3.5 w-3.5 text-muted-foreground" />
                                    {t("disciples.cv.housingComplex")}
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder={t("disciples.cv.placeholders.housingComplex")} {...field} value={field.value || ""} />
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
                                    {t("disciples.cv.neighborhood")}
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder={t("disciples.cv.placeholders.neighborhood")} {...field} value={field.value || ""} />
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
                                    {t("disciples.cv.municipality")}
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("disciples.cv.placeholders.municipality")} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="MOSQUERA">Mosquera</SelectItem>
                                        <SelectItem value="FUNZA">Funza</SelectItem>
                                        <SelectItem value="MADRID">Madrid</SelectItem>
                                        <SelectItem value="BOJACA">Bojacá</SelectItem>
                                        <SelectItem value="FACATATIVA">Facatativá</SelectItem>
                                        <SelectItem value="FONTIBON">Fontibón</SelectItem>
                                        <SelectItem value="BOGOTA">Bogotá</SelectItem>
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
                                    {t("disciples.cv.network")}
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("disciples.cv.placeholders.network")} />
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
                            <FormItem className="flex flex-col">
                                <FormLabel className="flex items-center gap-1.5">
                                    <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                                    {t("disciples.birthDate")}
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
                                                    <span>{t("disciples.cv.placeholders.birthDate")}</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <CalendarPicker
                                            mode="single"
                                            selected={field.value || undefined}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        {t("disciples.cv.ministry")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={control}
                        name="directLeaderId"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="flex items-center gap-1.5">
                                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                    {t("disciples.cv.directLeader")}
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
                                                        ? `${leaders.find((l) => l.id === field.value)?.names} ${leaders.find((l) => l.id === field.value)?.lastNames}`
                                                        : t("disciples.cv.placeholders.directLeader")
                                                    : t("disciples.cv.placeholders.directLeader")}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[400px] p-0">
                                        <Command>
                                            <CommandInput placeholder={t("disciples.cv.placeholders.directLeaderSearch")} />
                                            <CommandList>
                                                <CommandEmpty>{t("disciples.cv.placeholders.directLeaderEmpty")}</CommandEmpty>
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
                                    {t("disciples.cv.descriptions.directLeader")}
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
                                    {t("disciples.cv.yearArrivedAtChurch")}
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder={t("disciples.cv.placeholders.yearArrivedAtChurch")} {...field} value={field.value || ""} />
                                </FormControl>
                                <FormDescription>{t("disciples.cv.descriptions.yearArrivedAtChurch")}</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="hasAttendedEncounter"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-1.5">
                                    <Award className="h-3.5 w-3.5 text-muted-foreground" />
                                    {t("disciples.cv.hasAttendedEncounter")}
                                </FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value || ""}
                                        className="flex gap-4 pt-2"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="YES" id="cv-encounter-yes" />
                                            <Label htmlFor="cv-encounter-yes">{t("disciples.cv.yes")}</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="NO" id="cv-encounter-no" />
                                            <Label htmlFor="cv-encounter-no">{t("disciples.cv.no")}</Label>
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
                                            {t("disciples.cv.yearAttendedEncounter")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder={t("disciples.cv.placeholders.yearAttendedEncounter")} {...field} value={field.value || ""} />
                                        </FormControl>
                                        <FormDescription>{t("disciples.cv.descriptions.yearAttendedEncounter")}</FormDescription>
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
                                            {t("disciples.cv.hasRepeatedEncounter")}
                                        </FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                value={field.value || ""}
                                                className="flex gap-4 pt-2"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="YES" id="cv-repeatEncounter-yes" />
                                                    <Label htmlFor="cv-repeatEncounter-yes">{t("disciples.cv.yes")}</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="NO" id="cv-repeatEncounter-no" />
                                                    <Label htmlFor="cv-repeatEncounter-no">{t("disciples.cv.no")}</Label>
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
                                    {t("disciples.cv.hasAttendedReencounter")}
                                </FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value || ""}
                                        className="flex gap-4 pt-2"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="YES" id="cv-reencounter-yes" />
                                            <Label htmlFor="cv-reencounter-yes">{t("disciples.cv.yes")}</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="NO" id="cv-reencounter-no" />
                                            <Label htmlFor="cv-reencounter-no">{t("disciples.cv.no")}</Label>
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
                                        {t("disciples.cv.yearAttendedReencounter")}
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder={t("disciples.cv.placeholders.yearAttendedReencounter")} {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormDescription>{t("disciples.cv.descriptions.yearAttendedReencounter")}</FormDescription>
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
                                    {t("disciples.cv.baptizedAtMCI")}
                                </FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value || ""}
                                        className="flex gap-4 pt-2"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="YES" id="cv-baptized-yes" />
                                            <Label htmlFor="cv-baptized-yes">{t("disciples.cv.yes")}</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="NO" id="cv-baptized-no" />
                                            <Label htmlFor="cv-baptized-no">{t("disciples.cv.no")}</Label>
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
                                    {t("disciples.cv.isLeader")}
                                </FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value || ""}
                                        className="flex gap-4 pt-2"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="YES" id="cv-leader-yes" />
                                            <Label htmlFor="cv-leader-yes">{t("disciples.cv.yes")}</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="NO" id="cv-leader-no" />
                                            <Label htmlFor="cv-leader-no">{t("disciples.cv.no")}</Label>
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
                                    {t("disciples.cv.generation")}
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("disciples.cv.placeholders.generation")} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="12">12</SelectItem>
                                        <SelectItem value="144">144</SelectItem>
                                        <SelectItem value="1728">1.728</SelectItem>
                                        <SelectItem value="20736">20.736</SelectItem>
                                        <SelectItem value="248832">248.832</SelectItem>
                                        <SelectItem value="2985984">2.985.984</SelectItem>
                                    </SelectContent>
                                </Select>
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
                                    {t("disciples.cv.formationSchoolLevel")}
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("disciples.cv.placeholders.formationSchoolLevel")} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="BASIC_1">{t("initialInformation.formationSchoolLevel.BASIC_1")}</SelectItem>
                                        <SelectItem value="BASIC_2">{t("initialInformation.formationSchoolLevel.BASIC_2")}</SelectItem>
                                        <SelectItem value="BASIC_3">{t("initialInformation.formationSchoolLevel.BASIC_3")}</SelectItem>
                                        <SelectItem value="ADVANCED_1">{t("initialInformation.formationSchoolLevel.ADVANCED_1")}</SelectItem>
                                        <SelectItem value="ADVANCED_2">{t("initialInformation.formationSchoolLevel.ADVANCED_2")}</SelectItem>
                                        <SelectItem value="ADVANCED_3">{t("initialInformation.formationSchoolLevel.ADVANCED_3")}</SelectItem>
                                        <SelectItem value="GRADUATE">{t("initialInformation.formationSchoolLevel.GRADUATE")}</SelectItem>
                                        <SelectItem value="NOT_STARTED">{t("initialInformation.formationSchoolLevel.NOT_STARTED")}</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>{t("disciples.cv.descriptions.formationSchoolLevel")}</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default CurriculumVitaeSection;
