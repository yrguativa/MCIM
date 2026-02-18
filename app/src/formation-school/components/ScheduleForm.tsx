import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScheduleInput, ScheduleSchema } from '../schemas/scheduleSchema';
import { useFormationSchoolStore } from '../store/formation-school.store';
import { useAuthStore } from '@/src/app/stores';
import { toast } from 'sonner';

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
  onSuccess?: () => void;
}

export const ScheduleForm: React.FC<ScheduleFormProps> = ({ onSuccess }) => {
  const userState = useAuthStore(state => state.user);
  const { createSchedule, getSchedules, courses, getCoursesByCycle, activeCycle, getActiveCycle } = useFormationSchoolStore();
  
  useEffect(() => {
    getSchedules();
    getActiveCycle();
  }, []);

  useEffect(() => {
    if (activeCycle?.id) {
      getCoursesByCycle(activeCycle.id);
    }
  }, [activeCycle]);
  
  const form = useForm<ScheduleInput>({
    resolver: zodResolver(ScheduleSchema),
    defaultValues: {
      id: crypto.randomUUID(),
      dayOfWeek: 1,
      startTime: '08:00',
      endTime: '10:00',
      courseId: '',
      createdUser: userState?.id || '',
      createdDate: new Date(),
    },
  });

  async function onSubmit(data: ScheduleInput) {
    const success = await createSchedule(data);
    
    if (success) {
      toast.success('Horario creado exitosamente');
      form.reset({ ...form.getValues(), id: crypto.randomUUID() });
      onSuccess?.();
    } else {
      toast.error('Error al crear el horario');
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
              <Select onValueChange={(v) => field.onChange(parseInt(v))} defaultValue={field.value.toString()}>
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
          name="courseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Curso (Opcional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar curso" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.levelId} - {course.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          Guardar Horario
        </Button>
      </form>
    </Form>
  );
};
