import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CycleInput, CycleSchema } from '../schemas/cycleSchema';
import { useFormationSchoolStore } from '../store/formation-school.store';
import { useAuthStore } from '@/src/app/stores';
import { toast } from 'sonner';

interface CycleFormProps {
  onSuccess?: () => void;
}

export const CycleForm: React.FC<CycleFormProps> = ({ onSuccess }) => {
  const userState = useAuthStore(state => state.user);
  const createCycle = useFormationSchoolStore(state => state.createCycle);
  
  const form = useForm<CycleInput>({
    resolver: zodResolver(CycleSchema),
    defaultValues: {
      id: crypto.randomUUID(),
      name: '',
      requiredClasses: 8,
      active: true,
      createdUser: userState?.id || '',
      createdDate: new Date(),
    },
  });

  async function onSubmit(data: CycleInput) {
    const success = await createCycle({
      ...data,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
    });
    
    if (success) {
      toast.success('Ciclo creado exitosamente');
      form.reset();
      onSuccess?.();
    } else {
      toast.error('Error al crear el ciclo');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Ciclo</FormLabel>
              <FormControl>
                <Input placeholder="Ciclo 2026-1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de Inicio</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className={cn(!field.value && 'text-muted-foreground')}>
                        {field.value ? format(field.value, 'PPP') : 'Seleccionar fecha'}
                        <CalendarIcon className="ml-auto h-4 w-4" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de Fin</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className={cn(!field.value && 'text-muted-foreground')}>
                        {field.value ? format(field.value, 'PPP') : 'Seleccionar fecha'}
                        <CalendarIcon className="ml-auto h-4 w-4" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="requiredClasses"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cursos Requeridos</FormLabel>
              <FormControl>
                <Input type="number" min="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          Guardar Ciclo
        </Button>
      </form>
    </Form>
  );
};
