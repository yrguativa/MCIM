import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScheduleInput, ScheduleSchema } from '../schemas/scheduleSchema';
import { useFormationSchoolStore } from '../store/formation-school.store';
import { useAuthStore } from '@/src/app/stores';
import { toast } from 'sonner';
import { Schedule } from '../models';

const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
];

interface ScheduleFormProps {
  schedule?: Schedule | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ScheduleForm: React.FC<ScheduleFormProps> = ({ schedule, onSuccess, onCancel }) => {
  const userState = useAuthStore(state => state.user);
  const { createSchedule, updateSchedule, levels, getLevels } = useFormationSchoolStore();
  const isEditing = !!schedule;
  
  useEffect(() => {
    getLevels();
  }, []);
  
  const form = useForm<ScheduleInput>({
    resolver: zodResolver(ScheduleSchema) as any,
    defaultValues: {
      id: crypto.randomUUID(),
      dayOfWeek: 1,
      startTime: '08:00',
      endTime: '10:00',
      levelId: '',
      createdUser: userState?.id || '',
      createdDate: new Date(),
    },
  });

  useEffect(() => {
    if (schedule) {
      console.log('Resetting form with schedule:', schedule);
      form.reset({
        id: schedule.id,
        dayOfWeek: schedule.dayOfWeek,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        levelId: schedule.levelId || '',
        createdUser: schedule.createdUser,
        createdDate: new Date(schedule.createdDate),
      });
    }
  }, [schedule]);

  async function onSubmit(data: ScheduleInput) {
    let success;
    
    if (isEditing) {
      success = await updateSchedule({
        id: data.id,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        levelId: data.levelId,
      });
      if (success) {
        toast.success('Horario actualizado exitosamente');
        onSuccess?.();
      } else {
        toast.error('Error al actualizar el horario');
      }
    } else {
      success = await createSchedule(data);
      if (success) {
        toast.success('Horario creado exitosamente');
        form.reset({ ...form.getValues(), id: crypto.randomUUID() });
        onSuccess?.();
      } else {
        toast.error('Error al crear el horario');
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="dayOfWeek"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Día de la Semana</FormLabel>
              <Select onValueChange={(v) => field.onChange(parseInt(v))} defaultValue={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar día" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day) => (
                    <SelectItem key={day.value} value={day.value.toString()}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora de Inicio</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora de Fin</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="levelId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nivel</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar nivel" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-2">
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Actualizar Horario' : 'Guardar Horario'}
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
