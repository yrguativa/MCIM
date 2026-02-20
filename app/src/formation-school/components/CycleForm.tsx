import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CycleFormData, CycleSchema } from '../schemas/cycleSchema';
import { useFormationSchoolStore } from '../store/formation-school.store';
import { useAuthStore } from '@/src/app/stores';
import { toast } from 'sonner';
import { Cycle } from '../models';

interface CycleFormProps {
  cycle?: Cycle | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CycleForm: React.FC<CycleFormProps> = ({ cycle, onSuccess, onCancel }) => {
  const userState = useAuthStore(state => state.user);
  const createCycle = useFormationSchoolStore(state => state.createCycle);
  const updateCycle = useFormationSchoolStore(state => state.updateCycle);
  const isEditing = !!cycle;
  
  const form = useForm<CycleFormData>({
    resolver: zodResolver(CycleSchema) as any,
    defaultValues: {
      id: crypto.randomUUID(),
      name: '',
      active: true,
      requiredClasses: 6,
      createdUser: userState?.id || '',
      createdDate: new Date(),
    },
  });

  useEffect(() => {
    if (cycle) {
      form.reset({
        id: cycle.id,
        name: cycle.name,
        active: cycle.active,
        requiredClasses: cycle.requiredClasses || 6,
        startDate: new Date(cycle.startDate),
        endDate: new Date(cycle.endDate),
        createdUser: cycle.createdUser,
        createdDate: new Date(cycle.createdDate),
      });
    }
  }, [cycle]);

  async function onSubmit(data: CycleFormData) {
    let success;
    
    if (isEditing) {
      success = await updateCycle({
        id: data.id,
        name: data.name,
        active: data.active,
        requiredClasses: data.requiredClasses,
        startDate: data.startDate,
        endDate: data.endDate,
      });
      if (success) {
        toast.success('Ciclo actualizado exitosamente');
        onSuccess?.();
      } else {
        toast.error('Error al actualizar el ciclo');
      }
    } else {
      success = await createCycle({
        ...data,
      });
      if (success) {
        toast.success('Ciclo creado exitosamente');
        form.reset();
        onSuccess?.();
      } else {
        toast.error('Error al crear el ciclo');
      }
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

        <FormField
          control={form.control}
          name="requiredClasses"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cantidad de Clases</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1" 
                  placeholder="6" 
                  {...field}
                  value={field.value ?? ''}
                  onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                />
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

        <div className="flex gap-2">
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Actualizar Ciclo' : 'Guardar Ciclo'}
          </Button>
          {isEditing && onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
