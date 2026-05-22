import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Search, BookOpen, GraduationCap } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormationSchoolStore } from '../store/formation-school.store';
import { useDiscipleStore } from '@/src/disciples/store/disciple.store';
import { useAuthStore } from '@/src/app/stores';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { StudentHistory } from '../components/StudentHistory';
import { Disciple } from '@/src/disciples/models/disciple';

const enrollmentSchema = z.object({
  studentId: z.string().min(1, 'Debe seleccionar un estudiante'),
  levelId: z.string().min(1, 'Debe seleccionar un nivel'),
  courseId: z.string().min(1, 'Debe seleccionar un curso'),
});

type EnrollmentFormData = z.infer<typeof enrollmentSchema>;

export const StudentEnrollmentPage: React.FC = () => {
  const userState = useAuthStore(state => state.user);
  const { Disciples, getDisciples } = useDiscipleStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  console.log('[EnrollmentPage] Disciples:', Disciples);
  console.log('[EnrollmentPage] searchQuery:', searchQuery);
  
  const filteredDisciples = useMemo(() => {
    if (!searchQuery) return Disciples;
    const query = searchQuery.toLowerCase();
    return Disciples.filter(d => 
      d.name.toLowerCase().includes(query) || 
      d.lastName.toLowerCase().includes(query) ||
      (d.identification && d.identification.toLowerCase().includes(query))
    );
  }, [Disciples, searchQuery]);
  
  console.log('[EnrollmentPage] filteredDisciples:', filteredDisciples);
  
  const {
    students,
    getStudents,
    activeCycle,
    getActiveCycle,
    levels,
    getLevels,
    courses,
    getCoursesByCycle,
    enrollStudent,
    enrollments,
    getEnrollmentsByStudent,
    courseHistories,
    getCourseHistoriesByStudent,
    createStudent,
  } = useFormationSchoolStore();

  console.log('[EnrollmentPage] levels:', levels);
  console.log('[EnrollmentPage] courses:', courses);
  console.log('[EnrollmentPage] activeCycle:', activeCycle);

  const [discipleSearchOpen, setDiscipleSearchOpen] = useState(false);
  const [selectedDisciple, setSelectedDisciple] = useState<Disciple | null>(null);
  const [existingStudent, setExistingStudent] = useState<{ id: string; currentLevelId?: string } | null>(null);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);

  const form = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema as any),
    defaultValues: {
      studentId: '',
      levelId: '',
      courseId: '',
    },
  });

  const selectedLevelId = form.watch('levelId');

  useEffect(() => {
    console.log('[EnrollmentPage] Loading data...');
    getStudents();
    getActiveCycle();
    getLevels();
    getDisciples();
  }, []);

  useEffect(() => {
    console.log('[EnrollmentPage] activeCycle:', activeCycle);
    if (activeCycle) {
      console.log('[EnrollmentPage] Loading courses for cycle:', activeCycle.id);
      getCoursesByCycle(activeCycle.id);
    }
  }, [activeCycle]);

  useEffect(() => {
    if (selectedDisciple) {
      const student = students.find(s => s.discipleId === selectedDisciple.id);
      if (student) {
        setExistingStudent(student);
        getCourseHistoriesByStudent(student.id);
      } else {
        setExistingStudent(null);
      }
    }
  }, [selectedDisciple, students]);

  const handleDiscipleSearch = (value: string) => {
    console.log('[EnrollmentPage] handleDiscipleSearch called with:', value);
    setSearchQuery(value);
  };

  const handleDiscipleSelect = (disciple: Disciple) => {
    setSelectedDisciple(disciple);
    form.setValue('studentId', disciple.id);
    setDiscipleSearchOpen(false);
    setEnrollmentError(null);
  };

  const handleLevelChange = (value: string) => {
    form.setValue('levelId', value);
    form.setValue('courseId', '');
    setEnrollmentError(null);
  };

  const availableCourses = courses.filter(course => {
    if (!selectedLevelId) return false;
    const level = levels.find(l => l.id === selectedLevelId);
    if (!level) return false;
    return course.levelId === selectedLevelId;
  });

  const handleSubmit = async (data: EnrollmentFormData) => {
    if (!selectedDisciple || !activeCycle || !userState) {
      toast.error('Error: Faltan datos requeridos');
      return;
    }

    let studentId = existingStudent?.id;

    if (!studentId) {
      const newStudent = await createStudent({
        discipleId: selectedDisciple.id,
        currentLevelId: data.levelId,
        status: 'active',
        createdUser: userState.id,
      });

      if (!newStudent) {
        toast.error('Error al crear el estudiante');
        return;
      }

      await getStudents();
      const createdStudent = students.find(s => s.discipleId === selectedDisciple.id);
      if (!createdStudent) {
        toast.error('Error al obtener el estudiante creado');
        return;
      }
      studentId = createdStudent.id;
    }

    const isAlreadyEnrolled = enrollments.some(
      e => e.studentId === studentId && e.courseId === data.courseId && e.status === 'active'
    );

    if (isAlreadyEnrolled) {
      setEnrollmentError('El estudiante ya está inscrito en este curso');
      toast.error('El estudiante ya está inscrito en este curso');
      return;
    }

    const success = await enrollStudent({
      studentId,
      courseId: data.courseId,
      status: 'active',
      createdUser: userState.id,
    });

    if (success) {
      toast.success('Estudiante inscrito exitosamente');
      form.reset();
      setSelectedDisciple(null);
      setExistingStudent(null);
      setEnrollmentError(null);
      if (studentId) {
        getEnrollmentsByStudent(studentId);
      }
    } else {
      toast.error('Error al inscribir al estudiante');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inscripción de Estudiantes</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Discípulo
          </CardTitle>
          <CardDescription>
            Busque y seleccione el discípulo que desea inscribir
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Estudiante</FormLabel>
                    <Popover open={discipleSearchOpen} onOpenChange={setDiscipleSearchOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(!field.value && "text-muted-foreground")}
                          >
                            {selectedDisciple
                              ? `${selectedDisciple.name} ${selectedDisciple.lastName}`
                              : "Buscar discípulo..."}
                            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0" sideOffset={4}>
                        <Command shouldFilter={false}>
                          <CommandInput
                            placeholder="Buscar discípulo..."
                            onValueChange={handleDiscipleSearch}
                          />
                          <CommandList>
                            <CommandEmpty>No se encontró el discípulo</CommandEmpty>
                            <CommandGroup>
                              {filteredDisciples.map((disciple: Disciple) => (
                                <CommandItem
                                  value={`${disciple.name} ${disciple.lastName}`}
                                  key={disciple.id}
                                  onSelect={() => handleDiscipleSelect(disciple)}
                                >
                                  {disciple.name} {disciple.lastName} - {disciple.identification}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedDisciple && (
                <>
                  {existingStudent && (
                    <Card className="bg-muted/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          Historial del Estudiante
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <StudentHistory
                          histories={courseHistories}
                          levels={levels}
                        />
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="levelId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nivel Inicial</FormLabel>
                          <Select
                            onValueChange={handleLevelChange}
                            value={field.value}
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
                          <FormLabel>Curso</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!selectedLevelId}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar curso" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableCourses.map((course) => (
                                <SelectItem key={course.id} value={course.id}>
                                  <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    {course.levelId && levels.find(l => l.id === course.levelId)?.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {enrollmentError && (
                    <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                      {enrollmentError}
                    </div>
                  )}

                  {activeCycle && (
                    <div className="text-sm text-muted-foreground">
                      Ciclo activo: {activeCycle.name}
                    </div>
                  )}

                  <Button type="submit" disabled={!selectedLevelId || !form.getValues('courseId')}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Inscribir Estudiante
                  </Button>
                </>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
