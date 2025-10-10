import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GalleryVerticalEnd } from "lucide-react"


import { toast } from "sonner"


// const ForgotPasswordSchema = z.object({
//     email: z.string()
//         .email("Por favor ingresa un correo electrónico válido")
//         .min(1, "El correo electrónico es requerido"),
// })

//type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>

const ForgotPasswordPage: React.FC = () => {
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Validar el email
           // const validatedData = ForgotPasswordSchema.parse({ email })

            // TODO: Implementar la lógica de recuperación de contraseña
            // await authService.forgotPassword(validatedData.email)

            toast("Se ha enviado un enlace de recuperación a tu correo electrónico")

            // Redirigir al login después de unos segundos
            setTimeout(() => navigate("/login"), 2000)
        } catch (error) {
            console.error(error)
            toast("Error al enviar el correo")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="#" className="flex items-center gap-2 font-medium">
                        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        App Administración
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">Recuperar contraseña</h1>
                                <p className="text-muted-foreground text-sm text-balance">
                                    Ingresa tu correo electrónico y te enviaremos instrucciones para recuperar tu contraseña
                                </p>
                            </div>
                            <div className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Correo electrónico</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="correo@ejemplo.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Enviando..." : "Enviar instrucciones"}
                                </Button>
                            </div>
                            <div className="text-center text-sm">
                                <Button
                                    variant="link"
                                    className="p-0"
                                    onClick={() => navigate("/login")}
                                >
                                    Volver al inicio de sesión
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%" />
        </div>
    )
}

export default ForgotPasswordPage;