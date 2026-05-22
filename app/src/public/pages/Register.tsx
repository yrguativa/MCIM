import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Resolver, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GalleryVerticalEnd } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

import { RegisterInput, RegisterSchema } from "../schemas/registerSchema"
import { useAuthStore } from "@/src/app/stores"
import { useMinistryStore } from "@/src/ministries/store/ministries.store"

const RegisterPage: React.FC = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { register } = useAuthStore()
    const { ministries, getMinistries } = useMinistryStore()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<RegisterInput>({
        resolver: zodResolver(RegisterSchema as any) as Resolver<RegisterInput>,
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            identification: "",
            ministryId: "",
            phoneNumber: "",
            name: "",
            lastName: "",
        }
    })

    React.useEffect(() => {
        if (!ministries || ministries.length === 0) {
            getMinistries();
        }
    }, [ministries, getMinistries]);

    const onSubmit = async (data: RegisterInput) => {
        setIsLoading(true)
        try {
            await register({
                email: data.email,
                password: data.password,
                identification: data.identification,
                ministryId: data.ministryId,
                phoneNumber: data.phoneNumber || "",
            })
            navigate("/dashboard")
        } catch (error) {
            console.error("Error to register user:", error)
            toast(t("auth.registerError") || "Error al registrar usuario")
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
                        {t('AppTitle')}
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <h1 className="text-2xl font-bold">{t('auth.createAccount')}</h1>
                                    <p className="text-muted-foreground text-sm text-balance">
                                        {t('auth.registerDescription')}
                                    </p>
                                </div>
                                <div className="grid gap-4">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('auth.email')}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="correo@ejemplo.com"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('auth.password')}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('auth.confirmPassword')}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="identification"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('auth.identification')}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="1234567890"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="ministryId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('auth.ministry')}</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={t('auth.selectMinistry')} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {ministries?.map((ministry) => (
                                                            <SelectItem key={ministry.id} value={ministry.id}>
                                                                {ministry.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {t('auth.phone')} {t('auth.optional')}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="tel"
                                                        placeholder="3001234567"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? t("common.loading") : t('auth.register')}
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    {t('auth.alreadyHaveAccount')}{" "}
                                    <Button
                                        variant="link"
                                        className="p-0"
                                        onClick={() => navigate("/login")}
                                    >
                                        {t('auth.login')}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%" />
        </div>
    )
}

export default RegisterPage;
