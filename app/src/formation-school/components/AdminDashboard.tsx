import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, BookOpen, Building, Clock } from 'lucide-react';
import { CycleForm } from './CycleForm';
import { LevelForm } from './LevelForm';
import { ClassroomForm } from './ClassroomForm';
import { ScheduleForm } from './ScheduleForm';
import { CourseClassForm } from './CourseClassForm';
import { useFormationSchoolStore } from '../store/formation-school.store';

export const AdminDashboard: React.FC = () => {
  const { activeCycle, getActiveCycle, getCourseClassesByCycle } = useFormationSchoolStore();
  const [selectedCycleId, setSelectedCycleId] = useState<string>('');
  
  useEffect(() => {
    getActiveCycle();
  }, []);
  
  useEffect(() => {
    if (activeCycle) {
      setSelectedCycleId(activeCycle.id);
      getCourseClassesByCycle(activeCycle.id);
    }
  }, [activeCycle]);

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
            <p>Clases requeridas: {activeCycle.requiredClasses}</p>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="cycles" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="cycles">Ciclos</TabsTrigger>
          <TabsTrigger value="levels">Niveles</TabsTrigger>
          <TabsTrigger value="classrooms">Salones</TabsTrigger>
          <TabsTrigger value="schedules">Horarios</TabsTrigger>
          <TabsTrigger value="classes">Clases</TabsTrigger>
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
              {selectedCycleId ? (
                <LevelForm cycleId={selectedCycleId} />
              ) : (
                <p>Selecciona un ciclo activo primero</p>
              )}
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
        
        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Crear Clase
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCycleId ? (
                <CourseClassForm cycleId={selectedCycleId} />
              ) : (
                <p>Selecciona un ciclo activo primero</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
