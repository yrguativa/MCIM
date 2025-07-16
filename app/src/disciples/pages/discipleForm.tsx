import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { CalendarIcon, CheckCircle, OctagonX, Save } from "lucide-react"
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "sonner"

import { useAuthStore, useDiscipleStore } from '../../stores';
import { Disciple, DiscipleSchema } from '../schemas/discipleSchema';
import { DisciplesService } from '../services/disciples.services';

const DiscipleForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const userState = useAuthStore(state => state.user);
  const updateDisciple = useDiscipleStore(state => state.updateDisciple);

  const form = useForm<Disciple>({
    resolver: zodResolver(DiscipleSchema),
    defaultValues: {
      id: id || crypto.randomUUID(),
      createdUser: userState,
      createdDate: new Date(),
    }
  });


  if (id) {
    useEffect(() => {
      const fetchData = async () => {
        const cellForUpdate = await DisciplesService.getDisciple(id);
        if (cellForUpdate) {
          form.reset({
            id: id,
            createdUser: cellForUpdate.createdUser || userState,
            createdDate: cellForUpdate.createdDate ? new Date(cellForUpdate.createdDate) : new Date(),
            name: cellForUpdate.name,
            lastName: cellForUpdate.lastName,
            identification: parseInt(cellForUpdate.identification),
            number: cellForUpdate.phone ? parseInt(cellForUpdate.phone) : undefined,
            email: cellForUpdate.email || undefined,
            address: cellForUpdate.address || undefined,
            birthday: cellForUpdate.birthDate ? new Date(cellForUpdate.birthDate) : undefined,
          });
        }
      };

      fetchData();
    }, [id]);


  }

  async function onSubmit(data: Disciple) {
    const isProcessSucess = await updateDisciple({
      id: data.id,
      name: data.name,
      lastName: data.lastName,
      identification: data.identification.toString(),
      email: data.email,
      address: data.address,
      birthDate: data.birthday,
      createdUser: data.createdUser,
      createdDate: data.createdDate,
      updatedUser: userState,
      updatedDate: new Date(),
      phone: data.number?.toString(),
    })
    if (isProcessSucess) {
      toast("Discipulo registrado correctamente", {
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      });

      navigate('/disciples');
    } else {
      toast("Error al registrar el discipulo", {
        icon: <OctagonX className="h-4 w-4 text-red-500" />,
      });
    }
  }

  return <>
    <div className="flex items-center">
      <h1 className="text-lg font-semibold md:text-2xl">Registro de Discipulo</h1>
    </div>
    <div className="flex items-center items-center justify-center text-start rounded-lg border border-dashed p-4 shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 grid-flow-row gap-2 w-full">
          <FormField
            control={form.control}
            name="identification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Identificaciòn</FormLabel>
                <FormControl>
                  <Input placeholder="1078934334" type='number' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombres</FormLabel>
                <FormControl>
                  <Input placeholder="Andres Camilo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellidos</FormLabel>
                <FormControl>
                  <Input placeholder="Rodriguez Romero" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefono</FormLabel>
                <FormControl>
                  <Input placeholder="3002354034" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Direccion</FormLabel>
                <FormControl>
                  <Input placeholder="Calle 12 N2-47 Alejandria 3 Torre 3 Apartamento 502 " {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthday"
            render={({ field }) => (
              <FormItem className="flex flex-col pt-2">
                <FormLabel>Fecha de nacimiento</FormLabel>
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
                          <span>Elige una fecha</span>
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
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Values:
          <pre className="col-span-2 text-sm">{JSON.stringify(form.watch(), null, 2)}</pre>
          Errores:
          <pre className="col-span-2 text-sm">{JSON.stringify(form.formState.errors, null, 2)}</pre> */}

          <Button type="submit" className="col-span-2">
            <Save className='mr-2' /> Guardr cambios
          </Button>
        </form>
      </Form>
    </div>
  </>;
};

export default DiscipleForm;