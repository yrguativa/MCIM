import React from "react"
import { useTranslation } from "react-i18next"
import { GoogleLogin } from '@react-oauth/google'
import AppleSignIn from 'react-apple-signin-auth'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GalleryVerticalEnd } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useLoginHook } from "../hooks/loginHook"
import { NavLink } from "react-router-dom"
import { toast } from "sonner"
import LoginOtherData from "../components/LoginOtherData"

export const LoginPage: React.FC = () => {
    const { t } = useTranslation()
    const { form, isOpenSheet, setIsOpenSheet, handleSubmit, handleGoogleLogin, handleAppleLogin } = useLoginHook();
    
    const handleAppleError = (error: Error) => {
        console.error('Apple Login Error:', error)
        toast.error(t('auth.loginError') || 'Error al iniciar sesión con Apple')
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
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">{t('auth.login')}</h1>
                                <p className="text-muted-foreground text-sm text-balance">
                                    {t('auth.loginDescription')}
                                </p>
                            </div>
                            <div className="grid gap-6">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t('auth.email')}</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="m@example.com" {...field} />
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
                                                    <div className="flex items-center">
                                                        <FormLabel>{t('auth.password')}</FormLabel>
                                                        <NavLink
                                                            to="/public/forgot-password"
                                                            className="ml-auto text-sm underline-offset-4 hover:underline"
                                                        >
                                                            {t('auth.forgotPassword')}
                                                        </NavLink>
                                                    </div>
                                                    <FormControl>
                                                        <Input placeholder="******" type="password" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button type="submit" className="w-full">
                                            {t('auth.login')}
                                        </Button>
                                    </form>
                                </Form>

                                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                    <span className="bg-background text-muted-foreground relative z-10 px-2">
                                        {t('auth.signInWith')}
                                    </span>
                                </div>
                                <GoogleLogin
                                    onSuccess={handleGoogleLogin}
                                    onError={() => toast('Error! No se pudo iniciar sesión con Google')}
                                    useOneTap
                                    auto_select={false}
                                    ux_mode="popup"
                                    containerProps={{ className: "w-full" }}
                                />
                                <AppleSignIn
                                    authOptions={{
                                        clientId: import.meta.env.VITE_APPLE_CLIENT_ID || '',
                                        scope: 'email name',
                                        redirectURI: import.meta.env.VITE_APPLE_REDIRECT_URI || window.location.origin + '/apple-callback',
                                    }}
                                    onSuccess={handleAppleLogin}
                                    onError={handleAppleError}
                                    uiType="dark"
                                    className="w-full"
                                />
                            </div>
                            <div className="text-center text-sm">
                                {t('auth.alreadyHaveAccount')}{" "}
                                <NavLink to="public/register" className="underline underline-offset-4">
                                    {t('auth.register')}
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
            </div>
            <LoginOtherData isOpenSheet={isOpenSheet} setIsOpenSheet={setIsOpenSheet}/>
        </div >
    )
}
