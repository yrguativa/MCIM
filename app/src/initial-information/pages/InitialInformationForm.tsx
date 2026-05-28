import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, ArrowLeft, GalleryVerticalEnd, CheckCircle2, Plus } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMinistryStore } from "@/src/ministries/store/ministries.store";
import { CellsService } from "@/src/cells/services/cells.services";
import CellInfoCard, { type CellData, NETWORK_MAP } from "../components/CellInfoCard";
import {
  createInitialInformationSchema,
  type InitialInformationInput,
} from "../schemas/initialInformationSchema";
import { useInitialInformationStore } from "../store/initialInformation.store";
import { InitialInformationService } from "../services/initialInformation.services";
import { ChildrenService } from "@/src/disciples/services/children.services";
import AssistantSearch from "../components/AssistantSearch";
import BasicInfoCard from "../components/BasicInfoCard";
import PersonalInfoCard from "../components/PersonalInfoCard";
import type { ChildItem } from "../components/ChildrenSection";
import ChurchInfoCard from "../components/ChurchInfoCard";
import WizardHeader from "../components/WizardHeader";

const InitialInformationForm: React.FC = () => {
  const { t } = useTranslation();
  const store = useInitialInformationStore();
  const { getMinistries } = useMinistryStore();

  const [step, setStep] = useState<1 | 2>(1);
  const [cells, setCells] = useState<CellData[]>([
    { type: 'celula', address: '', neighborhood: undefined, day: '', time: '', host: '', timoteo: '', yearOpened: undefined, assistants: [] },
  ]);

  const defaultCell = (): CellData => ({
    type: 'celula', address: '', neighborhood: undefined, day: '', time: '', host: '', timoteo: '', yearOpened: undefined, assistants: [],
  });

  const schema = useMemo(() => createInitialInformationSchema(t), [t]);

  const form = useForm<InitialInformationInput>({
    resolver: zodResolver(schema as any),
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
      attendedAnotherChurch: undefined,
      yearArrivedAtOtherChurch: "",
      otherChurchName: "",
      hasAttendedEncounter: undefined,
      yearAttendedEncounter: "",
      hasRepeatedEncounter: undefined,
      hasAttendedReencounter: undefined,
      yearAttendedReencounter: "",
      baptizedAtMCI: undefined,
      isLeader: undefined,
      generation: undefined,
      formationSchoolLevel: undefined,
      rh: undefined,
      contactName: "",
      contactPhone: "",
      spouseAttendsChurch: undefined,
      spouseId: "",
      spouseName: "",
    },
  });

  const [maritalData, setMaritalData] = useState<{ id: string; discipleId: string; attendsChurch: string; spouseId?: string; spouseName?: string } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [childrenList, setChildrenList] = useState<ChildItem[]>([]);

  useEffect(() => {
    if (store.mode === "update" && store.foundAssistant?.disciple) {
      const d = store.foundAssistant.disciple;
      const p = store.foundAssistant.personalInfo;

      InitialInformationService.findMaritalRelationship(d.id).then((rel) => {
        setMaritalData(rel);

        if (rel?.spouseId) {
          ChildrenService.getByParent(rel.spouseId).then(spouseChildren => {
            setChildrenList([
              ...spouseChildren.map(c => ({
                tempId: c.id,
                attendsChurch: c.attendsChurch,
                childDiscipleId: c.childDiscipleId,
                name: c.name,
                age: c.age,
              })),
            ]);
          });
        }
      });

      ChildrenService.getByParent(d.id).then(existingChildren => {
        if (existingChildren.length > 0) {
          setChildrenList(prev => [
            ...existingChildren.map(c => ({
              tempId: c.id,
              attendsChurch: c.attendsChurch,
              childDiscipleId: c.childDiscipleId,
              name: c.name,
              age: c.age,
            })),
            ...prev.filter(p => p.tempId.startsWith("new-")),
          ]);
        }
      });

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
        attendedAnotherChurch: p?.attendedAnotherChurch as "YES" | "NO" | undefined,
        yearArrivedAtOtherChurch: p?.yearArrivedAtOtherChurch || "",
        otherChurchName: p?.otherChurchName || "",
        hasAttendedEncounter: p?.hasAttendedEncounter as "YES" | "NO",
        yearAttendedEncounter: p?.yearAttendedEncounter || "",
        hasRepeatedEncounter: p?.hasRepeatedEncounter as "YES" | "NO" | undefined,
        hasAttendedReencounter: p?.hasAttendedReencounter as "YES" | "NO",
        yearAttendedReencounter: p?.yearAttendedReencounter || "",
        baptizedAtMCI: p?.baptizedAtMCI as "YES" | "NO",
        isLeader: p?.isLeader as "YES" | "NO" | undefined,
        generation: p?.generation as "YES" | "NO",
        formationSchoolLevel: p?.formationSchoolLevel as "BASIC_1" | "BASIC_2" | "BASIC_3" | "ADVANCED_1" | "ADVANCED_2" | "ADVANCED_3" | "GRADUATE" | "NOT_STARTED",
        rh: p?.rh as "O_POSITIVE" | "O_NEGATIVE" | "A_POSITIVE" | "A_NEGATIVE" | "B_POSITIVE" | "B_NEGATIVE" | "AB_POSITIVE" | "AB_NEGATIVE" | undefined,
        contactName: p?.contactName || "",
        contactPhone: p?.contactPhone || "",
        spouseAttendsChurch: undefined,
        spouseId: "",
        spouseName: "",
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
        if (p?.generation) {
          form.setValue("generation", p?.generation as "YES" | "NO");
        }
        if (p?.rh) {
          form.setValue("rh", p?.rh as "O_POSITIVE" | "O_NEGATIVE" | "A_POSITIVE" | "A_NEGATIVE" | "B_POSITIVE" | "B_NEGATIVE" | "AB_POSITIVE" | "AB_NEGATIVE");
        }
        form.setValue("formationSchoolLevel", p?.formationSchoolLevel as "BASIC_1" | "BASIC_2" | "BASIC_3" | "ADVANCED_1" | "ADVANCED_2" | "ADVANCED_3" | "GRADUATE" | "NOT_STARTED");
        if (p?.ministryId) {
          form.setValue("ministryId", p?.ministryId);
        }

        form.clearErrors();
      }, 0);
    }
  }, [store.mode, store.foundAssistant, form]);

  useEffect(() => {
    if (maritalData) {
      form.setValue("spouseAttendsChurch", maritalData.attendsChurch as "YES" | "NO");
      if (maritalData.spouseId) {
        form.setValue("spouseId", maritalData.spouseId);
      }
      if (maritalData.spouseName) {
        form.setValue("spouseName", maritalData.spouseName);
      }
    }
  }, [maritalData, form]);

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
        attendedAnotherChurch: undefined,
        yearArrivedAtOtherChurch: "",
        otherChurchName: "",
        hasAttendedEncounter: undefined,
        yearAttendedEncounter: "",
        hasRepeatedEncounter: undefined,
        hasAttendedReencounter: undefined,
        yearAttendedReencounter: "",
        baptizedAtMCI: undefined,
        isLeader: undefined,
        generation: undefined,
        formationSchoolLevel: undefined,
        rh: undefined,
        contactName: "",
        contactPhone: "",
        spouseAttendsChurch: undefined,
        spouseId: "",
        spouseName: "",
      });
      setStep(1);
      setCells([defaultCell()]);
      setMaritalData(null);
      sessionStorage.removeItem("discipleId");
      sessionStorage.removeItem("personalInfoData");
    }
  }, [store.mode]);

  const step1Fields: (keyof InitialInformationInput)[] = [
    "name", "lastName", "email", "phone", "identificationType", "identification",
    "nationality", "gender", "maritalStatus", "hasChildren", "childrenAttendChurch",
    "address", "housingComplex", "neighborhood", "municipality", "network", "birthDate",
    "ministryId", "directLeaderId", "yearArrivedAtChurch", "attendedAnotherChurch",
    "yearArrivedAtOtherChurch", "otherChurchName", "hasAttendedEncounter",
    "yearAttendedEncounter", "hasRepeatedEncounter", "hasAttendedReencounter",
    "yearAttendedReencounter", "baptizedAtMCI", "isLeader", "generation", "formationSchoolLevel",
    "rh", "contactName", "contactPhone",
    "spouseAttendsChurch", "spouseId", "spouseName"
  ];

  const handleSubmit = async (data: InitialInformationInput) => {
    if (step === 1) {
      const isValid = await form.trigger(step1Fields);
      if (!isValid) {
        toast.error(t("initialInformation.validation.formErrors"), {
          description: t("initialInformation.validation.checkFields"),
        });
        return;
      }

      await onSubmit(data);
    } else {
      await onSubmit(data);
    }
  };

  const saveMaritalRelation = async (discipleId: string, data: InitialInformationInput) => {
    if (data.maritalStatus !== "MARRIED" && data.maritalStatus !== "FREE_UNION") return;
    if (!data.spouseAttendsChurch) return;

    await InitialInformationService.saveMaritalRelationship({
      discipleId,
      attendsChurch: data.spouseAttendsChurch,
      spouseId: data.spouseAttendsChurch === "YES" ? data.spouseId || undefined : undefined,
      spouseName: data.spouseAttendsChurch === "NO" ? data.spouseName || undefined : undefined,
      createdUser: "initial-info-form",
    });
  };

  const onSubmit = async (data: InitialInformationInput) => {
    let computedStatus: string | undefined;
    if (data.hasAttendedReencounter === "YES") {
      computedStatus = "prelider";
    } else if (data.isLeader === "NO") {
      computedStatus = "solo_celula";
    }

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
      attendedAnotherChurch: data.attendedAnotherChurch || undefined,
      yearArrivedAtOtherChurch: data.yearArrivedAtOtherChurch || undefined,
      otherChurchName: data.otherChurchName || undefined,
      hasAttendedEncounter: data.hasAttendedEncounter,
      yearAttendedEncounter: data.yearAttendedEncounter || undefined,
      hasRepeatedEncounter: data.hasRepeatedEncounter || undefined,
      hasAttendedReencounter: data.hasAttendedReencounter,
      yearAttendedReencounter: data.yearAttendedReencounter || undefined,
      baptizedAtMCI: data.baptizedAtMCI,
      isLeader: data.isLeader || undefined,
      generation: data.generation,
      formationSchoolLevel: data.formationSchoolLevel,
      rh: data.rh,
      contactName: data.contactName || undefined,
      contactPhone: data.contactPhone || undefined,
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
            status: computedStatus,
          },
          createPersonalInfoInput: personalInfoData,
        });

        if (createdDiscipleId) {
          await saveMaritalRelation(createdDiscipleId, data);

          if (data.hasChildren === "YES" && childrenList.length > 0) {
            const batchInputs = childrenList.map(c => ({
              parentId: createdDiscipleId,
              attendsChurch: c.attendsChurch,
              name: c.name,
              age: c.age,
              childDiscipleId: c.childDiscipleId,
              createdUser: "initial-info-form",
            }));
            await ChildrenService.createBatch(batchInputs);

            if (data.spouseAttendsChurch === "YES" && data.spouseId) {
              const spouseBatch = childrenList.map(c => ({
                parentId: data.spouseId!,
                attendsChurch: c.attendsChurch,
                name: c.name,
                age: c.age,
                childDiscipleId: c.childDiscipleId,
                createdUser: "initial-info-form",
              }));
              await ChildrenService.createBatch(spouseBatch);
            }
          }

          if (data.isLeader !== "YES") {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setShowSuccessModal(true);
          } else {
            sessionStorage.setItem("discipleId", createdDiscipleId);
            sessionStorage.setItem("personalInfoData", JSON.stringify(personalInfoData));
            setStep(2);
          }
        } else {
          toast.error(t("initialInformation.validation.formErrors"), {
            description: store.saveError || t("initialInformation.validation.saveError"),
          });
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
            status: computedStatus,
          },
          updatePersonalInfoInput: personalInfoId
            ? { id: personalInfoId, ...personalInfoData }
            : personalInfoData,
        });

        if (success) {
          await saveMaritalRelation(discipleId, data);

          const deleteOldChildren = async () => {
            const existing = await ChildrenService.getByParent(discipleId);
            for (const c of existing) {
              await ChildrenService.delete(c.id);
            }
            if (data.spouseAttendsChurch === "YES" && data.spouseId) {
              const spouseExisting = await ChildrenService.getByParent(data.spouseId);
              for (const c of spouseExisting) {
                await ChildrenService.delete(c.id);
              }
            }
          };
          await deleteOldChildren();

          if (data.hasChildren === "YES" && childrenList.length > 0) {
            await ChildrenService.createBatch(
              childrenList.map(c => ({
                parentId: discipleId,
                attendsChurch: c.attendsChurch,
                name: c.name,
                age: c.age,
                childDiscipleId: c.childDiscipleId,
                createdUser: "initial-info-form",
              }))
            );

            if (data.spouseAttendsChurch === "YES" && data.spouseId) {
              await ChildrenService.createBatch(
                childrenList.map(c => ({
                  parentId: data.spouseId!,
                  attendsChurch: c.attendsChurch,
                  name: c.name,
                  age: c.age,
                  childDiscipleId: c.childDiscipleId,
                  createdUser: "initial-info-form",
                }))
              );
            }
          }

          if (data.isLeader !== "YES") {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setShowSuccessModal(true);
          } else {
            sessionStorage.setItem("discipleId", discipleId);
            sessionStorage.setItem("personalInfoData", JSON.stringify(personalInfoData));
            setStep(2);
          }
        }
      }
    } else {
      let storedDiscipleId = sessionStorage.getItem("discipleId");

      if (!storedDiscipleId && store.mode === "update" && store.foundAssistant?.disciple.id) {
        storedDiscipleId = store.foundAssistant.disciple.id;
      }

      if (!storedDiscipleId) {
        toast.error(t("initialInformation.validation.formErrors"), {
          description: t("initialInformation.validation.saveDiscipleFirst"),
        });
        return;
      }

      try {
        const cellNetworkValue = NETWORK_MAP[data.network];
        if (!cellNetworkValue) return;

        for (const cell of cells) {
          const cellId = await CellsService.createCell({
            id: crypto.randomUUID(),
            leader: storedDiscipleId,
            network: cellNetworkValue,
            cellType: cell.type || 'celula',
            host: (cell.type === 'celula' || cell.type === 'celula_anexa') ? cell.host || "" : "",
            timoteo: (cell.type === 'celula' || cell.type === 'celula_anexa') ? cell.timoteo || "" : "",
            address: cell.address || "",
            neighborhood: cell.neighborhood || 0,
            day: cell.day || undefined,
            time: cell.time || undefined,
            yearOpened: cell.yearOpened || undefined,
            createdDate: new Date(),
            createdUser: storedDiscipleId,
            assistants: [],
          });

          for (const assistant of cell.assistants) {
            try {
              await CellsService.addCellAssistant(cellId, assistant.id, storedDiscipleId);
            } catch {
              console.error("Failed to add assistant to cell:", assistant.id);
            }
          }
        }

        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        sessionStorage.removeItem("discipleId");
        sessionStorage.removeItem("personalInfoData");
        setShowSuccessModal(true);
      } catch (error) {
        console.error("Error creating cell for new leader:", error);
        toast.error("Error al crear la célula. Contacta al administrador.");
      }
    }
  };

  return (
    <div className="min-h-svh flex flex-col bg-gradient-to-b from-background via-background to-muted/30">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 animate-in fade-in slide-in-from-top-3 duration-500">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <span className="font-semibold text-lg">{t("AppTitle")}</span>
          </div>
          {store.mode !== "idle" && (
            <Button variant="ghost" size="sm" onClick={store.resetForm} className="hidden sm:inline-flex">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("initialInformation.actions.newSearch")}
            </Button>
          )}
          {store.mode !== "idle" && (
            <Button variant="ghost" size="icon" onClick={store.resetForm} className="sm:hidden">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 w-full">
        {store.mode === "idle" ? (
          <div className="flex items-center justify-center min-h-[calc(100vh-57px)] px-4">
            <div className="w-full max-w-lg space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex justify-center">
              <div className="flex flex-col items-center gap-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 264 263" className="w-28 h-28 sm:w-32 sm:h-32 animate-in fade-in zoom-in-95 duration-700" fill="none">
                    <path fill="#111827" d="m131.529 0 .993.001c3.126.004 6.242.033 9.359.301l.917.076c10.046.829 19.943 2.78 43.459 11.17l.355.16c3.013 1.36 6.015 2.808 8.895 4.43q.387.219.776.431c1.42.787 2.809 1.623 4.195 2.469q.4.243.8.483c4.932 2.963 9.602 6.368 14.059 9.994l.471.382a87 87 0 0 1 2.001 1.678q.261.224.525.445a49 49 0 0 1 1.929 1.713q.433.406.882.795.577.503 1.135 1.026l.203.19a63 63 0 0 1 1.737 1.702c.32.323.642.632.988.926.331.283.611.588.893.919.371.42.777.805 1.177 1.197a26 26 0 0 1 1.518 1.585c.275.317.566.62.854.925.471.5.937 1.004 1.384 1.526l.26.301.449.522q.487.566.979 1.128c.465.532.923 1.066 1.362 1.62q.334.419.674.832.851 1.034 1.665 2.098l.524.683c.704.913 1.399 1.83 2.063 2.772l.384.54a161 161 0 0 1 2.181 3.142l.552.81a59 59 0 0 1 1.995 3.135q.358.603.738 1.193c1.775 2.808 3.351 5.743 4.86 8.699l.288.56a105 105 0 0 1 2.882 6.118l.395.895c1.369 3.111 2.574 6.293 3.668 9.51l.156.46c3.07 8.99 5.075 18.334 6.419 31.349l.076.887c.546 6.435.518 13.099-.027 19.532l-.066.823c-.777 9.964-2.742 19.844-11.423 43.84l-.32.699c-1.233 2.677-2.534 5.334-3.983 7.902l-.472.849a119 119 0 0 1-2.704 4.602c-.87 1.424-1.792 2.814-2.72 4.201l-.178.266a128 128 0 0 1-2.374 3.432l-.192.269a101 101 0 0 1-2.378 3.176l-.17.22a104 104 0 0 1-3.202 3.955q-.426.5-.841 1.011c-.358.438-.731.86-1.113 1.278q-.281.309-.555.623-.5.569-1.009 1.127l-.429.477c-1.397 1.558-2.866 3.042-4.35 4.517l-.841.838-.658.655-.31.309a30 30 0 0 1-1.744 1.625 28 28 0 0 0-.395.366l-.198.186-.198.186q-.774.732-1.581 1.428l-.17.145-.485.414-.361.308-.184.157-.543.464a93 93 0 0 1-2.112 1.76l-.36.294a87 87 0 0 1-2.673 2.091l-.731.56a49 49 0 0 1-2.76 1.999q-.605.404-1.191.837a57 57 0 0 1-2.806 1.921l-.249.163a136 136 0 0 1-6.545 4.03c-4.245 2.459-8.624 4.688-13.134 6.625q-.444.192-.887.388c-3.126 1.364-6.323 2.565-9.554 3.654l-.461.156c-9.028 3.057-18.412 5.053-31.482 6.392l-.89.076c-6.46.543-13.156.521-19.615-.027l-.827-.067c-9.188-.74-18.314-2.417-47.877-13.244l-.338-.166a90 90 0 0 1-4.13-2.142l-.864-.474a101 101 0 0 1-4-2.335 76 76 0 0 0-1.172-.702c-1.304-.764-2.559-1.594-3.812-2.437q-.462-.31-.927-.616a77 77 0 0 1-1.523-1.039l-.256-.179a129 129 0 0 1-4.396-3.221l-.59-.448a85 85 0 0 1-2.325-1.844l-.477-.387a107 107 0 0 1-1.906-1.585l-.344-.291a70 70 0 0 1-2.056-1.799q-.307-.28-.624-.551a53 53 0 0 1-1.322-1.196l-.541-.499a109 109 0 0 1-3.224-3.112l-.816-.812-.525-.524-.243-.241a22 22 0 0 1-1.194-1.28 9 9 0 0 0-.5-.518 15 15 0 0 1-.839-.907q-.29-.327-.59-.647a30 30 0 0 1-1.363-1.575 20 20 0 0 0-.717-.809 30 30 0 0 1-1.251-1.462q-.315-.383-.633-.764a100 100 0 0 1-1.97-2.449l-.124-.158a134 134 0 0 1-3.51-4.712 118 118 0 0 1-4.966-7.533l-.186-.307a151 151 0 0 1-4.064-7.174l-.1-.186a124 124 0 0 1-3.075-6.221l-.255-.548a99 99 0 0 1-.438-.957l-.13-.278-.112-.253-.098-.217c-.074-.344.128-.551.309-.834a276 276 0 0 1 2.708-3.922q.624-.894 1.24-1.792.819-1.193 1.65-2.377.835-1.196 1.661-2.397.928-1.348 1.866-2.688.729-1.04 1.445-2.086a282 282 0 0 1 1.65-2.377q.835-1.196 1.662-2.397 1.036-1.504 2.084-3.002.84-1.203 1.672-2.412.928-1.348 1.866-2.688.728-1.04 1.445-2.086.819-1.193 1.65-2.377.835-1.196 1.662-2.397.927-1.348 1.865-2.688.728-1.04 1.446-2.086.819-1.193 1.65-2.377.835-1.196 1.661-2.397a396 396 0 0 1 1.866-2.688q.728-1.04 1.446-2.086.818-1.193 1.65-2.377.834-1.196 1.661-2.397 1.036-1.504 2.084-3.002.84-1.203 1.672-2.412.928-1.348 1.866-2.688.728-1.04 1.445-2.086a282 282 0 0 1 1.65-2.377q.835-1.195 1.662-2.397.927-1.349 1.865-2.688.728-1.04 1.446-2.086.819-1.193 1.65-2.377.835-1.195 1.661-2.397.928-1.348 1.866-2.689.806-1.149 1.598-2.307.775-1.13 1.566-2.25l.195-.278.175-.249c.138-.195.138-.195.235-.397h.197v87.409l13.048-.098 1.582-2.363.79-1.083a82 82 0 0 0 .807-1.166l.142-.207.651-.946.133-.192q.607-.878 1.22-1.752.979-1.4 1.943-2.809a410 410 0 0 1 2.217-3.194 247 247 0 0 0 1.395-2.018q.635-.924 1.278-1.841.973-1.39 1.93-2.79a410 410 0 0 1 2.217-3.195q.703-1.005 1.395-2.017.634-.924 1.278-1.841.972-1.391 1.931-2.791a413 413 0 0 1 2.217-3.194q.701-1.005 1.394-2.017a233 233 0 0 1 1.279-1.842q.972-1.39 1.93-2.79a413 413 0 0 1 2.217-3.194 258 258 0 0 0 1.395-2.018q.635-.924 1.278-1.841.972-1.39 1.931-2.79a413 413 0 0 1 2.216-3.195q.703-1.005 1.395-2.017.635-.923 1.278-1.841.973-1.391 1.931-2.791a413 413 0 0 1 2.217-3.194q.701-1.005 1.394-2.018.635-.923 1.279-1.841.972-1.39 1.93-2.79.401-.584.805-1.166.413-.598.818-1.2l.204-.302.399-.594.184-.272.164-.245.141-.173h.198a39 39 0 0 1-.601 1.874c-2.543 7.373-3.449 15.209-2.265 24.703l.05.342c.807 5.285 2.574 10.403 4.892 15.21l.126.265c1.303 2.72 2.917 5.289 4.717 7.708l.234.318c1.034 1.4 1.034 1.4 2.194 2.694.301.362.309.717.301 1.172l.001.251q0 .417-.005.832l.001.596q0 .81-.007 1.619l-.004 1.692a856 856 0 0 1-.01 3.203q-.009 2.164-.012 4.329-.009 3.41-.024 6.82h10.577v-10.926c1.295.752 1.295.752 1.791 1.064.735.453 1.489.869 2.248 1.281l.554.308c4.056 2.24 8.592 3.707 13.1 4.729l.319.073c1.314.296 2.64.501 3.975.684l.219.031c2.31.32 4.617.431 6.947.424h.371c2.002-.004 3.974-.083 5.961-.326l.355-.041c8.313-.994 16.6-3.952 24.563-9.564l.507-.371c2.288-1.682 4.397-3.574 6.41-5.57l.235-.233c.413-.412.81-.833 1.191-1.274q.28-.32.569-.628a29 29 0 0 0 1.414-1.724 111 111 0 0 1 .597-.756l.285-.359c.191-.243.374-.484.546-.741h.198v23.919h10.576V78.286h-10.576l.011 5.24.006 3.464.001.223.011 7.418v.245l.006 5.267.003 2.584v.259q.005 4.16.015 8.317.009 4.278.012 8.554v1.211l.001.241q.001 1.91.008 3.821.006 1.925.004 3.85-.001 1.04.004 2.083c.028 5.261.028 5.261-.68 7.466-.139.435-.259.876-.382 1.316-1.647 5.788-4.276 11.515-8.114 16.204l-.303.38a36 36 0 0 1-2.022 2.319q-.223.239-.442.481a27 27 0 0 1-2.077 2.037l-.245.226a28 28 0 0 1-1.954 1.609q-.244.189-.484.38c-5.469 4.285-12.114 6.84-18.964 7.825l-.334.05c-3.688.516-7.647.478-11.33-.05l-.373-.051a48 48 0 0 1-8.523-2.016l-.322-.107c-1.651-.554-3.24-1.226-4.818-1.96l-.266-.123c-3.203-1.496-6.327-3.483-8.995-5.797a47 47 0 0 0-.641-.544 34 34 0 0 1-2.265-2.084l-.514-.51a24 24 0 0 1-1.849-2.065l-.279-.323c-5.158-5.89-8.235-13.639-9.21-21.332l-.045-.353c-.445-3.625-.414-7.345.045-10.967l.025-.196c1.042-8.184 4.346-15.877 10.892-23.94q.292-.32.573-.646c.399-.456.825-.883 1.255-1.31l.227-.227a26 26 0 0 1 1.459-1.341l.289-.252a39.5 39.5 0 0 1 6.235-4.375l.256-.144c7.881-4.437 17.375-6.205 32.153-4.181a46.7 46.7 0 0 1 9.643 3.902l.254.128.25.129c.323.09.438.023.732-.133l.283-.146.304-.163.649-.335.33-.173a45 45 0 0 1 1.4-.68q1.32-.625 2.633-1.262c2.02-.977 2.02-.977 2.952-1.42l.228-.11c.496-.235.496-.235.717-.235-.341-.484-.767-.795-1.242-1.138l-.252-.183c-6.404-4.594-14.274-7.15-22.038-8.208l-.214-.03c-2.306-.315-4.613-.42-6.94-.413h-.378c-2.016.005-4.003.073-6.003.326l-.2.024c-6.153.761-12.052 2.639-17.593 5.39l-.289.143c-1.645.821-3.294 1.702-4.804 2.754-.244.154-.244.154-.541.154-.007-1.434.017-2.867.05-4.3l.014-.643.035-1.554a394 394 0 0 0-4.666-.038q-1.083-.001-2.166-.017-.945-.014-1.89-.011-.5.002-.999-.01c-1.329-.089-1.329-.089-2.545.32-.376.393-.576.835-.782 1.331a7 7 0 0 1-.296.434l-.241.348-.275.396-.137.199-.682.986-.272.395-.136.197-.4.579q-.734 1.062-1.465 2.126-.929 1.353-1.862 2.701l-1.598 2.32q-.796 1.16-1.597 2.317l-.676.98-.809 1.17-1.464 2.127a1034 1034 0 0 1-2.274 3.298l-.808 1.171q-.735 1.062-1.465 2.127-.929 1.351-1.862 2.7-.801 1.16-1.598 2.32t-1.597 2.318l-.676.979-.809 1.171q-.734 1.062-1.465 2.127-.797 1.16-1.597 2.318l-.676.979-.809 1.171q-.733 1.062-1.465 2.127-.929 1.351-1.861 2.701-.801 1.158-1.598 2.319l-1.597 2.318-.677.979-.808 1.171q-.735 1.062-1.465 2.127-.929 1.351-1.862 2.701-.8 1.158-1.598 2.319-.797 1.16-1.597 2.318l-.676.98-.809 1.17-1.465 2.127q-.796 1.16-1.597 2.318l-.676.98a1389 1389 0 0 0-2.274 3.297q-.929 1.353-1.861 2.701a897 897 0 0 0-1.598 2.319q-.797 1.16-1.597 2.318l-.677.98a1389 1389 0 0 0-2.273 3.297q-.863 1.256-1.73 2.51l-.6.868-.139.202q-.275.398-.546.801h-.198V78.385l-12.059.098-1.581 2.363-.791 1.082q-.201.291-.395.585l-.198.297-.198.3a47 47 0 0 1-1.382 1.99c-.352.483-.686.979-1.021 1.473l-.445.653q-.105.157-.215.317a213 213 0 0 1-.909 1.321l-.252.364a890 890 0 0 0-1.855 2.692q-.929 1.35-1.861 2.7-.801 1.16-1.599 2.32a962 962 0 0 1-1.597 2.318l-.676.979-.809 1.171q-.733 1.062-1.464 2.127-.93 1.351-1.862 2.701a897 897 0 0 0-1.598 2.319q-.929 1.351-1.862 2.701a897 897 0 0 0-1.598 2.319q-.929 1.351-1.861 2.701a897 897 0 0 0-1.598 2.319q-.797 1.16-1.597 2.318l-.677.98-.808 1.17q-.735 1.064-1.465 2.127-.93 1.351-1.862 2.701a897 897 0 0 0-1.598 2.319q-.929 1.353-1.861 2.701a897 897 0 0 0-1.598 2.319q-.93 1.353-1.862 2.701l-1.598 2.319q-.929 1.353-1.861 2.701-.801 1.16-1.598 2.32-.798 1.16-1.598 2.318l-.676.979-.808 1.171q-.735 1.062-1.465 2.127-.93 1.351-1.862 2.701a897 897 0 0 0-1.598 2.319q-.929 1.351-1.862 2.701a897 897 0 0 0-1.598 2.319q-.929 1.351-1.861 2.701-.801 1.158-1.598 2.319-.663.967-1.33 1.931-.353.508-.699 1.02l-.149.219-.282.418c-.201.295-.352.494-.654.694a70 70 0 0 1-1.33-4.281 135.4 135.4 0 0 1-4.428-24.48l-.023-.261a93 93 0 0 1-.15-1.985l-.012-.192c-.18-2.72-.221-5.436-.217-8.162l.001-.976c.003-3.108.043-6.201.305-9.299l.066-.824c.779-9.993 2.758-19.894 11.27-43.508q.226-.49.448-.981c1.234-2.697 2.55-5.372 4.009-7.955q.236-.42.47-.844a116 116 0 0 1 2.54-4.332l.165-.271c.87-1.425 1.792-2.814 2.72-4.202l.178-.266q1.158-1.735 2.374-3.431l.192-.27a100 100 0 0 1 2.378-3.175l.17-.22a104 104 0 0 1 3.201-3.955q.428-.5.842-1.012c.358-.438.73-.86 1.113-1.278q.28-.308.555-.623.5-.568 1.008-1.127l.433-.48a71 71 0 0 1 3.16-3.316c.325-.32.638-.642.934-.99.285-.329.591-.607.923-.888.421-.37.809-.774 1.202-1.172a26 26 0 0 1 1.59-1.51c.33-.285.645-.589.962-.89.53-.498 1.066-.97 1.635-1.422.295-.241.575-.496.855-.755.452-.419.918-.814 1.4-1.2q.456-.373.904-.756a54 54 0 0 1 1.873-1.504l.494-.386a130 130 0 0 1 9.266-6.637l.22-.144a127 127 0 0 1 8.375-5.007l.582-.32c3.215-1.777 6.525-3.43 9.902-4.88l.622-.267C87.594 7.212 96.205 4.494 120.79.4l.269-.023q1.017-.085 2.036-.15l.193-.012c2.747-.18 5.489-.22 8.241-.216z"/>
                  </svg>
                </div>
              </div>
              <div className="text-center space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  {t("initialInformation.pageTitle")}
                </h1>
                <p className="text-muted-foreground text-balance max-w-sm mx-auto text-sm md:text-base">
                  {t("initialInformation.pageDescription")}
                </p>
              </div>
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                <AssistantSearch />
              </div>
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-3 py-6 lg:px-4 lg:py-8 max-w-3xl animate-in fade-in duration-500">
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
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 md:space-y-8">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <WizardHeader currentStep={step} totalSteps={2} />
                </div>
                
                {step === 1 ? (
                  <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                    <BasicInfoCard isUpdateMode={store.mode === "update"} />
                    <PersonalInfoCard childrenList={childrenList} onChildrenChange={setChildrenList} />
                    <ChurchInfoCard />
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                    {cells.map((cell, i) => (
                      <CellInfoCard
                        key={i}
                        cell={cell}
                        index={i}
                        onChange={(idx, field, value) => {
                          setCells(prev => prev.map((c, j) => j === idx ? { ...c, [field]: value } : c));
                        }}
                        onRemove={(idx) => {
                          setCells(prev => prev.filter((_, j) => j !== idx));
                        }}
                        disabledRemove={cells.length <= 1}
                      />
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-dashed"
                      onClick={() => setCells(prev => [...prev, defaultCell()])}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {t("initialInformation.cellInfo.addCell")}
                    </Button>
                  </div>
                )}

                <Separator />

                <div className="flex flex-col sm:flex-row justify-between gap-3 pb-8">
                  <div>
                    {step === 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="w-full sm:w-auto transition-all active:scale-95"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Atrás
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={store.resetForm}
                      className="w-full sm:w-auto transition-all active:scale-95"
                    >
                      {t("initialInformation.actions.cancel")}
                    </Button>
                    
                    <Button type="submit" disabled={store.isSaving} size="lg" className="w-full sm:w-auto sm:min-w-[140px] transition-all active:scale-95">
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
      <Dialog open={showSuccessModal} onOpenChange={(open) => {
        if (!open) {
          setShowSuccessModal(false);
          store.resetForm();
          form.reset();
          setCells([defaultCell()]);
          setStep(1);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-center text-lg">
              {t("initialInformation.messages.saveSuccessTitle")}
            </DialogTitle>
            <DialogDescription className="text-center">
              {t("initialInformation.messages.saveSuccessDescription")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={() => {
                setShowSuccessModal(false);
                store.resetForm();
                form.reset();
                setCells([defaultCell()]);
                setStep(1);
              }}
              className="min-w-[120px]"
            >
              {t("initialInformation.actions.continue")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InitialInformationForm;