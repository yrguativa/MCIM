import { type StateCreator, create } from 'zustand'
import { devtools, persist } from 'zustand/middleware';

import { Cell } from '@/src/cells/schemas/cellSchema';
import { CellRecord } from '@/src/cells/schemas/cellRecordsSchema';

interface CellState {
  cell: Cell,
  Cells: Cell[],
  addRecord: (by: CellRecord) => void
}

const storeCell: StateCreator<CellState> = (set, get) => ({
  cell: {
    id: crypto.randomUUID(),
    leader: "Yilmer",
    createdUser: "Yilmer",
    createdDate: new Date(),
    assistants: [{ id: crypto.randomUUID(), name: '', attended: false }],
    records: []
  },

  Cells: [
    {
      id: crypto.randomUUID(),
      leader: "Yilmer",
      createdUser: "Yilmer",
      createdDate: new Date(),
      assistants: [{ id: crypto.randomUUID(), name: '', attended: false }],
      records: []
    }
  ],
  
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
