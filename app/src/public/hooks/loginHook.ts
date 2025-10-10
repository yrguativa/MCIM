import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CredentialResponse } from "@react-oauth/google"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { LoginInput, LoginSchema } from "../schemas/loginSchema"
import { useAuthStore } from "@/src/app/stores"

export const useLoginHook = () => {
    const navigate = useNavigate()
    const { error, login, loginWithGoogle } = useAuthStore()
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
            navigate("/dashboard")
        } catch (error) {
            console.log(error)
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
            } catch (error) {
                console.log(error);
                toast("Error al iniciar sesión con Google")
            } finally {
                setIsLoading(false)
            }
        }

    // const handleAppleLogin = async () => {
    //     try {
    //         setIsLoading(true)
    //         await loginWithApple()
    //         navigate("/dashboard")
    //     } catch (error) {
    //         toast("Error al iniciar sesión con Apple")
    //     } finally {
    //         setIsLoading(false)
    //     }
    // }

    return {
        form,
        isOpenSheet,
        setIsOpenSheet,
        handleGoogleLogin,

        isLoading,


        loginWithGoogle,
        // loginWithApple,
        handleSubmit,

        //handleAppleLogin
    };
}