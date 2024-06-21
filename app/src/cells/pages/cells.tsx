
import { FC } from 'react';
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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

import { useAuthStore, useCellStore } from '../../stores';
import { CellRecord, CellRecordSchema } from '../schemas/cellRecordsSchema';
import AssistantsTableComponent from '../components/assistantsTableComponent';
import { ColumnsAssistants } from '../components/assistantsColumns';

const Cells: FC = () => {
  const userState = useAuthStore(state => state.user);

  const cellState = useCellStore(state => state.cell);
  const addRecordState = useCellStore(state => state.addRecord);
  const form = useForm<CellRecord>({
    resolver: zodResolver(CellRecordSchema),
    defaultValues: {
      topic: "",
      date: new Date(),
      createUser: userState,
      assistants: cellState.assistants,
    },
  });

  const { fields: assistantsSubForm, append: appendAssitant, remove: removeAssitant } = useFieldArray({ name: 'assistants', control: form.control })
  const dataAssistants = [];
  function onSubmit(data: CellRecord) {
    console.log("🚀 ~ onSubmit ~ data:", data)
    addRecordState(data);
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
      <h1 className="text-lg font-semibold md:text-2xl">Registro Asistencia de <mark>Celula</mark></h1>
    </div>
    <div className="flex items-center items-center justify-center text-start rounded-lg border border-dashed p-4 shadow-sm" x-chunk="dashboard-02-chunk-1">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 grid-flow-row gap-2 w-full">
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
              <FormItem className="flex flex-col pt-2">
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
                  Registrar la fecha de la celula.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-2 grid-cols-subgrid flex flex-row justify-between gap-3">
            <span className="col-span-2 text-xl font-semibold">Asistentes</span>
            <div>
              {assistantsSubForm.length > 1 && (
                <Button type="button" onClick={() => removeAssitant(assistantsSubForm.length - 1)}>
                  Eliminar Asistente
                </Button>
              )}
              <Button type="button" onClick={() => appendAssitant({ id: crypto.randomUUID(), name: '', attended: true })}>
                Agregar correo electrónico
              </Button>
            </div>
          </div>
          {
            assistantsSubForm.map((assistant, index) => (
              <div key={assistant.id} className="col-span-2 grid-cols-subgrid flex flex-row justify-center gap-3">
                <h3>Asistente No. {index + 1} </h3>
                <FormField
                  control={form.control}
                  name={`assistants.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
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
                <Button type="button" onClick={() => removeAssitant(index)}>
                  Eliminar Asistente
                </Button>
              </div>
            ))
          }
          {
            form.formState.errors.assistants?.root &&
            (<div className="col-span-2 grid-cols-subgrid flex flex-row justify-center gap-3 text-destructive">
              <span>{form.formState.errors.assistants?.root.message}</span>
            </div>)
          }
          <div className="col-span-2">
            <AssistantsTableComponent data={form.getValues().assistants} columns={ColumnsAssistants}></AssistantsTableComponent>
          </div>
          Values:
          <pre className="col-span-2 text-sm">{JSON.stringify(form.watch(), null, 2)}</pre>
          Errores:
          <pre className="col-span-2 text-sm">{JSON.stringify(form.formState.errors, null, 2)}</pre>
          {
            form.formState.errors.assistants &&
            (<div className="col-span-2 grid-cols-subgrid flex flex-row justify-center gap-3">
              <span>{form.formState.errors.assistants.message}</span>
            </div>)
          }
          <Button type="submit" className="col-span-2">Registrar Asistencia</Button>
        </form>
      </Form>
    </div>
  </>;
};

export default Cells;
