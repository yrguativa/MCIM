import React, { useEffect, useState, useRef } from 'react';
import { useFieldArray, useForm, Controller, Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { BookUp, CalendarIcon, CheckCircle, OctagonX, Trash2, UserPlus } from "lucide-react"
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

import { useAuthStore } from '@/src/app/stores';
import { useCellStore } from '../store/cell.store';
import { useDiscipleStore } from '@/src/disciples/store/disciple.store';
import { CellsService } from '../services/cells.services';
import { AddAttendeeModal } from '../components/AddAttendeeModal';

import { CellRecordInput, CellRecordSchema } from '../schemas/cellRecordsSchema';
import { useNavigate, useParams } from 'react-router-dom';

const CellRegister: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userState = useAuthStore(state => state.user);
  const addRecord = useCellStore(state => state.addRecord);
  const addAssistant = useCellStore(state => state.addAssistant);
  const disciplesState = useDiscipleStore(state => state.Disciples);
  const getDisciples = useDiscipleStore(state => state.getDisciples);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cellLeaderId, setCellLeaderId] = useState<string>('');
  const hasLoaded = useRef(false);

  const form = useForm<CellRecordInput>({
    resolver: zodResolver(CellRecordSchema) as Resolver<CellRecordInput>,
    defaultValues: {
      topic: "",
      date: new Date(),
      createdUser: userState?.id || "",
      assistants: [],
    },
  });

  const { fields: assistantsFields, append: appendAssistant, remove: removeAssistant } = useFieldArray({ name: 'assistants', control: form.control });

  useEffect(() => {
    if (!id || hasLoaded.current) return;

    const loadCellData = async () => {
      try {
        const cell = await CellsService.getCell(id);
        if (!cell) return;
        setCellLeaderId(cell.leader);

        if (disciplesState.length === 0) {
          await getDisciples();
        }

        const activeAssistants = (cell.assistants || []).filter(a => a.status === 'active');
        if (activeAssistants.length > 0) {
          activeAssistants.forEach(a => {
            const disciple = disciplesState.find(d => d.id === a.disciple) ||
              { id: a.disciple, name: '', lastName: '' };
            appendAssistant({
              id: a.disciple,
              name: `${disciple.name} ${disciple.lastName}`.trim() || a.disciple,
              discipleId: a.disciple,
              attended: true,
            });
          });
        }
      } catch (error) {
        console.error('[CellRegister] Error loading cell:', error);
      } finally {
        hasLoaded.current = true;
        setLoading(false);
      }
    };

    loadCellData();
  }, [id]);

  const handleAddAttendee = async (disciple: { id: string; name: string; lastName: string }) => {
    appendAssistant({
      id: disciple.id,
      name: `${disciple.name} ${disciple.lastName}`,
      discipleId: disciple.id,
      attended: true,
    });
    setShowAddModal(false);

    if (id) {
      await addAssistant(id, disciple.id, userState?.id || "");
    }
  };

  async function onSubmit(data: CellRecordInput) {
    const attendedAssistants = data.assistants.filter(a => a.attended);
    const dataToSend = { ...data, assistants: attendedAssistants };

    const isSuccess = await addRecord(id!, dataToSend);
    if (isSuccess) {
      toast("El registro de la celula se guardo correctamente.", {
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      });
      navigate('/cells/' + id);
    } else {
      toast("Error al guardar el registro de la celula", {
        icon: <OctagonX className="h-4 w-4 text-red-500" />,
      });
    }
  }



  return <>
    <div className="flex items-center">
      <h1 className="text-lg font-semibold md:text-2xl">Registro Asistencia de <mark>Celula</mark></h1>
    </div>
    <div className="flex items-center items-center justify-center text-start rounded-lg border border-dashed p-4 shadow-sm">
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

          <div className="col-span-2 gap-3 pb-3">
            <span className="col-span-2 text-xl font-semibold">Asistentes</span>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre Asistente</TableHead>
                  <TableHead>Asistencia</TableHead>
                  <TableHead>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                      Cargando asistentes...
                    </TableCell>
                  </TableRow>
                ) : assistantsFields.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                      No hay asistentes asociados. Agrega uno manualmente.
                    </TableCell>
                  </TableRow>
                ) : (
                  assistantsFields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <Controller
                          name={`assistants.${index}.name`}
                          control={form.control}
                          render={() => (
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
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Controller
                          name={`assistants.${index}.attended`}
                          control={form.control}
                          render={({ field }) => (
                            <>
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
                            </>

                          )}
                        />
                      </TableCell>
                      <TableCell>
                        {index > 0 && (
                          <Button type="button" variant="destructive" onClick={() => removeAssistant(index)}>
                            <Trash2 /> Eliminar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    <Button variant="outline" type="button" onClick={() => setShowAddModal(true)}>
                      <UserPlus className='mr-2' /> Agregar Asistente
                    </Button>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>

          <Button type="submit" className="col-span-2">
            <BookUp className='mr-2' /> Agregar Registro Celula
          </Button>
        </form>
      </Form>
    </div>
    <AddAttendeeModal
      open={showAddModal}
      onClose={() => setShowAddModal(false)}
      onSelect={handleAddAttendee}
      cellLeaderId={cellLeaderId}
    />
  </>;
};

export default CellRegister;
