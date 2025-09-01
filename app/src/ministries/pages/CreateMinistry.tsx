import React, { FC, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Ministry } from "../models/ministry";
import { MinistrySchema } from "../schemas/ministrySchema";

import { useAuthStore } from '@/src/stores';
import { useMinistryStore } from '../store/ministries.store';

export const CreateMinistry: FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const userState = useAuthStore(state => state.user);
    const { ministries, addMinistry, updateMinistry } = useMinistryStore();

    const form = useForm<Ministry>({
        resolver: zodResolver(MinistrySchema),
        defaultValues: {
            id: id || crypto.randomUUID(),
            name: "",
            createdUser: userState,
            createdDate: new Date(),
            active: true,
        }
    });


    useEffect(() => {
        const loadMinistry = async () => {
            if (id) {
                try {
                    const ministry = ministries.find(m => m.id === id);
                    if (ministry) {
                        form.reset(ministry);
                    }
                } catch (error) {
                    toast("Error al cargar el ministerio", {
                        description: "No se pudo obtener la información del ministerio"
                    });
                    navigate('/ministries');
                }
            }
        };
        loadMinistry();
    }, [id, ministries, form, navigate]);

    async function onSubmit(data: Ministry) {
        try {
            let success;
            if (id) {
                success = await updateMinistry(data);
                if (success) {
                    toast("Ministerio actualizado correctamente", {
                        description: "El ministerio se ha actualizado exitosamente",
                    });
                }
            } else {
                success = await addMinistry(data);
                if (success) {
                    toast("Ministerio creado correctamente", {
                        description: "El ministerio se ha registrado exitosamente",
                    });
                }
            }

            if (success) {
                navigate('/ministries');
            } else {
                throw new Error(id ? "Error al actualizar el ministerio" : "Error al crear el ministerio");
            }
        } catch (error) {
            toast(id ? "Error al actualizar el ministerio" : "Error al crear el ministerio", {
                description: `Ocurrió un error al intentar ${id ? 'actualizar' : 'crear'} el ministerio`
            });
        }
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Crear Nuevo Ministerio</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre del Ministerio</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ingrese el nombre del ministerio" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {id && (
                            <FormField
                                control={form.control}
                                name="active"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Estado
                                            </FormLabel>
                                            <div className="text-sm text-muted-foreground">
                                                Activar o desactivar el ministerio
                                            </div>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        )}

                        <Button type="submit" className="w-full">
                            <Save className="mr-2 h-4 w-4" /> {id ? 'Actualizar' : 'Crear'} Ministerio
                        </Button>
                    </form>
                </Form>
            </Card>
        </div>
    );
};

export default CreateMinistry;
