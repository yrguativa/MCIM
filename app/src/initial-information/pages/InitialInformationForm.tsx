import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      names: "",
      lastNames: "",
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
    if (store.foundAssistant?.assistant) {
      const a = store.foundAssistant.assistant;
      const p = store.foundAssistant.personalInfo;

      form.reset({
        names: a.names || "",
        lastNames: a.lastNames || "",
        email: a.email || "",
        phone: a.phone || "",
        identificationType: (a.identificationType as InitialInformationInput["identificationType"]) || undefined,
        identification: a.identification || "",
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
        directLeaderId: a.directLeaderId || "",
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
        createAssistantInput: {
          names: data.names,
          lastNames: data.lastNames,
          email: data.email || undefined,
          phone: data.phone,
          identificationType: data.identificationType,
          identification: data.identification,
          directLeaderId: data.directLeaderId || undefined,
        },
        createPersonalInfoInput: personalInfoData,
      });

      if (success) {
        store.resetForm();
        form.reset();
      }
    } else if (store.mode === "update" && store.foundAssistant?.assistant.id) {
      const assistantId = store.foundAssistant.assistant.id;
      const personalInfoId = store.foundAssistant.personalInfo?.id;

      const success = await store.updateAssistant(assistantId, {
        updateAssistantInput: {
          names: data.names,
          lastNames: data.lastNames,
          email: data.email || undefined,
          phone: data.phone,
          identificationType: data.identificationType,
          directLeaderId: data.directLeaderId || undefined,
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

  if (store.mode === "idle") {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">{t("initialInformation.pageTitle")}</h1>
          <p className="text-muted-foreground mt-2">
            {t("initialInformation.pageDescription")}
          </p>
        </div>
        <AssistantSearch />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t("initialInformation.pageTitle")}</h1>
          <p className="text-muted-foreground mt-1">
            {store.mode === "create"
              ? t("initialInformation.search.newRecord")
              : t("initialInformation.search.updatingRecord")}
          </p>
        </div>
        <Button variant="outline" onClick={store.resetForm}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("initialInformation.actions.newSearch")}
        </Button>
      </div>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <BasicInfoCard isUpdateMode={store.mode === "update"} />
          <PersonalInfoCard />
          <ChurchInfoCard />

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={store.resetForm}
            >
              {t("initialInformation.actions.cancel")}
            </Button>
            <Button type="submit" disabled={store.isSaving}>
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
