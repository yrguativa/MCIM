import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, BookOpen, Building, Clock, Plus, Pencil } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CycleForm } from './CycleForm';
import { LevelForm } from './LevelForm';
import { ClassroomForm } from './ClassroomForm';
import { ScheduleForm } from './ScheduleForm';
import { CourseForm } from './CourseForm';
import { StudentEnrollmentForm } from './StudentEnrollmentForm';
import { TeacherEnrollmentForm } from './TeacherEnrollmentForm';
import { useFormationSchoolStore } from '../store/formation-school.store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Cycle, Level, Classroom, Course, Schedule } from '../models';

export const AdminDashboard: React.FC = () => {
  const location = useLocation();
  const { 
    activeCycle, getActiveCycle, 
    courses, getCoursesByCycle,
    levels, getLevels,
    classrooms, getClassrooms,
    schedules, getSchedules,
    students, getStudents,
    cycles, getCycles,
    getEnrollmentsByCourse
  } = useFormationSchoolStore();
  const [selectedCycleId, setSelectedCycleId] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [activeTab, setActiveTab] = useState('cycles');
  
  const [showCycleForm, setShowCycleForm] = useState(false);
  const [showLevelForm, setShowLevelForm] = useState(false);
  const [showClassroomForm, setShowClassroomForm] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  
  const [editingCycle, setEditingCycle] = useState<Cycle | null>(null);
  const [editingLevel, setEditingLevel] = useState<Level | null>(null);
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/levels')) setActiveTab('levels');
    else if (path.includes('/classrooms')) setActiveTab('classrooms');
    else if (path.includes('/schedules')) setActiveTab('schedules');
    else if (path.includes('/courses')) setActiveTab('courses');
    else if (path.includes('/enrollment/teacher')) setActiveTab('teachers');
    else if (path.includes('/enrollment/student') || path.includes('/students')) setActiveTab('students');
    else setActiveTab('cycles');
  }, [location]);

  useEffect(() => {
    getActiveCycle();
    getLevels();
    getClassrooms();
    getSchedules();
    getStudents();
    getCycles();
  }, []);
  
  useEffect(() => {
    if (activeCycle) {
      setSelectedCycleId(activeCycle.id);
      getCoursesByCycle(activeCycle.id);
    }
  }, [activeCycle]);

  useEffect(() => {
    if (selectedCourseId) {
      getEnrollmentsByCourse(selectedCourseId);
    }
  }, [selectedCourseId]);

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Administración - Escuela de Formación</h1>
      </div>
      
      {activeCycle && (
        <Card>
          <CardHeader>
            <CardTitle>Ciclo Activo: {activeCycle.name}</CardTitle>
            <CardDescription>
              {new Date(activeCycle.startDate).toLocaleDateString()} - {new Date(activeCycle.endDate).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
          </CardContent>
        </Card>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="cycles">Ciclos</TabsTrigger>
          <TabsTrigger value="levels">Niveles</TabsTrigger>
          <TabsTrigger value="classrooms">Salones</TabsTrigger>
          <TabsTrigger value="schedules">Horarios</TabsTrigger>
          <TabsTrigger value="courses">Cursos</TabsTrigger>
          <TabsTrigger value="teachers">Maestros</TabsTrigger>
          <TabsTrigger value="students">Estudiantes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cycles" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => { setShowCycleForm(!showCycleForm); setEditingCycle(null); }}>
              <Plus className="mr-2 h-4 w-4" />
              {showCycleForm ? 'Ver Lista' : 'Nuevo Ciclo'}
            </Button>
          </div>
          
          {showCycleForm || editingCycle ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {editingCycle ? 'Editar Ciclo' : 'Crear Ciclo'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CycleForm 
                  cycle={editingCycle} 
                  onSuccess={() => { setEditingCycle(null); setShowCycleForm(false); }} 
                  onCancel={() => setEditingCycle(null)} 
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Lista de Ciclos</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Inicio</TableHead>
                      <TableHead>Fin</TableHead>
                      <TableHead>Clases</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cycles.map((cycle) => (
                      <TableRow key={cycle.id}>
                        <TableCell>{cycle.name}</TableCell>
                        <TableCell>{new Date(cycle.startDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(cycle.endDate).toLocaleDateString()}</TableCell>
                        <TableCell>{cycle.requiredClasses || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={cycle.active ? 'default' : 'secondary'}>
                            {cycle.active ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => setEditingCycle(cycle)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="levels" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => { setShowLevelForm(!showLevelForm); setEditingLevel(null); }}>
              <Plus className="mr-2 h-4 w-4" />
              {showLevelForm ? 'Ver Lista' : 'Nuevo Nivel'}
            </Button>
          </div>
          
          {showLevelForm || editingLevel ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {editingLevel ? 'Editar Nivel' : 'Crear Nivel'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LevelForm 
                  level={editingLevel}
                  onSuccess={() => { setEditingLevel(null); setShowLevelForm(false); }}
                  onCancel={() => setEditingLevel(null)}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Lista de Niveles</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Orden</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {levels.map((level) => (
                      <TableRow key={level.id}>
                        <TableCell>{level.name}</TableCell>
                        <TableCell>{level.description || '-'}</TableCell>
                        <TableCell>{level.order}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => setEditingLevel(level)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="classrooms" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => { setShowClassroomForm(!showClassroomForm); setEditingClassroom(null); }}>
              <Plus className="mr-2 h-4 w-4" />
              {showClassroomForm ? 'Ver Lista' : 'Nuevo Salón'}
            </Button>
          </div>
          
          {showClassroomForm || editingClassroom ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {editingClassroom ? 'Editar Salón' : 'Crear Salón'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ClassroomForm 
                  classroom={editingClassroom}
                  onSuccess={() => { setEditingClassroom(null); setShowClassroomForm(false); }}
                  onCancel={() => setEditingClassroom(null)}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Lista de Salones</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Capacidad</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classrooms.map((classroom) => (
                      <TableRow key={classroom.id}>
                        <TableCell>{classroom.name}</TableCell>
                        <TableCell>{classroom.capacity}</TableCell>
                        <TableCell>{classroom.location}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => setEditingClassroom(classroom)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="schedules" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => { setShowScheduleForm(!showScheduleForm); setEditingSchedule(null); }}>
              <Plus className="mr-2 h-4 w-4" />
              {showScheduleForm ? 'Ver Lista' : 'Nuevo Horario'}
            </Button>
          </div>
          
          {showScheduleForm || editingSchedule ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {editingSchedule ? 'Editar Horario' : 'Crear Horario'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScheduleForm 
                  schedule={editingSchedule}
                  onSuccess={() => { setEditingSchedule(null); setShowScheduleForm(false); }}
                  onCancel={() => setEditingSchedule(null)}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Lista de Horarios</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Día</TableHead>
                      <TableHead>Hora Inicio</TableHead>
                      <TableHead>Hora Fin</TableHead>
                      <TableHead>Nivel</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedules.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell>{['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'][schedule.dayOfWeek]}</TableCell>
                        <TableCell>{schedule.startTime}</TableCell>
                        <TableCell>{schedule.endTime}</TableCell>
                        <TableCell>{schedule.levelId ? levels.find(l => l.id === schedule.levelId)?.name || schedule.levelId : '-'}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => { console.log('Editing schedule:', schedule); setEditingSchedule(schedule); }}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="courses" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => { setShowCourseForm(!showCourseForm); setEditingCourse(null); }}>
              <Plus className="mr-2 h-4 w-4" />
              {showCourseForm ? 'Ver Lista' : 'Nuevo Curso'}
            </Button>
          </div>
          
          {showCourseForm || editingCourse ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {editingCourse ? 'Editar Curso' : 'Crear Curso'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedCycleId ? (
                  <CourseForm 
                    cycleId={selectedCycleId} 
                    course={editingCourse}
                    onSuccess={() => { setEditingCourse(null); setShowCourseForm(false); }}
                    onCancel={() => setEditingCourse(null)}
                  />
                ) : (
                  <p>Selecciona un ciclo activo primero</p>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Lista de Cursos</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nivel</TableHead>
                      <TableHead>Salón</TableHead>
                      <TableHead>Horario</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>{course.level?.name || course.levelId}</TableCell>
                        <TableCell>{course.classroom?.name || course.classroomId}</TableCell>
                        <TableCell>{course.schedule?.dayOfWeek}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => setEditingCourse(course)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="teachers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Maestros Asignados</CardTitle>
            </CardHeader>
            <CardContent>
              {courses.length > 0 ? (
                <div className="space-y-4">
                  <Select onValueChange={handleCourseSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.level?.name || course.levelId || 'Curso'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedCourseId && (
                    <TeacherEnrollmentForm courseId={selectedCourseId} />
                  )}
                </div>
              ) : (
                <p>No hay cursos disponibles. Crea un curso primero.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Estudiantes Inscritos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Nivel</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.discipleId}</TableCell>
                      <TableCell>{student.currentLevelId}</TableCell>
                      <TableCell><Badge>{student.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Inscribir Nuevo Estudiante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StudentEnrollmentForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};