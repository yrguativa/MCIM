import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, BookOpen, Building, Clock } from 'lucide-react';
import { CycleForm } from './CycleForm';
import { LevelForm } from './LevelForm';
import { ClassroomForm } from './ClassroomForm';
import { ScheduleForm } from './ScheduleForm';
import { CourseForm } from './CourseForm';
import { StudentEnrollmentForm } from './StudentEnrollmentForm';
import { TeacherEnrollmentForm } from './TeacherEnrollmentForm';
import { useFormationSchoolStore } from '../store/formation-school.store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const AdminDashboard: React.FC = () => {
  const { activeCycle, getActiveCycle, courses, getCoursesByCycle } = useFormationSchoolStore();
  const [selectedCycleId, setSelectedCycleId] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  
  useEffect(() => {
    getActiveCycle();
  }, []);
  
  useEffect(() => {
    if (activeCycle) {
      setSelectedCycleId(activeCycle.id);
      getCoursesByCycle(activeCycle.id);
    }
  }, [activeCycle]);

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
            <p>Cursos requeridos: {activeCycle.requiredClasses}</p>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="cycles" className="w-full">
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Crear Ciclo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CycleForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="levels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Crear Nivel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LevelForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="classrooms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Crear Salón
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ClassroomForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schedules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Crear Horario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScheduleForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Crear Curso
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCycleId ? (
                <CourseForm cycleId={selectedCycleId} />
              ) : (
                <p>Selecciona un ciclo activo primero</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="teachers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Asignar Maestro a Curso
              </CardTitle>
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
                          {course.levelId?.name || 'Curso'}
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
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Inscribir Estudiante a Curso
              </CardTitle>
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
                          {course.levelId?.name || 'Curso'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedCourseId && (
                    <StudentEnrollmentForm courseId={selectedCourseId} />
                  )}
                </div>
              ) : (
                <p>No hay cursos disponibles. Crea un curso primero.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
