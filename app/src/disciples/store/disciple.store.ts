import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { Disciple } from "@/src/disciples/models/disciple";
import { DisciplesService } from "@/src/disciples/services/disciples.services";


interface DiscipleState {
    Disciples: Disciple[],
    searchResults: Disciple[],

    getDisciples: () => Promise<void>,
    searchDisciples: (searchTerm: string) => Promise<void>,
    addDisciple: (disciple: Disciple) => Promise<boolean>,
    updateDisciple: (disciple: Disciple) => Promise<boolean>,
}

const storeDisciple: StateCreator<DiscipleState> = (set, get) => (
    {
        Disciples: [],
        searchResults: [],

        searchDisciples: async (searchTerm: string) => {
            try {
                const results = await DisciplesService.searchDisciples(searchTerm);
                set({ searchResults: results });
            } catch (error) {
                console.error('Error searching disciples:', error);
                set({ searchResults: [] });
            }
        },

        getDisciples: async () => {
            const disciples = await DisciplesService.getDisciples();
            set({ Disciples: disciples });
        },

        addDisciple: async (disciple: Disciple) => {
            const disciples = get().Disciples;
            try {
                const idDiscipleInserted = await DisciplesService.addDisciple(disciple);

                set({ Disciples: [...disciples, { ...disciple, id: idDiscipleInserted }] });

                return true;
            } catch (error) {
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
                return false;
            }
        }
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