import { create } from 'zustand'
import { Cell } from '@/src/pages/cellSchema'

interface AuthState {
    user: string,
    cells : Cell[],
}

export const useAuthStore = create<AuthState>()((set) => ({
    user: "678c06ec353c49781ac13d26",
    cells: [],
}))