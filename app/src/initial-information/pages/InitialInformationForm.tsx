import React, { useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, ArrowLeft, GalleryVerticalEnd, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMinistryStore } from "@/src/ministries/store/ministries.store";
import {
  createInitialInformationSchema,
  type InitialInformationInput,
} from "../schemas/initialInformationSchema";
import { useInitialInformationStore } from "../store/initialInformation.store";
import AssistantSearch from "../components/AssistantSearch";
import BasicInfoCard from "../components/BasicInfoCard";
import PersonalInfoCard from "../components/PersonalInfoCard";
import ChurchInfoCard from "../components/ChurchInfoCard";

const InitialInformationForm: React.FC = () => {
  const { t } = useTranslation();
  const store = useInitialInformationStore();
  const { getMinistries } = useMinistryStore();

  const schema = useMemo(() => createInitialInformationSchema(t), [t]);

  const buildUpdateValues = useCallback((): InitialInformationInput | null => {
    if (store.mode !== "update" || !store.foundAssistant?.disciple) return null;
    const d = store.foundAssistant.disciple;
    const p = store.foundAssistant.personalInfo;
    return {
      name: d.name || "",
      lastName: d.lastName || "",
      email: d.email || "",
      phone: d.phone || "",
      identificationType:
        (d.identificationType as InitialInformationInput["identificationType"]) ||
        "",
      identification: d.identification || "",
      nationality:
        (p?.nationality as InitialInformationInput["nationality"]) || "",
      gender: (p?.gender as InitialInformationInput["gender"]) || "",
      maritalStatus:
        (p?.maritalStatus as InitialInformationInput["maritalStatus"]) || undefined,
      hasChildren:
        (p?.hasChildren as InitialInformationInput["hasChildren"]) || "",
      childrenAttendChurch:
        (p?.childrenAttendChurch as InitialInformationInput["childrenAttendChurch"]) ||
        undefined,
      address: p?.address || "",
      housingComplex: p?.housingComplex || "",
      neighborhood: p?.neighborhood || "",
      municipality:
        (p?.municipality as InitialInformationInput["municipality"]) || "",
      network: (p?.network as InitialInformationInput["network"]) || "",
      birthDate: p?.birthDate ? new Date(p.birthDate) : (undefined as unknown as Date),
      ministryId: p?.ministryId || "",
      directLeaderId: d.leaderId || "",
      yearArrivedAtChurch: p?.yearArrivedAtChurch || "",
      hasAttendedEncounter:
        (p?.hasAttendedEncounter as InitialInformationInput["hasAttendedEncounter"]) ||
        "",
      yearAttendedEncounter: p?.yearAttendedEncounter || "",
      hasRepeatedEncounter:
        (p?.hasRepeatedEncounter as InitialInformationInput["hasRepeatedEncounter"]) ||
        undefined,
      hasAttendedReencounter:
        (p?.hasAttendedReencounter as InitialInformationInput["hasAttendedReencounter"]) ||
        "",
      yearAttendedReencounter: p?.yearAttendedReencounter || "",
      baptizedAtMCI:
        (p?.baptizedAtMCI as InitialInformationInput["baptizedAtMCI"]) || "",
      isLeader:
        (p?.isLeader as InitialInformationInput["isLeader"]) || undefined,
      generation:
        (p?.generation as InitialInformationInput["generation"]) || "",
      formationSchoolLevel:
        (p?.formationSchoolLevel as InitialInformationInput["formationSchoolLevel"]) ||
        "",
    } as unknown as InitialInformationInput;
  }, [store.foundAssistant, store.mode]);

  const form = useForm<InitialInformationInput>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      phone: "",
      identificationType: "",
      identification: "",
      nationality: "",
      gender: "",
      maritalStatus: undefined,
      hasChildren: "",
      childrenAttendChurch: undefined,
      address: "",
      housingComplex: "",
      neighborhood: "",
      municipality: "",
      network: "",
      birthDate: undefined as unknown as Date,
      ministryId: "",
      directLeaderId: "",
      yearArrivedAtChurch: "",
      hasAttendedEncounter: "",
      yearAttendedEncounter: "",
      hasRepeatedEncounter: undefined,
      hasAttendedReencounter: "",
      yearAttendedReencounter: "",
      baptizedAtMCI: "",
      isLeader: undefined,
      generation: "",
      formationSchoolLevel: "",
    } as InitialInformationInput,
  });

  useEffect(() => {
    const values = buildUpdateValues();
    if (values) {
      form.reset(values);
    }
  }, [buildUpdateValues, form]);

  useEffect(() => {
    getMinistries();
    store.loadLeaders();
  }, []);

  const onSubmit = async (data: InitialInformationInput) => {
    const personalInfoData = {
      nationality: data.nationality,
      gender: data.gender,
      maritalStatus: data.maritalStatus || undefined,
      hasChildren: data.hasChildren,
      childrenAttendChurch: data.childrenAttendChurch || undefined,
      address: data.address,
      housingComplex: data.housingComplex || undefined,
      neighborhood: data.neighborhood,
      municipality: data.municipality,
      network: data.network,
      birthDate: data.birthDate?.toISOString() || undefined,
      ministryId: data.ministryId,
      yearArrivedAtChurch: data.yearArrivedAtChurch,
      hasAttendedEncounter: data.hasAttendedEncounter,
      yearAttendedEncounter: data.yearAttendedEncounter || undefined,
      hasRepeatedEncounter: data.hasRepeatedEncounter || undefined,
      hasAttendedReencounter: data.hasAttendedReencounter,
      yearAttendedReencounter: data.yearAttendedReencounter || undefined,
      baptizedAtMCI: data.baptizedAtMCI,
      isLeader: data.isLeader || undefined,
      generation: data.generation,
      formationSchoolLevel: data.formationSchoolLevel,
    };

    if (store.mode === "create") {
      const success = await store.createAssistant({
        createDiscipleInput: {
          name: data.name,
          lastName: data.lastName,
          email: data.email || undefined,
          phone: data.phone,
          identificationType: data.identificationType,
          identification: data.identification,
          leaderId: data.directLeaderId || undefined,
          ministryId: data.ministryId,
          createdUser: "initial-info-form",
        },
        createPersonalInfoInput: personalInfoData,
      });

      if (success) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        toast.success(t("initialInformation.messages.createSuccess"), {
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        });
        store.resetForm();
        form.reset();
      }
    } else if (store.mode === "update" && store.foundAssistant?.disciple.id) {
      const discipleId = store.foundAssistant.disciple.id;
      const personalInfoId = store.foundAssistant.personalInfo?.id;

      const success = await store.updateAssistant(discipleId, {
        updateDiscipleInput: {
          name: data.name,
          lastName: data.lastName,
          email: data.email || undefined,
          phone: data.phone,
          identificationType: data.identificationType,
          leaderId: data.directLeaderId || undefined,
          ministryId: data.ministryId,
          createdUser: store.foundAssistant.disciple.createdUser,
          createdDate: store.foundAssistant.disciple.createdDate,
          identification: data.identification,
        },
        updatePersonalInfoInput: personalInfoId
          ? {
              id: personalInfoId,
              ...personalInfoData,
            }
          : personalInfoData,
      });

      if (success) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        toast.success(t("initialInformation.messages.updateSuccess"), {
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        });
        store.resetForm();
        form.reset();
      }
    }
  };

  return (
    <div className="min-h-svh flex flex-col bg-gradient-to-b from-background via-background to-muted/30">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <span className="font-semibold text-lg">{t("AppTitle")}</span>
          </div>
          {store.mode !== "idle" && (
            <Button variant="ghost" size="sm" onClick={store.resetForm}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("initialInformation.actions.newSearch")}
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 w-full">
        {store.mode === "idle" ? (
          <div className="flex items-center justify-center min-h-[calc(100vh-57px)] px-4">
            <div className="w-full max-w-lg space-y-8">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                  {t("initialInformation.pageTitle")}
                </h1>
                <p className="text-muted-foreground text-balance max-w-sm mx-auto">
                  {t("initialInformation.pageDescription")}
                </p>
              </div>
              <AssistantSearch />
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight">
                {store.mode === "create"
                  ? t("initialInformation.search.newRecord")
                  : t("initialInformation.search.updatingRecord")}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {store.foundAssistant?.disciple.name}{" "}
                {store.foundAssistant?.disciple.lastName}
              </p>
            </div>

            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <BasicInfoCard isUpdateMode={store.mode === "update"} />
                <PersonalInfoCard />
                <ChurchInfoCard />

                <Separator />

                <div className="flex justify-end gap-3 pb-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={store.resetForm}
                  >
                    {t("initialInformation.actions.cancel")}
                  </Button>
                  <Button type="submit" disabled={store.isSaving} size="lg">
                    {store.isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("initialInformation.actions.saving")}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {t("initialInformation.actions.save")}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        )}
      </main>
    </div>
  );
};

export default InitialInformationForm;
