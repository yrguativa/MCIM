import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus, Clock, BookOpen, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { StudentEnrollmentInput, StudentEnrollmentSchema } from '../schemas/enrollmentSchema';
import { useFormationSchoolStore } from '../store/formation-school.store';
import { useAuthStore } from '@/src/app/stores';
import { useDiscipleStore } from '@/src/disciples/store/disciple.store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface StudentEnrollmentFormProps {
  onSuccess?: () => void;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
];

export const StudentEnrollmentForm: React.FC<StudentEnrollmentFormProps> = ({ onSuccess }) => {
  const userState = useAuthStore(state => state.user);
  const { searchByName, searchResults } = useDiscipleStore();
  const { 
    enrollStudent, 
    levels, 
    getLevels, 
    courses, 
    getCoursesByCycle,
    cycles,
    getCycles
  } = useFormationSchoolStore();
  
  const [studentSearchOpen, setStudentSearchOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{id: string, name: string} | null>(null);
  const [selectedCycleId, setSelectedCycleId] = useState<string>('');
  const [selectedLevelId, setSelectedLevelId] = useState<string>('');
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>('');
  const [matchingCourse, setMatchingCourse] = useState<typeof courses[0] | null>(null);

  useEffect(() => {
    getLevels();
    getCycles();
  }, []);

  useEffect(() => {
    if (selectedCycleId) {
      getCoursesByCycle(selectedCycleId);
    }
  }, [selectedCycleId]);

  useEffect(() => {
    if (selectedLevelId && selectedScheduleId && courses.length > 0) {
      const course = courses.find(
        c => c.levelId === selectedLevelId && c.scheduleId === selectedScheduleId
      );
      setMatchingCourse(course || null);
    } else {
      setMatchingCourse(null);
    }
  }, [selectedLevelId, selectedScheduleId, courses]);

  const form = useForm<StudentEnrollmentInput>({
    resolver: zodResolver(StudentEnrollmentSchema) as any,
    defaultValues: {
      id: crypto.randomUUID(),
      studentId: '',
      courseId: '',
      enrollmentDate: new Date(),
      status: 'active',
      createdUser: userState?.id || '',
      createdDate: new Date(),
    },
  });

  async function onSubmit(data: StudentEnrollmentInput) {
    if (!selectedCycleId || !selectedLevelId || !selectedScheduleId) {
      toast.error('Debe seleccionar ciclo, nivel y horario');
      return;
    }

    if (!matchingCourse) {
      toast.error('No existe un curso creado para el nivel y horario seleccionados. Cree el curso primero en la administración.');
      return;
    }

    const success = await enrollStudent({
      ...data,
      courseId: matchingCourse.id,
    });
    
    if (success) {
      toast.success('Estudiante inscrito exitosamente');
      form.reset({ 
        ...form.getValues(), 
        id: crypto.randomUUID(),
        studentId: '',
        courseId: '' 
      });
      setSelectedStudent(null);
      setSelectedCycleId('');
      setSelectedLevelId('');
      setSelectedScheduleId('');
      onSuccess?.();
    } else {
      toast.error('Error al inscribir al estudiante');
    }
  }

  const handleStudentSearch = (value: string) => {
    if (value.length >= 2) {
      searchByName(value);
    }
  };

  const getScheduleDisplay = (scheduleId: string) => {
    const course = courses.find(c => c.scheduleId === scheduleId);
    if (!course?.schedule) return scheduleId;
    const day = DAYS_OF_WEEK[course.schedule.dayOfWeek]?.label || '';
    return `${day} ${course.schedule.startTime}-${course.schedule.endTime}`;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Estudiante (Discípulo)
              </FormLabel>
              <Popover open={studentSearchOpen} onOpenChange={setStudentSearchOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(!field.value && "text-muted-foreground")}
                    >
                      {selectedStudent ? `${selectedStudent.name}` : "Buscar discípulo..."}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar discípulo..." onValueChange={handleStudentSearch} />
                    <CommandEmpty>No se encontró el discípulo</CommandEmpty>
                    <CommandGroup>
                      {searchResults.map((disciple) => (
                        <CommandItem
                          value={`${disciple.name} ${disciple.lastName}`}
                          key={disciple.id}
                          onSelect={() => {
                            form.setValue("studentId", disciple.id);
                            setSelectedStudent({ id: disciple.id, name: `${disciple.name} ${disciple.lastName}` });
                            setStudentSearchOpen(false);
                          }}
                        >
                          {disciple.name} {disciple.lastName} - {disciple.identification}
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
          name="courseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Ciclo de Inscripción
              </FormLabel>
              <Select 
                value={selectedCycleId} 
                onValueChange={(value) => {
                  setSelectedCycleId(value);
                  setSelectedLevelId('');
                  setSelectedScheduleId('');
                  field.onChange(value);
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ciclo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cycles.map((cycle) => (
                    <SelectItem key={cycle.id} value={cycle.id}>
                      {cycle.name} - {new Date(cycle.startDate).toLocaleDateString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="courseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Nivel
                </FormLabel>
                <Select 
                  value={selectedLevelId} 
                  onValueChange={(value) => {
                    setSelectedLevelId(value);
                    setSelectedScheduleId('');
                    field.onChange(value);
                  }}
                  disabled={!selectedCycleId}
                >
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

          <FormField
            control={form.control}
            name="courseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Horario
                </FormLabel>
                <Select 
                  value={selectedScheduleId} 
                  onValueChange={(value) => {
                    setSelectedScheduleId(value);
                    field.onChange(value);
                  }}
                  disabled={!selectedLevelId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar horario" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courses
                      .filter(c => c.levelId === selectedLevelId && c.scheduleId)
                      .map((course) => (
                        <SelectItem key={course.scheduleId!} value={course.scheduleId!}>
                          {getScheduleDisplay(course.scheduleId!)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {selectedLevelId && selectedScheduleId && (
          <div className={cn(
            "p-3 rounded-md",
            matchingCourse ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"
          )}>
            {matchingCourse ? (
              <>
                <p className="text-sm font-medium text-green-700">
                  ✓ Curso encontrado: {matchingCourse.level?.name || 'Curso'}
                </p>
                <p className="text-xs text-green-600">
                  El estudiante será inscrito en este curso
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-yellow-700">
                  ⚠ No existe curso creado
                </p>
                <p className="text-xs text-yellow-600">
                  Debe crear el curso primero en "Administración de Cursos"
                </p>
              </>
            )}
          </div>
        )}

        <Button 
          type="submit" 
          disabled={!selectedStudent || !selectedCycleId || !selectedLevelId || !selectedScheduleId}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Inscribir Estudiante
        </Button>
      </form>
    </Form>
  );
};
