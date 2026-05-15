import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { InitialInformationService } from "../services/initialInformation.services";

export interface DiscipleBasic {
  id: string;
  identification: string;
  identificationType: string;
  name: string;
  lastName: string;
  names?: string;
  lastNames?: string;
  email?: string;
  phone: string;
  leaderId?: string;
  createdUser: string;
  createdDate: string;
  updatedDate: string;
}

export interface DisciplePersonalInfo {
  id: string;
  discipleId: string;
  nationality: string;
  gender: string;
  maritalStatus?: string;
  hasChildren: string;
  childrenAttendChurch?: string;
  address: string;
  housingComplex?: string;
  neighborhood: string;
  municipality: string;
  network: string;
  birthDate: string;
  ministryId: string;
  yearArrivedAtChurch: string;
  hasAttendedEncounter: string;
  yearAttendedEncounter?: string;
  hasRepeatedEncounter?: string;
  hasAttendedReencounter: string;
  yearAttendedReencounter?: string;
  baptizedAtMCI: string;
  isLeader?: string;
  generation: string;
  formationSchoolLevel: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiscipleFull {
  disciple: DiscipleBasic;
  personalInfo?: DisciplePersonalInfo | null;
}

export interface Leader {
  id: string;
  names: string;
  lastNames: string;
}

interface InitialInformationState {
  searchIdentification: string;
  isSearching: boolean;
  searchError: string | null;
  foundAssistant: DiscipleFull | null;

  mode: "idle" | "create" | "update";
  isSaving: boolean;
  saveError: string | null;
  saveSuccess: boolean;

  leaders: Leader[];
  isLoadingLeaders: boolean;

  setSearchIdentification: (value: string) => void;
  searchAssistant: () => Promise<void>;
  resetSearch: () => void;

  createAssistant: (data: {
    createDiscipleInput: Record<string, unknown>;
    createPersonalInfoInput: Record<string, unknown>;
  }) => Promise<boolean>;

  updateAssistant: (
    id: string,
    data: {
      updateDiscipleInput: Record<string, unknown>;
      updatePersonalInfoInput?: Record<string, unknown>;
    },
  ) => Promise<boolean>;

  loadLeaders: () => Promise<void>;
  resetForm: () => void;
}

const storeInitialInformation: StateCreator<InitialInformationState> = (set, get) => ({
  searchIdentification: "",
  isSearching: false,
  searchError: null,
  foundAssistant: null,

  mode: "idle",
  isSaving: false,
  saveError: null,
  saveSuccess: false,

  leaders: [],
  isLoadingLeaders: false,

  setSearchIdentification: (value: string) => {
    set({ searchIdentification: value });
  },

  searchAssistant: async () => {
    const { searchIdentification } = get();
    if (!searchIdentification.trim()) {
      set({ searchError: "El número de documento es obligatorio para buscar" });
      return;
    }

    set({ isSearching: true, searchError: null, foundAssistant: null });
    try {
      const result = await InitialInformationService.findByIdentification(
        searchIdentification.trim(),
      );

      if (result && result.disciple) {
        set({
          foundAssistant: result,
          mode: "update",
          isSearching: false,
        });
      } else {
        set({
          foundAssistant: null,
          mode: "create",
          isSearching: false,
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      set({
        isSearching: false,
        searchError: "Error al buscar el asistente",
      });
    }
  },

  resetSearch: () => {
    set({
      searchIdentification: "",
      foundAssistant: null,
      mode: "idle",
      searchError: null,
    });
  },

  createAssistant: async (data) => {
    set({ isSaving: true, saveError: null, saveSuccess: false });
    try {
      const result = await InitialInformationService.create(data);
      if (result) {
        set({ isSaving: false, saveSuccess: true });
        return true;
      }
      set({ isSaving: false });
      return false;
    } catch (error) {
      console.error("Create error:", error);
      set({
        isSaving: false,
        saveError: "Error al guardar la información",
      });
      return false;
    }
  },

  updateAssistant: async (id, data) => {
    set({ isSaving: true, saveError: null, saveSuccess: false });
    try {
      const result = await InitialInformationService.update(id, data);
      if (result) {
        set({ isSaving: false, saveSuccess: true });
        return true;
      }
      set({ isSaving: false });
      return false;
    } catch (error) {
      console.error("Update error:", error);
      set({
        isSaving: false,
        saveError: "Error al guardar la información",
      });
      return false;
    }
  },

  loadLeaders: async () => {
    const { isLoadingLeaders } = get();
    if (isLoadingLeaders) return;

    set({ isLoadingLeaders: true });
    try {
      const result = await InitialInformationService.getLeaders();
      set({ leaders: result || [], isLoadingLeaders: false });
    } catch (error) {
      console.error("Load leaders error:", error);
      set({ isLoadingLeaders: false });
    }
  },

  resetForm: () => {
    set({
      searchIdentification: "",
      isSearching: false,
      searchError: null,
      foundAssistant: null,
      mode: "idle",
      isSaving: false,
      saveError: null,
      saveSuccess: false,
    });
  },
});

export const useInitialInformationStore = create<InitialInformationState>()(
  devtools(storeInitialInformation),
);
