import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GalleryVerticalEnd } from "lucide-react"
import { useAuthStore } from "@/src/stores/auth/auth.store"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { RegisterInput, RegisterSchema } from "../schemas/registerSchema"
import { toast } from "sonner"

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate()

    const { register } = useAuthStore()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState<RegisterInput>({
        email: "",
        password: "",
        identification: "",
        ministryId: "",
        phoneNumber: "",
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleMinistryChange = (value: string) => {
        setFormData(prev => ({ ...prev, ministryId: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Validar los datos
            const validatedData = RegisterSchema.parse(formData)
            await register(validatedData)
            navigate("/dashboard")
        } catch (error) {
            toast("Error al registrar usuario")
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
                                <h1 className="text-2xl font-bold">Crear una cuenta</h1>
                                <p className="text-muted-foreground text-sm text-balance">
                                    Ingresa tus datos para crear una cuenta
                                </p>
                            </div>
                            <div className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Correo electrónico</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="correo@ejemplo.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="password">Contraseña</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="identification">Número de identificación</Label>
                                    <Input
                                        id="identification"
                                        name="identification"
                                        type="text"
                                        value={formData.identification}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="ministry">Ministerio</Label>
                                    <Select onValueChange={handleMinistryChange} value={formData.ministryId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un ministerio" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="kids">Kids</SelectItem>
                                            <SelectItem value="youth">Juventud</SelectItem>
                                            <SelectItem value="adults">Adultos</SelectItem>
                                            <SelectItem value="worship">Alabanza</SelectItem>
                                            <SelectItem value="media">Medios</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="phoneNumber">Número de teléfono</Label>
                                    <Input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        type="tel"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Registrando..." : "Registrarse"}
                                </Button>
                            </div>
                            <div className="text-center text-sm">
                                ¿Ya tienes una cuenta?{" "}
                                <Button
                                    variant="link"
                                    className="p-0"
                                    onClick={() => navigate("/login")}
                                >
                                    Iniciar sesión
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
