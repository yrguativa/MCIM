import { create } from 'zustand'
import { Cell } from '@/src/pages/cellSchema'

interface AuthState {
    user: string,
    cells : Cell[],
}

export const useAuthStore = create<AuthState>()((set) => ({
    user: "Yilmer",
    cells: [],
}))