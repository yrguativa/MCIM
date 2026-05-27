import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Resolver, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next";
import { cn } from '@/lib/utils';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { Check as CheckIcon, CheckCircle, OctagonX, Save, Loader2, Info, ScrollText, IdCard, Fingerprint, User, Phone, Mail, Building2, Flag, Heart, ExternalLink, Pencil } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

import { createDiscipleSchema, type DiscipleInput } from '../schemas/discipleSchema';
import { DisciplesService } from '../services/disciples.services';

import { useMinistryStore } from '@/src/ministries/store/ministries.store';
import { useAuthStore } from '@/src/app/stores';
import { useDiscipleStore, type Disciple } from '../store/disciple.store';
import CurriculumVitaeSection from '../components/CurriculumVitaeSection';
import SpouseSelectorModal from '../components/SpouseSelectorModal';

const DiscipleForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const userState = useAuthStore(state => state.user);
  const { addDiscipleFull, updateDiscipleFull, addDisciple, updateDisciple, isSaving, getLeaders, Disciples: disciplesState, getDisciples } = useDiscipleStore(state => state);
  const ministries = useMinistryStore(state => state.ministries);
  const getMinistries = useMinistryStore(state => state.getMinistries);
  const [personalInfoId, setPersonalInfoId] = useState<string | undefined>(undefined);
  const [maritalRel, setMaritalRel] = useState<{ id: string; discipleId: string; spouseId?: string; spouseName?: string; attendsChurch: string } | null>(null);
  const [spouseModalOpen, setSpouseModalOpen] = useState(false);

  const form = useForm<DiscipleInput>({
    resolver: zodResolver(createDiscipleSchema(t) as any) as Resolver<DiscipleInput>,
    defaultValues: {
      id: id || crypto.randomUUID(),
      createdUser: userState?.id || undefined,
      createdDate: new Date(),
    }
  });

  useEffect(() => {
    getLeaders();
    getDisciples();
    if (ministries.length === 0) {
      getMinistries();
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      const full = await DisciplesService.getDiscipleFull(id);
      if (full) {
        const d = full.disciple;
        const p = full.personalInfo;

        form.reset({
          id: id,
          createdUser: d.createdUser || userState?.id,
          createdDate: d.createdDate ? new Date(d.createdDate) : new Date(),
          name: d.name,
          lastName: d.lastName,
          identification: parseInt(d.identification),
          identificationType: d.identificationType as DiscipleInput["identificationType"],
          number: d.phone ? parseInt(d.phone) : undefined,
          email: d.email || undefined,
          ministryId: d.ministryId,
          network: p?.network || d.network || undefined,
          status: d.status || undefined,

          nationality: p?.nationality as DiscipleInput["nationality"] || undefined,
          gender: p?.gender as DiscipleInput["gender"] || undefined,
          maritalStatus: p?.maritalStatus as DiscipleInput["maritalStatus"] || undefined,
          hasChildren: p?.hasChildren as DiscipleInput["hasChildren"] || undefined,
          childrenAttendChurch: p?.childrenAttendChurch as DiscipleInput["childrenAttendChurch"] || undefined,
          address: p?.address || undefined,
          housingComplex: p?.housingComplex || undefined,
          neighborhood: p?.neighborhood || undefined,
          municipality: p?.municipality as DiscipleInput["municipality"] || undefined,
          birthDate: p?.birthDate ? new Date(p.birthDate) : undefined,
          directLeaderId: d.leaderId || undefined,
          yearArrivedAtChurch: p?.yearArrivedAtChurch || undefined,
          hasAttendedEncounter: p?.hasAttendedEncounter as DiscipleInput["hasAttendedEncounter"] || undefined,
          yearAttendedEncounter: p?.yearAttendedEncounter || undefined,
          hasRepeatedEncounter: p?.hasRepeatedEncounter as DiscipleInput["hasRepeatedEncounter"] || undefined,
          hasAttendedReencounter: p?.hasAttendedReencounter as DiscipleInput["hasAttendedReencounter"] || undefined,
          yearAttendedReencounter: p?.yearAttendedReencounter || undefined,
          baptizedAtMCI: p?.baptizedAtMCI as DiscipleInput["baptizedAtMCI"] || undefined,
          isLeader: p?.isLeader as DiscipleInput["isLeader"] || undefined,
          generation: p?.generation as DiscipleInput["generation"] || undefined,
          formationSchoolLevel: p?.formationSchoolLevel as DiscipleInput["formationSchoolLevel"] || undefined,
          rh: p?.rh as DiscipleInput["rh"] || undefined,
          contactName: p?.contactName || undefined,
          contactPhone: p?.contactPhone || undefined,
        });

        if (p?.id) {
          setPersonalInfoId(p.id);
        }

        try {
          let rel = await DisciplesService.getMaritalRelationship(id);
          if (!rel) {
            rel = await DisciplesService.getMaritalRelationshipBySpouse(id);
          }
          setMaritalRel(rel);
        } catch {
          // marital relationship not found
        }
      }
    };

    fetchData();
  }, [id]);

  function hasPersonalInfoData(data: DiscipleInput): boolean {
    return !!(data.nationality || data.gender || data.address || data.neighborhood ||
      data.municipality || data.birthDate || data.hasChildren || data.network ||
      data.yearArrivedAtChurch || data.hasAttendedEncounter || data.hasAttendedReencounter ||
      data.baptizedAtMCI || data.generation || data.formationSchoolLevel);
  }

  async function onSubmit(data: DiscipleInput) {
    const baseDiscipleData = {
      name: data.name,
      lastName: data.lastName,
      identification: data.identification?.toString() || '',
      identificationType: data.identificationType,
      email: data.email,
      ministryId: data.ministryId,
      leaderId: data.directLeaderId || undefined,
      network: data.network,
      status: data.status,
      createdUser: data.createdUser,
      createdDate: data.createdDate,
      phone: data.number?.toString(),
    };

    const discipleData = id
      ? {
          ...baseDiscipleData,
          id,
          updatedUser: userState?.id || '',
          updatedDate: new Date(),
        }
      : baseDiscipleData;

    const personalInfoData = {
      nationality: data.nationality || undefined,
      gender: data.gender || undefined,
      maritalStatus: data.maritalStatus || undefined,
      hasChildren: data.hasChildren || undefined,
      childrenAttendChurch: data.childrenAttendChurch || undefined,
      address: data.address || undefined,
      housingComplex: data.housingComplex || undefined,
      neighborhood: data.neighborhood || undefined,
      municipality: data.municipality || undefined,
      network: data.network || undefined,
      birthDate: data.birthDate?.toISOString() || undefined,
      ministryId: data.ministryId,
      yearArrivedAtChurch: data.yearArrivedAtChurch || undefined,
      hasAttendedEncounter: data.hasAttendedEncounter || undefined,
      yearAttendedEncounter: data.yearAttendedEncounter || undefined,
      hasRepeatedEncounter: data.hasRepeatedEncounter || undefined,
      hasAttendedReencounter: data.hasAttendedReencounter || undefined,
      yearAttendedReencounter: data.yearAttendedReencounter || undefined,
      baptizedAtMCI: data.baptizedAtMCI || undefined,
      isLeader: data.isLeader || undefined,
      generation: data.generation || undefined,
      rh: data.rh || undefined,
      contactName: data.contactName || undefined,
      contactPhone: data.contactPhone || undefined,
      formationSchoolLevel: data.formationSchoolLevel || undefined,
    };

    const hasPersonalInfo = hasPersonalInfoData(data);

    const isProcessSuccess = id
      ? hasPersonalInfo
        ? await updateDiscipleFull(id, discipleData as Record<string, unknown>, personalInfoData, personalInfoId)
        : await updateDisciple(discipleData as Disciple)
      : hasPersonalInfo
        ? await addDiscipleFull(discipleData as Record<string, unknown>, personalInfoData)
        : await addDisciple(discipleData as Disciple);

    if (isProcessSuccess) {
      toast(t("disciples.messages.createSuccess"), {
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      });

      navigate('/disciples');
    } else {
      toast(t("disciples.messages.createError"), {
        icon: <OctagonX className="h-4 w-4 text-red-500" />,
      });
    }
  }

  return <>
    <div className="flex items-center mb-4">
      <h1 className="text-lg font-semibold md:text-2xl">{t("disciples.form.title")}</h1>
    </div>
    <div className="flex items-center items-center justify-center text-start rounded-lg border border-dashed p-4 shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="basic" className="flex items-center gap-2"><Info className="h-4 w-4" /> {t("disciples.basicInfo")}</TabsTrigger>
              <TabsTrigger value="cv" className="flex items-center gap-2"><ScrollText className="h-4 w-4" /> {t("disciples.curriculumVitae")}</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <div className="grid grid-cols-2 grid-flow-row gap-2 w-full">
                <FormField
                  control={form.control}
                  name="identificationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5"><IdCard className="h-3.5 w-3.5 text-muted-foreground" /> {t("disciples.fields.identificationType")}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="CC, TI, CE, etc." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CC">CC</SelectItem>
                          <SelectItem value="TI">TI</SelectItem>
                          <SelectItem value="CE">CE</SelectItem>
                          <SelectItem value="PPT">PPT</SelectItem>
                          <SelectItem value="PASSPORT">Pasaporte</SelectItem>
                          <SelectItem value="OTHER">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="identification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5"><Fingerprint className="h-3.5 w-3.5 text-muted-foreground" /> {t("disciples.identification")}</FormLabel>
                      <FormControl>
                        <Input placeholder="1078934334" type='number' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-muted-foreground" /> {t("disciples.names")}</FormLabel>
                      <FormControl>
                        <Input placeholder="Andres Camilo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-muted-foreground" /> {t("disciples.lastName")}</FormLabel>
                      <FormControl>
                        <Input placeholder="Rodriguez Romero" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-muted-foreground" /> {t("disciples.phone")}</FormLabel>
                      <FormControl>
                        <Input placeholder="3002354034" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-muted-foreground" /> {t("disciples.email")}</FormLabel>
                      <FormControl>
                        <Input placeholder="ejemplo@correo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ministryId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="mt-1 mb-1 flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5 text-muted-foreground" /> {t("disciples.fields.ministry")}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? ministries.find((m) => m.id === field.value)?.name : t("disciples.fields.ministry")}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] p-0">
                          <Command>
                            <CommandInput placeholder="Buscar ministerio..." />
                            <CommandEmpty>No se encontró el ministerio</CommandEmpty>
                            <CommandGroup>
                              {ministries?.map((ministry) => (
                                <CommandItem
                                  value={ministry.id}
                                  key={ministry.id}
                                  onSelect={() => {
                                    form.setValue("ministryId", ministry.id)
                                  }}
                                >
                                  <CheckIcon
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      ministry.id === field.value ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {ministry.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5"><Flag className="h-3.5 w-3.5 text-muted-foreground" /> {t("disciples.fields.status")}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("disciples.fields.status")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="lider">{t("disciples.statusOptions.lider")}</SelectItem>
                          <SelectItem value="prelider">{t("disciples.statusOptions.prelider")}</SelectItem>
                          <SelectItem value="universidad_vida">{t("disciples.statusOptions.universidad_vida")}</SelectItem>
                          <SelectItem value="solo_celula">{t("disciples.statusOptions.solo_celula")}</SelectItem>
                          <SelectItem value="deserto">{t("disciples.statusOptions.deserto")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            <TabsContent value="cv">
              <CurriculumVitaeSection />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-6">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("disciples.form.saving")}</>
              ) : (
                <><Save className='mr-2' /> {t("disciples.form.save")}</>
              )}
            </Button>
          </div>

          {(form.watch('maritalStatus') === 'MARRIED' || form.watch('maritalStatus') === 'FREE_UNION' || maritalRel) && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Heart className="h-5 w-5 text-primary" />
                  {t("disciples.cv.spouseSection")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {maritalRel ? (() => {
                  const isOwner = maritalRel.discipleId === id;
                  const spouseId = isOwner ? maritalRel.spouseId : maritalRel.discipleId;
                  const spouseDisciple = spouseId ? disciplesState.find(d => d.id === spouseId) : null;
                  const spouseName = spouseDisciple
                    ? `${spouseDisciple.name} ${spouseDisciple.lastName}`
                    : (isOwner ? maritalRel.spouseName : '');
                  return (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{spouseName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {spouseId && (
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/disciples/${spouseId}`}>
                            <ExternalLink className="h-4 w-4 mr-1" />
                            {t("disciples.cv.viewSpouse")}
                          </Link>
                        </Button>
                      )}
                      <Button type="button" variant="outline" size="sm" onClick={() => setSpouseModalOpen(true)}>
                        <Pencil className="h-4 w-4 mr-1" />
                        {t("disciples.cv.changeSpouse")}
                      </Button>
                    </div>
                  </div>
                  );
                })() : (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t("disciples.cv.noSpouseAssigned")}</span>
                    {id ? (
                      <Button type="button" variant="outline" size="sm" onClick={() => setSpouseModalOpen(true)}>
                        <User className="h-4 w-4 mr-1" />
                        {t("disciples.cv.addSpouse")}
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">{t("disciples.cv.saveFirst")}</span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

        </form>

        <SpouseSelectorModal
          open={spouseModalOpen}
          onClose={() => setSpouseModalOpen(false)}
          onSelect={async (spouseId) => {
            if (maritalRel?.discipleId && maritalRel.discipleId === id) {
              await DisciplesService.updateMaritalRelationship({ id: maritalRel.id, spouseId, updatedUser: userState?.id || '' });
            } else {
              const input = {
                discipleId: id!,
                attendsChurch: 'YES',
                spouseId,
                createdUser: userState?.id || '',
              };
              await DisciplesService.saveMaritalRelationship(input);
            }
            const rel = await DisciplesService.getMaritalRelationship(id!);
            if (!rel) {
              const relBySpouse = await DisciplesService.getMaritalRelationshipBySpouse(id!);
              setMaritalRel(relBySpouse);
            } else {
              setMaritalRel(rel);
            }
            setSpouseModalOpen(false);
          }}
        />
      </Form>
    </div>
  </>;
};

export default DiscipleForm;
