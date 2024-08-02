import { type StateCreator, create } from 'zustand'
import { devtools, persist } from 'zustand/middleware';

import { Cell } from '@/src/cells/schemas/cellSchema';
import { CellRecord } from '@/src/cells/schemas/cellRecordsSchema';
import { CellFull } from '@/src/cells/models/cellFull';

interface CellState {
  cell: CellFull,
  Cells: CellFull[],
  getCell: (id: string) => CellFull | undefined,
  addCell: (by: Cell) => void,
  updateCell: (by: Cell) => void,
  addRecord: (by: CellRecord) => void
}

const storeCell: StateCreator<CellState> = (set, get) => ({
  cell: {
    id: crypto.randomUUID(),
    leader: "Yilmer",
    host: "Andres Lopez",
    neighborhood: 1,
    network: 1,
    address: "Calle 123",
    createdUser: "Yilmer",
    createdDate: new Date(),
    records: []
  },

  Cells: [
    {
      id: crypto.randomUUID(),
      leader: "Yilmer",
      host: "Andres Lopez",
      neighborhood: 1,
      network: 1,
      address: "Calle 123",
      createdUser: "Yilmer",
      createdDate: new Date(),
      records: []
    }
  ],

  getCell: (id: string) => get().Cells.find(cell => cell.id === id),

  addCell: (by: Cell) => set(state => ({ ...state, Cells: [...state.Cells, { ...by, records: [] }] })),
  updateCell: (by: Cell) => {
    const cell = get().Cells.find(cell => cell.id === by.id);
    const otherCells = get().Cells.filter(cell => cell.id !== by.id);
    set(state => ({ ...state, Cells: [...otherCells, { ...by, records: cell?.records || [] }] }))
  },

  addRecord: (by: CellRecord) => set(state => ({ Cells: state.Cells, cell: { ...state.cell, records: [...state.cell.records, by] } }))
});

export const useCellStore = create<CellState>()(
  devtools(
    persist(
      storeCell,
      {
        name: 'cell-storege',
      }
    ),
  )
)
