import { FC } from 'react';
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { CalendarIcon } from "lucide-react"
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cellSchema } from './cellSchema';

const Cells: FC = () => {
    const form = useForm<z.infer<typeof cellSchema>>({
        resolver: zodResolver(cellSchema),
        defaultValues: {
            cell: "Jueves",
            leader: "Yilmer",
            createUser: "Yilmer",

            date: new Date(),
            topic: "",
            assistants: [
                { name: "Asistente 1" },
                { name: "Asistente 2" }
            ]
        },
    });

    const { fields: assistantsSubForm, append: appendAssitant, remove: removeAssitant } = useFieldArray({ name: 'assistants', control: form.control })

    function onSubmit(data: z.infer<typeof cellSchema>) {
        console.log("🚀 ~ onSubmit ~ data:", data)
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">
                        {JSON.stringify(data, null, 2)}
                    </code>
                </pre>
            ),
        });
    }

    return <>
        <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Registro de Celula</h1>
        </div>
        <div className="flex flex-3 items-center justify-center rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1">
            <div className="flex flex-col items-center gap-1 text-center">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="topic"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tema</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Tema" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Ingresa el tema que se compartio en la celula
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Fecha de Celula</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn("pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>
                                        Your date of birth is used to calculate your age.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {
                            assistantsSubForm.map((asistant, index) => (
                                <div key={index}>
                                    <h3>Asistente No. {index + 1} </h3>
                                    <FormField
                                        control={form.control}
                                        name={`assistants.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Asistente No. {index + 1}</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nombre del asistente" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`assistants.${index}.attended`}
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>
                                                        {field.value ? "Asistio" : "No Asistio"}
                                                    </FormLabel>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            ))
                        }

                        <Button type="button" onClick={() => appendAssitant({ name: '', attended: false })}>
                            Agregar correo electrónico
                        </Button>
                        {assistantsSubForm.length > 1 && (
                            <Button type="button" onClick={() => removeAssitant(assistantsSubForm.length - 1)}>
                                Eliminar correo Electronics
                            </Button>
                        )}

                        <Button type="submit">Guardar</Button>
                    </form>
                </Form>
            </div>
        </div>
    </>;
};

export default Cells;