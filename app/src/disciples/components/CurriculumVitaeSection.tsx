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
    const { i18n } = useTranslation();
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
                        Información Personal
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
                                    Nacionalidad
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione su nacionalidad" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="COLOMBIAN">Colombiana</SelectItem>
                                        <SelectItem value="VENEZUELAN">Venezolana</SelectItem>
                                        <SelectItem value="FOREIGN">Extranjera</SelectItem>
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
                                    Género
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione su género" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="FEMALE">Femenino</SelectItem>
                                        <SelectItem value="MALE">Masculino</SelectItem>
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
                                    Estado Civil
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione su estado civil" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="SINGLE">Soltero(a)</SelectItem>
                                        <SelectItem value="MARRIED">Casado(a)</SelectItem>
                                        <SelectItem value="WIDOWED">Viudo(a)</SelectItem>
                                        <SelectItem value="FREE_UNION">Unión Libre</SelectItem>
                                        <SelectItem value="DIVORCED">Divorciado(a)</SelectItem>
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
                                    ¿Tiene hijos?
                                </FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value || ""}
                                        className="flex gap-4 pt-2"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="YES" id="cv-hasChildren-yes" />
                                            <Label htmlFor="cv-hasChildren-yes">Sí</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="NO" id="cv-hasChildren-no" />
                                            <Label htmlFor="cv-hasChildren-no">No</Label>
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
                                        ¿Sus hijos asisten a la iglesia?
                                    </FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value || ""}
                                            className="flex gap-4 pt-2"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="YES" id="cv-childrenChurch-yes" />
                                                <Label htmlFor="cv-childrenChurch-yes">Sí</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="NO" id="cv-childrenChurch-no" />
                                                <Label htmlFor="cv-childrenChurch-no">No</Label>
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
                                    Dirección
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Cra 1 # 2-3, Torre 4, Apto 501" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormDescription>Incluir Torre, apto, interior, No. Casa</FormDescription>
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
                                    Conjunto / Urbanización
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Nombre del conjunto" {...field} value={field.value || ""} />
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
                                    Barrio
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Nombre del barrio" {...field} value={field.value || ""} />
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
                                    Municipio
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione su municipio" />
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
                                    Red
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione una red" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="YOUTH">Jóvenes</SelectItem>
                                        <SelectItem value="PRE">Pre</SelectItem>
                                        <SelectItem value="ROCAS">Rocas</SelectItem>
                                        <SelectItem value="MEN">Hombres</SelectItem>
                                        <SelectItem value="WOMEN">Mujeres</SelectItem>
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
                                    Fecha de Nacimiento
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
                                                    <span>dd/mm/aaaa</span>
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
                        Ministerio
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
                                    Líder Directo
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
                                                        : "Busque y seleccione su líder de célula"
                                                    : "Busque y seleccione su líder de célula"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[400px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Escriba para buscar líderes..." />
                                            <CommandList>
                                                <CommandEmpty>No se encontraron líderes</CommandEmpty>
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
                                    Por favor registrar el nombre completo de tu líder de célula
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
                                    Año que llegaste a la iglesia
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="2020" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormDescription>Ej: 2020</FormDescription>
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
                                    ¿Ha asistido a Encuentro?
                                </FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value || ""}
                                        className="flex gap-4 pt-2"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="YES" id="cv-encounter-yes" />
                                            <Label htmlFor="cv-encounter-yes">Sí</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="NO" id="cv-encounter-no" />
                                            <Label htmlFor="cv-encounter-no">No</Label>
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
                                            ¿Qué año asistió a Encuentro?
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="2023" {...field} value={field.value || ""} />
                                        </FormControl>
                                        <FormDescription>Ej: 2023</FormDescription>
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
                                            ¿Ha repetido Encuentro?
                                        </FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                value={field.value || ""}
                                                className="flex gap-4 pt-2"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="YES" id="cv-repeatEncounter-yes" />
                                                    <Label htmlFor="cv-repeatEncounter-yes">Sí</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="NO" id="cv-repeatEncounter-no" />
                                                    <Label htmlFor="cv-repeatEncounter-no">No</Label>
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
                                    ¿Ha asistido a Reencuentro?
                                </FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value || ""}
                                        className="flex gap-4 pt-2"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="YES" id="cv-reencounter-yes" />
                                            <Label htmlFor="cv-reencounter-yes">Sí</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="NO" id="cv-reencounter-no" />
                                            <Label htmlFor="cv-reencounter-no">No</Label>
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
                                        ¿Qué año asistió a Reencuentro?
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="2024" {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormDescription>Ej: 2024</FormDescription>
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
                                    ¿Te bautizaste en la MCI?
                                </FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value || ""}
                                        className="flex gap-4 pt-2"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="YES" id="cv-baptized-yes" />
                                            <Label htmlFor="cv-baptized-yes">Sí</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="NO" id="cv-baptized-no" />
                                            <Label htmlFor="cv-baptized-no">No</Label>
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
                                    ¿Eres líder?
                                </FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value || ""}
                                        className="flex gap-4 pt-2"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="YES" id="cv-leader-yes" />
                                            <Label htmlFor="cv-leader-yes">Sí</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="NO" id="cv-leader-no" />
                                            <Label htmlFor="cv-leader-no">No</Label>
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
                                    Generación
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione su generación" />
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
                                    Nivel Escuela de Formación
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione su nivel" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="BASIC_1">Básico 1</SelectItem>
                                        <SelectItem value="BASIC_2">Básico 2</SelectItem>
                                        <SelectItem value="BASIC_3">Básico 3</SelectItem>
                                        <SelectItem value="ADVANCED_1">Avanzado 1</SelectItem>
                                        <SelectItem value="ADVANCED_2">Avanzado 2</SelectItem>
                                        <SelectItem value="ADVANCED_3">Avanzado 3</SelectItem>
                                        <SelectItem value="GRADUATE">Graduado</SelectItem>
                                        <SelectItem value="NOT_STARTED">No he empezado</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>1er ciclo 2026 o último nivel cursado</FormDescription>
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
