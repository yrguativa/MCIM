import { Disciple } from "@/src/disciples/models/disciple";
import { DiscipleService } from "@/src/disciples/services/disciples.services";
import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface DiscipleState {
    Disciples: Disciple[],
    getDisciples: () => Promise<void>,
}

const storeDisciple: StateCreator<DiscipleState> = (set) => (
    {
        Disciples: [],

        getDisciples: async () => {
            const disciples = await DiscipleService.getDisciples();
            set({ Disciples: disciples });
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