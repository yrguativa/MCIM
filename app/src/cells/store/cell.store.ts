import { type StateCreator, create } from 'zustand'
import { devtools, persist } from 'zustand/middleware';

import { CellInput } from '@/src/cells/schemas/cellSchema';
import { CellRecordInput } from '@/src/cells/schemas/cellRecordsSchema';
import { CellFull } from '@/src/cells/models/cellFull';
import { CellsService } from '@/src/cells/services/cells.services';

interface CellState {
  Cells: CellFull[],
  getCell: (id: string) => CellFull | undefined,
  getCells: () => Promise<void>,
  addCell: (by: CellInput) => Promise<boolean>,
  updateCell: (by: CellInput) => Promise<boolean>,
  addRecord: (id: string, by: CellRecordInput) => Promise<boolean>,
  addAssistant: (cellId: string, discipleId: string, userId: string) => Promise<boolean>,
  deactivateAssistant: (cellId: string, discipleId: string, userId: string) => Promise<boolean>,
}

const storeCell: StateCreator<CellState> = (set, get) => ({
  Cells: [],

  getCell: (id: string) => get().Cells.find(cell => cell.id === id),

  getCells: async () => {
    try {
      const cells = await CellsService.getCells();
      if (!cells || cells.length === 0) return;
      set({ Cells: cells });
    } catch (error) {
      console.error('[CellStore] getCells error:', error);
    }
  },

  addCell: async (by: CellInput) => {
    const cells = get().Cells;
    try {
      const cellId = await CellsService.createCell(by);
      set({ Cells: [...cells, { ...by, id: cellId, records: [] }] });
      return true;
    } catch (error) {
      console.error('[CellStore] addCell error:', error);
      return false;
    }
  },

  updateCell: async (by: CellInput) => {
    const cells = get().Cells;
    try {
      await CellsService.updateCell(by);
      set({ Cells: cells.map(c => c.id === by.id ? { ...c, ...by } : c) });
      return true;
    } catch (error) {
      console.error('[CellStore] updateCell error:', error);
      return false;
    }
  },

  addRecord: async (id: string, by: CellRecordInput) => {
    try {
      const recordId = await CellsService.createRecord(id, by);
      const cells = get().Cells;
      set({
        Cells: cells.map(c =>
          c.id === id
            ? { ...c, records: [...(c.records || []), { ...by, assistants: by.assistants.map(a => ({ ...a, id: recordId })) }] }
            : c
        )
      });
      return true;
    } catch (error) {
      console.error('[CellStore] addRecord error:', error);
      return false;
    }
  },

  addAssistant: async (cellId: string, discipleId: string, userId: string) => {
    try {
      await CellsService.addCellAssistant(cellId, discipleId, userId);
      const cells = get().Cells;
      const now = new Date();
      set({
        Cells: cells.map(c =>
          c.id === cellId
            ? {
                ...c,
                assistants: (() => {
                  const exists = c.assistants?.find(a => a.disciple === discipleId);
                  if (exists) {
                    return c.assistants!.map(a =>
                      a.disciple === discipleId
                        ? { ...a, status: 'active' as const, updatedDate: now, updatedUser: userId }
                        : a
                    );
                  }
                  return [
                    ...(c.assistants || []),
                    {
                      disciple: discipleId,
                      status: 'active' as const,
                      createdDate: now,
                      createdUser: userId,
                      updatedDate: now,
                      updatedUser: userId,
                    },
                  ];
                })(),
              }
            : c
        ),
      });
      return true;
    } catch (error) {
      console.error('[CellStore] addAssistant error:', error);
      return false;
    }
  },

  deactivateAssistant: async (cellId: string, discipleId: string, userId: string) => {
    try {
      await CellsService.deactivateCellAssistant(cellId, discipleId, userId);
      const cells = get().Cells;
      const now = new Date();
      set({
        Cells: cells.map(c =>
          c.id === cellId
            ? {
                ...c,
                assistants: c.assistants?.map(a =>
                  a.disciple === discipleId
                    ? { ...a, status: 'inactive' as const, updatedDate: now, updatedUser: userId }
                    : a
                ),
              }
            : c
        ),
      });
      return true;
    } catch (error) {
      console.error('[CellStore] deactivateAssistant error:', error);
      return false;
    }
  },
});

export const useCellStore = create<CellState>()(
  devtools(
    persist(
      storeCell,
      {
        name: 'cell-storage',
      }
    ),
  )
)
