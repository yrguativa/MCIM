import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CredentialResponse } from "@react-oauth/google"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { LoginInput, LoginSchema } from "../schemas/loginSchema"
import { useAuthStore } from "@/src/app/stores"

interface AppleAuthResponse {
    authorization?: {
        code: string
        id_token?: string
    }
    email?: string
    name?: string
}

export const useLoginHook = () => {
    const navigate = useNavigate()
    const { error, login, loginWithGoogle, loginWithApple } = useAuthStore()
    const [isLoading, setIsLoading] = useState(false)
    const [isOpenSheet, setIsOpenSheet] = useState(false)

    const form = useForm<LoginInput>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });


    const handleSubmit = async (data: LoginInput) => {
        setIsLoading(true)
        try {
            await login(data.email, data.password)
            navigate("/")
        } catch (err) {
            console.error(err)
            toast("Error al iniciar sesión")
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleLogin: (credentialResponse: CredentialResponse) => Promise<void> =
        async (credentialResponse) => {
            if (!credentialResponse || !credentialResponse.credential) {
                toast.error("No se pudieron obtener las credenciales de Google");
                return;
            }
            try {
                setIsLoading(true)
                const result = await loginWithGoogle(credentialResponse.credential);
                if (result === 0) {
                    toast.error(error || "Error al iniciar sesión con Google");
                    return;
                } else if (result === -1) {
                    setIsOpenSheet(true);
                    return;
                } else {
                    navigate("/")
                }
            } catch (err) {
                console.log(err);
                toast("Error al iniciar sesión con Google")
            } finally {
                setIsLoading(false)
            }
        }

    const handleAppleLogin = async (response: AppleAuthResponse) => {
        if (!response.authorization?.code) {
            toast.error("No se pudieron obtener las credenciales de Apple");
            return;
        }
        try {
            setIsLoading(true)
            const result = await loginWithApple({
                code: response.authorization.code,
                idToken: response.authorization.id_token,
                email: response.email,
                name: response.name
            });
            
            if (result === 0) {
                toast.error(error || "Error al iniciar sesión con Apple");
                return;
            } else if (result === -1) {
                setIsOpenSheet(true);
                return;
            } else {
                navigate("/")
            }
        } catch (err) {
            console.log(err);
            toast("Error al iniciar sesión con Apple")
        } finally {
            setIsLoading(false)
        }
    }

    return {
        form,
        isOpenSheet,
        setIsOpenSheet,
        handleGoogleLogin,
        handleAppleLogin,
        isLoading,
        loginWithGoogle,
        loginWithApple,
        handleSubmit,
    };
}
