import { create, StateCreator } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { AuthService } from '@/src/public/services/auth.services'
import type { UserState } from '@/src/public/schemas/userSchema'
import { LoginOtherDataInput } from '@/src/public/schemas/loginOtherDataSchemta'

interface AuthState {
    user: UserState | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
    login: (email: string, password: string) => Promise<void>
    loginWithGoogle: (credential: string) => Promise<number>
    // loginWithApple: () => Promise<void>
    register: (userData: {
        email: string
        password: string
        identification: string
        ministryId: string
        phoneNumber: string
    }) => Promise<void>
    updateUser: (id: string, otherData: LoginOtherDataInput) => Promise<void>
    logout: () => void
}

const authService = new AuthService()

export const storeAuth: StateCreator<AuthState> = (set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
            const response = await authService.login(email, password)
            set({
                user: response.user,
                isAuthenticated: true,
                isLoading: false
            })
        } catch (error) {
            console.error(error);
            set({
                error: "Error al iniciar sesión",
                isLoading: false
            })
        }
    },

    loginWithGoogle: async (credential: string) => {
        set({ isLoading: true, error: null })
        try {
            const response = await authService.loginWithGoogle(credential)

            if (response.error) {
                set({
                    error: 'Error al iniciar sesión con Google',
                    isLoading: false
                });
                return 0;
            }
            set({
                user: { ...response.data.loginSocial },
                isAuthenticated: true,
                isLoading: false
            })

            if (!response.data.loginSocial.identification || !response.data.loginSocial.ministryId || !response.data.loginSocial.phoneNumber) {
                return -1
            }
            return 1;
        } catch (error) {
            console.error(error);
            set({
                error: 'Error al iniciar sesión con Google',
                isLoading: false
            })
            return 0;
        }
    },

    // loginWithApple: async () => {
    //     set({ isLoading: true, error: null })
    //     try {
    //         const response = await authService.loginWithApple()
    //         set({
    //             user: response.user,
    //             isAuthenticated: true,
    //             isLoading: false
    //         })
    //     } catch (error: any) {
    //         set({
    //             error: error.message,
    //             isLoading: false
    //         })
    //     }
    // },

    register: async (userData) => {
        set({ isLoading: true, error: null })
        try {
            const response = await authService.register(userData)
            set({
                user: response.user,
                isAuthenticated: true,
                isLoading: false
            })
        } catch (error) {
            console.error(error);
            set({
                error: "Error al registrar el usuario",
                isLoading: false
            })
        }
    },

    updateUser: async (id: string, otherData: LoginOtherDataInput) => {
        const userState = get().user;
        if (!userState) return;
        set({ isLoading: true, error: null })
        await authService.updateUser(id, otherData);
        set({
            isLoading: false,
            user: {
                ...userState,
                identification: otherData.identification,
                ministryId: otherData.ministryId,
                phoneNumber: otherData.phoneNumber
            }
        })
    },

    logout: () => {
        authService.logout()
        set({
            user: null,
            isAuthenticated: false
        })
    },
});

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            storeAuth,
            {
                name: 'auth-storage',
            },
        ),
    ),
)