import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { Disciple } from "@/src/disciples/models/disciple";
import { DisciplesService } from "@/src/disciples/services/disciples.services";

interface DiscipleState {
    Disciples: Disciple[],
    searchResults: Disciple[],
    showModalNotFound: boolean,

    getDisciples: () => Promise<void>,
    addDisciple: (disciple: Disciple) => Promise<boolean>,
    updateDisciple: (disciple: Disciple) => Promise<boolean>,
    searchByName: (name: string) => Promise<void>,

    toggleModalNotFound: () => void,
    onShowModalNotFound: () => void,

}

const storeDisciple: StateCreator<DiscipleState> = (set, get) => (
    {
        Disciples: [],
        searchResults: [],
        showModalNotFound: false,

        searchByName: async (name: string) => {
            try {
                const results = await DisciplesService.searchByName(name);
                set({ searchResults: results });
            } catch (error) {
                console.error('Error searching disciples:', error);
                set({ searchResults: [] });
            }
        },

        getDisciples: async () => {
            const disciples = await DisciplesService.getDisciples();
            if (!disciples || disciples.length === 0) return;
            set({ Disciples: disciples });
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

        updateDisciple: async (disciple: Disciple) => {
            const disciples = get().Disciples;
            try {
                await DisciplesService.updateDisciple(disciple);

                set({ Disciples: [...disciples.filter(d => d.identification == disciple.identification), { ...disciple }] });
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
            }
        ),
    )
)