import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { LoginOtherDataInput, LoginOtherDataSchema } from "../schemas/loginOtherDataSchemta";
import { useAuthStore } from "@/src/stores";
import { useMinistryStore } from "@/src/ministries/store/ministries.store";

interface LoginOtherDataProps {
    isOpenSheet: boolean;
    setIsOpenSheet?: (isOpen: boolean) => void;
}

const LoginOtherData: React.FC<LoginOtherDataProps> = ({ isOpenSheet, setIsOpenSheet }: LoginOtherDataProps) => {
    const navigate = useNavigate()
    const { ministries, getMinistries } = useMinistryStore();
    const { user: userState, updateUser } = useAuthStore()
    const form = useForm<LoginOtherDataInput>({
        resolver: zodResolver(LoginOtherDataSchema),
        defaultValues: {
            identification: userState?.identification || "",
            ministryId: userState?.ministryId || "",
            phoneNumber: userState?.phoneNumber || "",
        }
    });


    const handleSubmitOtherData = (data: LoginOtherDataInput) => {
        updateUser(userState?.id || "", data)
        navigate("/")
    };

    useEffect(() => {
        if (!ministries || ministries.length === 0) {
            getMinistries();
        }
    }, []);

    return (
        <Sheet open={isOpenSheet} >
            <SheetContent>
                <Form {...form} >
                    <SheetHeader>
                        <SheetTitle>Datos Adicionales </SheetTitle>
                        <SheetDescription>
                            Ingrese los datos adicionales para el registro del usuario
                        </SheetDescription>
                    </SheetHeader>

                    <form onSubmit={form.handleSubmit(handleSubmitOtherData)} className="grid flex-1 auto-rows-min gap-6 px-4 mt-4 mb-4">
                        <FormField
                            control={form.control}
                            name="identification"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Número de Identificación</FormLabel>
                                    <FormControl>
                                        <Input placeholder="107445435" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="ministryId"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel>Ministerio</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={field.value ? ministries.find((m) => m.id === field.value)?.name : "Selecciona un ministerio"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                Array.isArray(ministries) && ministries.length > 0 && (
                                                    ministries.map((ministry) => (
                                                        <SelectItem value={ministry.id} key={ministry.id}> {ministry.name}</SelectItem>
                                                    ))
                                                )
                                            }
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
                                    <FormLabel>Número de Celular</FormLabel>
                                    <FormControl>
                                        <Input placeholder="3243432434" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <SheetFooter>
                            <Button type="submit">Save changes</Button>
                            <SheetClose asChild>
                                <Button onClick={() => setIsOpenSheet && setIsOpenSheet(false)} variant="outline">Close</Button>
                            </SheetClose>
                        </SheetFooter>
                    </form>

                </Form>
            </SheetContent>
        </Sheet>
    )
}
export default LoginOtherData;