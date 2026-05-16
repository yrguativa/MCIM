import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, ArrowLeft, GalleryVerticalEnd, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMinistryStore } from "@/src/ministries/store/ministries.store";
import { useDiscipleStore } from "@/src/disciples/store/disciple.store";
import { CellsService } from "@/src/cells/services/cells.services";
import { NETWORK_MAP } from "../components/CellInfoCard";
import {
  createInitialInformationSchema,
  type InitialInformationInput,
} from "../schemas/initialInformationSchema";
import { useInitialInformationStore } from "../store/initialInformation.store";
import AssistantSearch from "../components/AssistantSearch";
import BasicInfoCard from "../components/BasicInfoCard";
import PersonalInfoCard from "../components/PersonalInfoCard";
import ChurchInfoCard from "../components/ChurchInfoCard";
import CellInfoCard from "../components/CellInfoCard";
import WizardHeader from "../components/WizardHeader";

const InitialInformationForm: React.FC = () => {
  const { t } = useTranslation();
  const store = useInitialInformationStore();
  const { getMinistries } = useMinistryStore();
  const getDisciples = useDiscipleStore(state => state.getDisciples);

  const [cellAssistants, setCellAssistants] = useState<{ id: string; name: string; lastName: string }[]>([]);
  const [step, setStep] = useState<1 | 2>(1);

  const schema = useMemo(() => createInitialInformationSchema(t), [t]);

  const form = useForm<InitialInformationInput>({
    resolver: zodResolver(schema),
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
      birthDate: undefined,
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
      cellAddress: "",
      cellNeighborhood: undefined,
      cellDay: "",
      cellTime: "",
      cellHost: "",
      cellTimoteo: "",
    },
  });

  useEffect(() => {
    if (store.mode === "update" && store.foundAssistant?.disciple) {
      const d = store.foundAssistant.disciple;
      const p = store.foundAssistant.personalInfo;

      const values = {
        name: d.name || "",
        lastName: d.lastName || "",
        email: d.email || "",
        phone: d.phone || "",
        identificationType: d.identificationType as "CC" | "TI" | "CE" | "PPT" | "PASSPORT" | "OTHER",
        identification: d.identification || "",
        nationality: p?.nationality as "COLOMBIAN" | "VENEZUELAN" | "FOREIGN",
        gender: p?.gender as "FEMALE" | "MALE",
        maritalStatus: p?.maritalStatus as "SINGLE" | "MARRIED" | "WIDOWED" | "FREE_UNION" | "DIVORCED" | undefined,
        hasChildren: p?.hasChildren as "YES" | "NO",
        childrenAttendChurch: p?.childrenAttendChurch as "YES" | "NO" | undefined,
        address: p?.address || "",
        housingComplex: p?.housingComplex || "",
        neighborhood: p?.neighborhood || "",
        municipality: p?.municipality as "MOSQUERA" | "FUNZA" | "MADRID" | "BOJACA" | "FACATATIVA" | "FONTIBON" | "BOGOTA",
        network: p?.network as "YOUTH" | "PRE" | "ROCAS" | "MEN" | "WOMEN",
        birthDate: p?.birthDate ? new Date(p.birthDate) : undefined,
        ministryId: p?.ministryId || "",
        directLeaderId: d.leaderId || "",
        yearArrivedAtChurch: p?.yearArrivedAtChurch || "",
        hasAttendedEncounter: p?.hasAttendedEncounter as "YES" | "NO",
        yearAttendedEncounter: p?.yearAttendedEncounter || "",
        hasRepeatedEncounter: p?.hasRepeatedEncounter as "YES" | "NO" | undefined,
        hasAttendedReencounter: p?.hasAttendedReencounter as "YES" | "NO",
        yearAttendedReencounter: p?.yearAttendedReencounter || "",
        baptizedAtMCI: p?.baptizedAtMCI as "YES" | "NO",
        isLeader: p?.isLeader as "YES" | "NO" | undefined,
        generation: p?.generation as "12" | "144" | "1728" | "20736" | "248832" | "2985984",
        formationSchoolLevel: p?.formationSchoolLevel as "BASIC_1" | "BASIC_2" | "BASIC_3" | "ADVANCED_1" | "ADVANCED_2" | "ADVANCED_3" | "GRADUATE" | "NOT_STARTED",
        cellAddress: "",
        cellNeighborhood: undefined,
        cellDay: "",
        cellTime: "",
        cellHost: "",
        cellTimoteo: "",
      };

      form.reset(values);

      setTimeout(() => {
        form.setValue("identificationType", d.identificationType as "CC" | "TI" | "CE" | "PPT" | "PASSPORT" | "OTHER");
        form.setValue("nationality", p?.nationality as "COLOMBIAN" | "VENEZUELAN" | "FOREIGN");
        form.setValue("gender", p?.gender as "FEMALE" | "MALE");
        if (p?.maritalStatus) {
          form.setValue("maritalStatus", p?.maritalStatus as "SINGLE" | "MARRIED" | "WIDOWED" | "FREE_UNION" | "DIVORCED");
        }
        form.setValue("hasChildren", p?.hasChildren as "YES" | "NO");
        if (p?.childrenAttendChurch) {
          form.setValue("childrenAttendChurch", p?.childrenAttendChurch as "YES" | "NO");
        }
        form.setValue("municipality", p?.municipality as "MOSQUERA" | "FUNZA" | "MADRID" | "BOJACA" | "FACATATIVA" | "FONTIBON" | "BOGOTA");
        form.setValue("network", p?.network as "YOUTH" | "PRE" | "ROCAS" | "MEN" | "WOMEN");
        if (p?.birthDate) {
          form.setValue("birthDate", new Date(p.birthDate));
        }
        form.setValue("hasAttendedEncounter", p?.hasAttendedEncounter as "YES" | "NO");
        if (p?.hasRepeatedEncounter) {
          form.setValue("hasRepeatedEncounter", p?.hasRepeatedEncounter as "YES" | "NO");
        }
        form.setValue("hasAttendedReencounter", p?.hasAttendedReencounter as "YES" | "NO");
        form.setValue("baptizedAtMCI", p?.baptizedAtMCI as "YES" | "NO");
        if (p?.isLeader) {
          form.setValue("isLeader", p?.isLeader as "YES" | "NO");
        }
        form.setValue("generation", p?.generation as "12" | "144" | "1728" | "20736" | "248832" | "2985984");
        form.setValue("formationSchoolLevel", p?.formationSchoolLevel as "BASIC_1" | "BASIC_2" | "BASIC_3" | "ADVANCED_1" | "ADVANCED_2" | "ADVANCED_3" | "GRADUATE" | "NOT_STARTED");
        if (p?.ministryId) {
          form.setValue("ministryId", p?.ministryId);
        }

        form.clearErrors();
      }, 0);
    }
  }, [store.mode, store.foundAssistant, form]);

  useEffect(() => {
    getMinistries();
    store.loadLeaders();
  }, []);

  useEffect(() => {
    if (store.mode === "create" || store.mode === "idle") {
      form.reset({
        name: "",
        lastName: "",
        email: "",
        phone: "",
        identificationType: undefined,
        identification: store.mode === "create" ? store.searchIdentification : "",
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
        birthDate: undefined,
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
        cellAddress: "",
        cellNeighborhood: undefined,
        cellDay: "",
        cellTime: "",
        cellHost: "",
        cellTimoteo: "",
      });
      setStep(1);
      setCellAssistants([]);
      sessionStorage.removeItem("discipleId");
      sessionStorage.removeItem("personalInfoData");
    }
  }, [store.mode]);

  const step1Fields: (keyof InitialInformationInput)[] = [
    "name", "lastName", "email", "phone", "identificationType", "identification",
    "nationality", "gender", "maritalStatus", "hasChildren", "childrenAttendChurch",
    "address", "housingComplex", "neighborhood", "municipality", "network", "birthDate",
    "ministryId", "directLeaderId", "yearArrivedAtChurch", "hasAttendedEncounter",
    "yearAttendedEncounter", "hasRepeatedEncounter", "hasAttendedReencounter",
    "yearAttendedReencounter", "baptizedAtMCI", "isLeader", "generation", "formationSchoolLevel"
  ];

  const handleSubmit = async (data: InitialInformationInput) => {
    if (step === 1) {
      const isValid = await form.trigger(step1Fields);
      if (!isValid) return;

      if (data.isLeader === "YES") {
        if (store.mode === "update") {
          setStep(2);
          return;
        }
        setStep(2);
      }
    }

    await onSubmit(data);
  };

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

    if (step === 1) {
      if (store.mode === "create") {
        const createdDiscipleId = await store.createAssistant({
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

        if (createdDiscipleId) {
          if (data.isLeader !== "YES") {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            toast.success(t("initialInformation.messages.createSuccess"), {
              icon: <CheckCircle className="h-4 w-4 text-green-500" />,
            });
            store.resetForm();
            form.reset();
          } else {
            sessionStorage.setItem("discipleId", createdDiscipleId);
            sessionStorage.setItem("personalInfoData", JSON.stringify(personalInfoData));
            setStep(2);
          }
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
            ? { id: personalInfoId, ...personalInfoData }
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
    } else {
      let storedDiscipleId = sessionStorage.getItem("discipleId");

      if (!storedDiscipleId && store.mode === "update" && store.foundAssistant?.disciple.id) {
        storedDiscipleId = store.foundAssistant.disciple.id;
      }

      if (!storedDiscipleId) return;

      try {
        const cellNetworkValue = NETWORK_MAP[data.network];
        if (cellNetworkValue) {
          const cellId = await CellsService.createCell({
            id: crypto.randomUUID(),
            leader: storedDiscipleId,
            network: cellNetworkValue,
            host: data.cellHost || "",
            timoteo: data.cellTimoteo || "",
            address: data.cellAddress || "",
            neighborhood: data.cellNeighborhood || 0,
            day: data.cellDay || undefined,
            time: data.cellTime || undefined,
            createdDate: new Date(),
            createdUser: storedDiscipleId,
            assistants: [],
          });

          for (const assistant of cellAssistants) {
            try {
              await CellsService.addCellAssistant(cellId, assistant.id, storedDiscipleId);
            } catch {
              console.error("Failed to add assistant to cell:", assistant.id);
            }
          }
        }

        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        const successMsg = store.mode === "update"
          ? t("initialInformation.messages.updateSuccess")
          : t("initialInformation.messages.createSuccess");
        toast.success(successMsg, {
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        });
        store.resetForm();
        form.reset();
        setCellAssistants([]);
        setStep(1);
        sessionStorage.removeItem("discipleId");
        sessionStorage.removeItem("personalInfoData");
      } catch (error) {
        console.error("Error creating cell for new leader:", error);
        toast.error("Error al crear la célula. Contacta al administrador.");
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
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <WizardHeader currentStep={step} totalSteps={2} />
                
                {step === 1 ? (
                  <>
                    <BasicInfoCard isUpdateMode={store.mode === "update"} />
                    <PersonalInfoCard />
                    <ChurchInfoCard />
                  </>
                ) : (
                  <>
                    <CellInfoCard
                      assistants={cellAssistants}
                      onAddAssistant={(a) => {
                        setCellAssistants(prev => [...prev, a]);
                        getDisciples();
                      }}
                      onRemoveAssistant={(id) => setCellAssistants(prev => prev.filter(a => a.id !== id))}
                    />
                  </>
                )}

                <Separator />

                <div className="flex justify-between gap-3 pb-8">
                  <div>
                    {step === 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Atrás
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
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
                          {step === 1 
                            ? t("initialInformation.actions.saveAndContinue") 
                            : t("initialInformation.actions.save")}
                        </>
                      )}
                    </Button>
                  </div>
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