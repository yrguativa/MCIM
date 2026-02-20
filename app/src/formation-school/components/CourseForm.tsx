import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { CourseInput, CourseSchema } from '../schemas/courseSchema';
import { useFormationSchoolStore } from '../store/formation-school.store';
import { useAuthStore } from '@/src/app/stores';
import { useDiscipleStore } from '@/src/disciples/store/disciple.store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Course } from '../models';

interface CourseFormProps {
  cycleId: string;
  course?: Course | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CourseForm: React.FC<CourseFormProps> = ({ cycleId, course, onSuccess, onCancel }) => {
  const userState = useAuthStore(state => state.user);
  const { searchByName, searchResults } = useDiscipleStore();
  const { levels, getLevelsByCycle, classrooms, getClassrooms, schedules, getSchedules, createCourse, updateCourse } = useFormationSchoolStore();
  
  const [teacherSearchOpen, setTeacherSearchOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<{id: string, name: string} | null>(null);
  const isEditing = !!course;
  
  useEffect(() => {
    getLevelsByCycle(cycleId);
    getClassrooms();
    getSchedules();
  }, [cycleId]);
  
  const form = useForm<CourseInput>({
    resolver: zodResolver(CourseSchema) as any,
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

  useEffect(() => {
    if (course) {
      form.reset({
        id: course.id,
        levelId: course.levelId,
        teacherId: course.teacherId,
        classroomId: course.classroomId,
        scheduleId: course.scheduleId,
        cycleId: course.cycleId,
        type: course.type,
        requiredClasses: course.requiredClasses,
        createdUser: course.createdUser,
        createdDate: new Date(course.createdDate),
      });
      if (course.teacher) {
        setSelectedTeacher({ id: course.teacher.id, name: course.teacher.name || '' });
      }
    }
  }, [course]);

  async function onSubmit(data: CourseInput) {
    let success;
    
    if (isEditing) {
      success = await updateCourse({
        id: data.id,
        levelId: data.levelId,
        teacherId: data.teacherId,
        classroomId: data.classroomId,
        scheduleId: data.scheduleId,
        cycleId: data.cycleId,
        type: data.type,
        requiredClasses: data.requiredClasses,
      });
      if (success) {
        toast.success('Curso actualizado exitosamente');
        onSuccess?.();
      } else {
        toast.error('Error al actualizar el curso. Verifica que no haya conflicto de horario.');
      }
    } else {
      success = await createCourse(data);
      if (success) {
        toast.success('Curso creado exitosamente');
        form.reset({ ...form.getValues(), id: crypto.randomUUID() });
        setSelectedTeacher(null);
        onSuccess?.();
      } else {
        toast.error('Error al crear el curso. Verifica que no haya conflicto de horario.');
      }
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="vision">Visión</SelectItem>
                  <SelectItem value="doctrina">Doctrina</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requiredClasses"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clases Requeridas</FormLabel>
              <FormControl>
                <input
                  type="number"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Número de clases requeridas"
                  value={field.value ?? ''}
                  onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </FormControl>
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
        
        <div className="flex gap-2">
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Actualizar Curso' : 'Crear Curso'}
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
