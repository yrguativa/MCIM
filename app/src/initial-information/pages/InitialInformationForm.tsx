import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, ArrowLeft, GalleryVerticalEnd } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMinistryStore } from "@/src/ministries/store/ministries.store";
import {
  InitialInformationSchema,
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

  const form = useForm<InitialInformationInput>({
    resolver: zodResolver(InitialInformationSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      phone: "",
      identificationType: undefined,
      identification: "",
      nationality: undefined,
      gender: undefined,
      maritalStatus: undefined,
      hasChildren: undefined,
      childrenAttendChurch: undefined,
      address: "",
      housingComplex: "",
      neighborhood: "",
      municipality: undefined,
      network: undefined,
      birthDate: "",
      ministryId: "",
      directLeaderId: "",
      yearArrivedAtChurch: "",
      hasAttendedEncounter: undefined,
      yearAttendedEncounter: "",
      hasRepeatedEncounter: undefined,
      hasAttendedReencounter: undefined,
      yearAttendedReencounter: "",
      baptizedAtMCI: undefined,
      isLeader: undefined,
      generation: undefined,
      formationSchoolLevel: undefined,
    },
  });

  useEffect(() => {
    getMinistries();
    store.loadLeaders();
  }, []);

  useEffect(() => {
    if (store.foundAssistant?.disciple) {
      const d = store.foundAssistant.disciple;
      const p = store.foundAssistant.personalInfo;

      form.reset({
        name: d.name || "",
        lastName: d.lastName || "",
        email: d.email || "",
        phone: d.phone || "",
        identificationType: (d.identificationType as InitialInformationInput["identificationType"]) || undefined,
        identification: d.identification || "",
        nationality: (p?.nationality as InitialInformationInput["nationality"]) || undefined,
        gender: (p?.gender as InitialInformationInput["gender"]) || undefined,
        maritalStatus: (p?.maritalStatus as InitialInformationInput["maritalStatus"]) || undefined,
        hasChildren: (p?.hasChildren as InitialInformationInput["hasChildren"]) || undefined,
        childrenAttendChurch: (p?.childrenAttendChurch as InitialInformationInput["childrenAttendChurch"]) || undefined,
        address: p?.address || "",
        housingComplex: p?.housingComplex || "",
        neighborhood: p?.neighborhood || "",
        municipality: (p?.municipality as InitialInformationInput["municipality"]) || undefined,
        network: (p?.network as InitialInformationInput["network"]) || undefined,
        birthDate: p?.birthDate
          ? formatDateToDDMMYYYY(p.birthDate)
          : "",
        ministryId: p?.ministryId || "",
        directLeaderId: d.leaderId || "",
        yearArrivedAtChurch: p?.yearArrivedAtChurch || "",
        hasAttendedEncounter: (p?.hasAttendedEncounter as InitialInformationInput["hasAttendedEncounter"]) || undefined,
        yearAttendedEncounter: p?.yearAttendedEncounter || "",
        hasRepeatedEncounter: (p?.hasRepeatedEncounter as InitialInformationInput["hasRepeatedEncounter"]) || undefined,
        hasAttendedReencounter: (p?.hasAttendedReencounter as InitialInformationInput["hasAttendedReencounter"]) || undefined,
        yearAttendedReencounter: p?.yearAttendedReencounter || "",
        baptizedAtMCI: (p?.baptizedAtMCI as InitialInformationInput["baptizedAtMCI"]) || undefined,
        isLeader: (p?.isLeader as InitialInformationInput["isLeader"]) || undefined,
        generation: (p?.generation as InitialInformationInput["generation"]) || undefined,
        formationSchoolLevel: (p?.formationSchoolLevel as InitialInformationInput["formationSchoolLevel"]) || undefined,
      });
    }
  }, [store.foundAssistant]);

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
      birthDate: parseDDMMYYYY(data.birthDate),
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
          : undefined,
      });

      if (success) {
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

function formatDateToDDMMYYYY(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return "";
  }
}

function parseDDMMYYYY(dateStr: string): string {
  try {
    const [day, month, year] = dateStr.split("/");
    const date = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
    return date.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

export default InitialInformationForm;
