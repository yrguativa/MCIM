import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "../../stores/auth/auth.store";
import { useEventStore } from "../store/event.store";
import { Event } from "../models/event";
import { EventSchema } from "../schemas/eventSchema";
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

export const CreateEvent: React.FC = () => {
    const navigate = useNavigate();
    const userState = useAuthStore(state => state.user);
    const [hasEndDate, setHasEndDate] = useState(false);

    const form = useForm<Event>({
        resolver: zodResolver(EventSchema),
        defaultValues: {
            id: crypto.randomUUID(),
            createdBy: userState,
            createdAt: new Date(),
        }
    });

    const addEvent = useEventStore(state => state.addEvent);

    async function onSubmit(data: Event) {
        console.log("🚀 ~ onSubmit ~ data:", data)
        try {
            const success = await addEvent(data);
            if (success) {
                toast("Evento creado correctamente", {
                    description: "El evento se ha registrado exitosamente",
                });
                navigate('/events');
            } else {
                throw new Error("No se pudo crear el evento");
            }
        } catch (error) {
            toast("Error al crear el evento", {
                description: "Ocurrió un error al intentar crear el evento"
            });
        }
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Crear Nuevo Evento</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre del Evento</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ingrese el nombre del evento" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descripción</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Describa el evento" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha de Inicio</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="datetime-local"
                                            onChange={(e) => field.onChange(new Date(e.target.value))}
                                            value={field.value ? field.value.toISOString().slice(0, 16) : ''}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="has-end-date"
                                checked={hasEndDate}
                                onCheckedChange={setHasEndDate}
                            />
                            <FormLabel>¿Tiene fecha de finalización?</FormLabel>
                        </div>

                        {hasEndDate && (
                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha de Finalización</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="datetime-local"
                                                onChange={(e) => field.onChange(new Date(e.target.value))}
                                                value={field.value ? field.value.toISOString().slice(0, 16) : ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ubicación</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Indique la ubicación del evento" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="capacity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Capacidad</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Número máximo de participantes"
                                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                            value={field.value || ''}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">
                            <Save className="mr-2 h-4 w-4" /> Crear Evento
                        </Button>
                    </form>
                </Form>
            </Card>
            
        </div>
    );
};
