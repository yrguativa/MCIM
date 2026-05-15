import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { Disciple, Leader } from "@/src/disciples/models/disciple";
import { DisciplesService } from "@/src/disciples/services/disciples.services";

interface DiscipleState {
    Disciples: Disciple[],
    searchResults: Disciple[],
    showModalNotFound: boolean,
    leaders: Leader[],
    isSaving: boolean,

    getDisciples: () => Promise<void>,
    addDisciple: (disciple: Disciple) => Promise<boolean>,
    updateDisciple: (disciple: Disciple) => Promise<boolean>,
    searchByName: (name: string) => Promise<void>,
    getLeaders: () => Promise<void>,
    addDiscipleFull: (discipleData: Disciple, personalInfoData: Record<string, unknown>) => Promise<boolean>,
    updateDiscipleFull: (discipleId: string, discipleData: Disciple, personalInfoData: Record<string, unknown>, personalInfoId?: string) => Promise<boolean>,

    toggleModalNotFound: () => void,
    onShowModalNotFound: () => void,
}

const storeDisciple: StateCreator<DiscipleState> = (set, get) => (
    {
        Disciples: [],
        searchResults: [],
        showModalNotFound: false,
        leaders: [],
        isSaving: false,

        searchByName: async (name: string) => {
            console.log('[DiscipleStore] Searching for:', name);
            try {
                console.log('[DiscipleStore] Calling service...');
                const results = await DisciplesService.searchByName(name);
                console.log('[DiscipleStore] Results from service:', results);
                set({ searchResults: results });
            } catch (error) {
                console.error('[DiscipleStore] Error searching disciples:', error);
                set({ searchResults: [] });
            }
        },

        getDisciples: async () => {
            console.log('[DiscipleStore] getDisciples called');
            try {
                const disciples = await DisciplesService.getDisciples();
                console.log('[DiscipleStore] getDisciples result:', disciples?.length);
                if (!disciples || disciples.length === 0) return;
                set({ Disciples: disciples });
            } catch (error) {
                console.error('[DiscipleStore] getDisciples error:', error);
            }
        },

        getLeaders: async () => {
            try {
                const leaders = await DisciplesService.getLeaders();
                set({ leaders });
            } catch (error) {
                console.error('[DiscipleStore] getLeaders error:', error);
            }
        },

        addDisciple: async (disciple: Disciple) => {
            const disciples = get().Disciples;
            try {
                const idDiscipleInserted = await DisciplesService.addDisciple(disciple);
                set({ Disciples: [...disciples, { ...disciple, id: idDiscipleInserted }] });
                return true;
            } catch (error) {
                console.error("Error adding disciple:", error);
                return false;
            }
        },

        addDiscipleFull: async (discipleData, personalInfoData) => {
            set({ isSaving: true });
            try {
                const success = await DisciplesService.addDiscipleFull({
                    createDiscipleInput: discipleData as unknown as Record<string, unknown>,
                    createPersonalInfoInput: personalInfoData,
                });
                if (success) {
                    await get().getDisciples();
                }
                set({ isSaving: false });
                return success;
            } catch (error) {
                console.error("Error adding disciple full:", error);
                set({ isSaving: false });
                return false;
            }
        },

        updateDiscipleFull: async (discipleId, discipleData, personalInfoData, personalInfoId) => {
            set({ isSaving: true });
            try {
                const updatePersonalInfoInput = personalInfoId
                    ? { id: personalInfoId, ...personalInfoData }
                    : personalInfoData;

                const success = await DisciplesService.updateDiscipleFull(
                    discipleId,
                    {
                        updateDiscipleInput: discipleData as unknown as Record<string, unknown>,
                        updatePersonalInfoInput: updatePersonalInfoInput as Record<string, unknown>,
                    },
                );
                if (success) {
                    await get().getDisciples();
                }
                set({ isSaving: false });
                return success;
            } catch (error) {
                console.error("Error updating disciple full:", error);
                set({ isSaving: false });
                return false;
            }
        },

        updateDisciple: async (disciple: Disciple) => {
            const disciples = get().Disciples;
            try {
                await DisciplesService.updateDisciple(disciple);
                set({ Disciples: disciples.map(d => d.id === disciple.id ? { ...disciple } : d) });
                return true;
            } catch (error) {
                console.error("Error updating disciple:", error);
                return false;
            }
        },

        toggleModalNotFound: () => {
            set({ showModalNotFound: get().showModalNotFound ? false : true });
        },
        onShowModalNotFound: () => {
            set({ showModalNotFound: true });
        },
    }
);

export const useDiscipleStore = create<DiscipleState>()(
    devtools(
        persist(
            storeDisciple,
            {
                name: 'disciple-storage',
                onRehydrateStorage: () => (state) => {
                    console.log('[DiscipleStore] Rehydration complete, searchResults:', state?.searchResults);
                }
            }
        ),
    )
)
