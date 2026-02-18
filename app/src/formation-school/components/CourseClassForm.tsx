import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { CourseClassInput, CourseClassSchema } from '../schemas/courseClassSchema';
import { useFormationSchoolStore } from '../store/formation-school.store';
import { useAuthStore } from '@/src/app/stores';
import { useDiscipleStore } from '@/src/disciples/store/disciple.store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CourseClassFormProps {
  cycleId: string;
  onSuccess?: () => void;
}

export const CourseClassForm: React.FC<CourseClassFormProps> = ({ cycleId, onSuccess }) => {
  const userState = useAuthStore(state => state.user);
  const { searchByName, searchResults } = useDiscipleStore();
  const { levels, getLevelsByCycle, classrooms, getClassrooms, schedules, getSchedules, createCourseClass } = useFormationSchoolStore();
  
  const [teacherSearchOpen, setTeacherSearchOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<{id: string, name: string} | null>(null);
  
  useEffect(() => {
    getLevelsByCycle(cycleId);
    getClassrooms();
    getSchedules();
  }, [cycleId]);
  
  const form = useForm<CourseClassInput>({
    resolver: zodResolver(CourseClassSchema),
    defaultValues: {
      id: crypto.randomUUID(),
      levelId: '',
      teacherId: '',
      classroomId: '',
      scheduleId: '',
      cycleId,
      createdUser: userState?.id || '',
      createdDate: new Date(),
    },
  });

  async function onSubmit(data: CourseClassInput) {
    const success = await createCourseClass(data);
    
    if (success) {
      toast.success('Clase creada exitosamente');
      form.reset({ ...form.getValues(), id: crypto.randomUUID() });
      setSelectedTeacher(null);
      onSuccess?.();
    } else {
      toast.error('Error al crear la clase. Verifica que no haya conflicto de horario.');
    }
  }

  const handleTeacherSearch = (value: string) => {
    if (value.length >= 2) {
      searchByName(value);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      {level.name} (Orden: {level.order})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="teacherId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Maestro</FormLabel>
              <Popover open={teacherSearchOpen} onOpenChange={setTeacherSearchOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(!field.value && "text-muted-foreground")}
                    >
                      {selectedTeacher ? `${selectedTeacher.name}` : "Buscar maestro..."}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar maestro..." onValueChange={handleTeacherSearch} />
                    <CommandEmpty>No se encontró el maestro</CommandEmpty>
                    <CommandGroup>
                      {searchResults.map((disciple) => (
                        <CommandItem
                          value={`${disciple.name} ${disciple.lastName}`}
                          key={disciple.id}
                          onSelect={() => {
                            form.setValue("teacherId", disciple.id);
                            setSelectedTeacher({ id: disciple.id, name: `${disciple.name} ${disciple.lastName}` });
                            setTeacherSearchOpen(false);
                          }}
                        >
                          {disciple.name} {disciple.lastName}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="classroomId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salón</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar salón" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {classrooms.map((classroom) => (
                    <SelectItem key={classroom.id} value={classroom.id}>
                      {classroom.name} (Cap: {classroom.capacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="scheduleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horario</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar horario" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {schedules.map((schedule) => (
                    <SelectItem key={schedule.id} value={schedule.id}>
                      {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][schedule.dayOfWeek]} {schedule.startTime}-{schedule.endTime}
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
          Crear Clase
        </Button>
      </form>
    </Form>
  );
};
