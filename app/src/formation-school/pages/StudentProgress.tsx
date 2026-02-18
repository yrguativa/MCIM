import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award } from 'lucide-react';
import { useFormationSchoolStore } from '../store/formation-school.store';
import { useAuthStore } from '@/src/app/stores';
import { toast } from 'sonner';

export const StudentProgress: React.FC = () => {
  const userState = useAuthStore(state => state.user);
  const { 
    enrollments, 
    getEnrollmentsByStudent, 
    activeCycle,
    getActiveCycle,
    attendances,
    calculateFinalGrade
  } = useFormationSchoolStore();
  
  useEffect(() => {
    if (userState?.id) {
      getEnrollmentsByStudent(userState.id);
      getActiveCycle();
    }
  }, [userState?.id]);
  
  const handleCalculateGrade = async (enrollmentId: string) => {
    if (!activeCycle) return;
    
    try {
      const grade = await calculateFinalGrade(enrollmentId, activeCycle.requiredClasses);
      toast.success(`Nota calculada: ${grade.toFixed(1)}%`);
    } catch {
      toast.error('Error al calcular la nota');
    }
  };
  
  const getGradeColor = (grade: number) => {
    if (grade >= 75) return 'text-green-500';
    if (grade >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mi Progreso</h1>
      </div>
      
      {activeCycle && (
        <Card>
          <CardHeader>
            <CardTitle>Ciclo Activo: {activeCycle.name}</CardTitle>
            <CardDescription>
              Período: {new Date(activeCycle.startDate).toLocaleDateString()} - {new Date(activeCycle.endDate).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Cursos requeridos para aprobar: {activeCycle.requiredClasses}</p>
          </CardContent>
        </Card>
      )}
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {enrollments.map((enrollment) => {
          const attendanceCount = attendances.filter(
            a => a.studentEnrollmentId === enrollment.id && a.attended
          ).length;
          const progress = activeCycle ? (attendanceCount / activeCycle.requiredClasses) * 100 : 0;
          
          return (
            <Card key={enrollment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {enrollment.courseClassId?.levelId?.name || 'Curso'}
                </CardTitle>
                <Badge variant={enrollment.status === 'active' ? 'default' : 'secondary'}>
                  {enrollment.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-medium">{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Asistencias</span>
                    <span>{attendanceCount} / {activeCycle?.requiredClasses || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Nota Final</span>
                    <span className={`font-bold ${getGradeColor(enrollment.finalGrade || 0)}`}>
                      {enrollment.finalGrade ? `${enrollment.finalGrade.toFixed(1)}%` : 'Pendiente'}
                    </span>
                  </div>
                  
                  {enrollment.status === 'active' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleCalculateGrade(enrollment.id)}
                    >
                      Calcular Nota
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {enrollments.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center">
            <Award className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No tienes cursos inscritos</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
