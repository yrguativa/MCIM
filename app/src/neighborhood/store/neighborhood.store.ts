import { create, StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { NeighborhoodService, type NeighborhoodItem } from '../services/neighborhood.services';

interface NeighborhoodState {
  neighborhoods: NeighborhoodItem[];
  fetchNeighborhoods: () => Promise<void>;
  createNeighborhood: (name: string) => Promise<NeighborhoodItem | null>;
}

const store: StateCreator<NeighborhoodState> = (set, get) => ({
  neighborhoods: [],

  fetchNeighborhoods: async () => {
    try {
      const neighborhoods = await NeighborhoodService.getAll();
      set({ neighborhoods });
    } catch (error) {
      console.error('[NeighborhoodStore] fetchNeighborhoods error:', error);
    }
  },

  createNeighborhood: async (name: string) => {
    try {
      const neighborhood = await NeighborhoodService.create(name);
      set({ neighborhoods: [...get().neighborhoods, neighborhood] });
      return neighborhood;
    } catch (error) {
      console.error('[NeighborhoodStore] createNeighborhood error:', error);
      return null;
    }
  },
});

export const useNeighborhoodStore = create<NeighborhoodState>()(
  devtools(persist(store, { name: 'neighborhood-storage' })),
);
