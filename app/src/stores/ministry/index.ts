import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Ministry } from "../../ministries/models/ministry";
import { MinistriesService } from "../../ministries/services/ministries.services";

export interface MinistryState {
    ministries: Ministry[];
    
    // Ministry methods
    getMinistries: () => Promise<void>;
    addMinistry: (ministry: Ministry) => Promise<boolean>;
    updateMinistry: (ministry: Ministry) => Promise<boolean>;
    deleteMinistry: (ministryId: string) => Promise<boolean>;
    getSubMinistries: (ministryId: string) => Promise<Ministry[]>;
}

const storeMinistry: StateCreator<MinistryState> = (set, get) => ({
    ministries: [],

    getMinistries: async () => {
        try {
            const ministries = await MinistriesService.getMinistries();
            set({ ministries });
        } catch (error) {
            console.error('Error getting ministries:', error);
            set({ ministries: [] });
        }
    },

    addMinistry: async (ministry: Ministry) => {
        const ministries = get().ministries;
        try {
            const idMinistryInserted = await MinistriesService.addMinistry(ministry);
            set({ ministries: [...ministries, { ...ministry, id: idMinistryInserted }] });
            return true;
        } catch (error) {
            console.error('Error adding ministry:', error);
            return false;
        }
    },

    updateMinistry: async (ministry: Ministry) => {
        const ministries = get().ministries;
        try {
            await MinistriesService.updateMinistry(ministry);
            set({ 
                ministries: ministries.map(m => 
                    m.id === ministry.id ? { ...ministry } : m
                ) 
            });
            return true;
        } catch (error) {
            console.error('Error updating ministry:', error);
            return false;
        }
    },

    deleteMinistry: async (ministryId: string) => {
        const ministries = get().ministries;
        try {
            await MinistriesService.deleteMinistry(ministryId);
            set({ ministries: ministries.filter(m => m.id !== ministryId) });
            return true;
        } catch (error) {
            console.error('Error deleting ministry:', error);
            return false;
        }
    },

    getSubMinistries: async (ministryId: string) => {
        try {
            const subMinistries = await MinistriesService.getSubMinistries(ministryId);
            return subMinistries;
        } catch (error) {
            console.error('Error getting sub-ministries:', error);
            return [];
        }
    },
});

export const useMinistryStore = create<MinistryState>()(
    devtools(
        persist(
            storeMinistry,
            {
                name: 'ministry-storage',
            }
        ),
    )
);
