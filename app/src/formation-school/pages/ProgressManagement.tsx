import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Award, ArrowRight, User } from 'lucide-react';
import { useFormationSchoolStore } from '../store/formation-school.store';
import { toast } from 'sonner';

interface ProgressManagementProps {
  courseClassId?: string;
}

export const ProgressManagement: React.FC<ProgressManagementProps> = ({ courseClassId }) => {
  const { 
    enrollments, 
    getEnrollmentsByCourseClass,
    activeCycle,
    getActiveCycle,
    getAttendanceByCourseClass,
    attendances,
    calculateFinalGrade,
    getLevelsByCycle,
  } = useFormationSchoolStore();
  
  useEffect(() => {
    getActiveCycle();
    if (courseClassId) {
      getEnrollmentsByCourseClass(courseClassId);
      getAttendanceByCourseClass(courseClassId);
    }
  }, [courseClassId]);
  
  useEffect(() => {
    if (activeCycle) {
      getLevelsByCycle(activeCycle.id);
    }
  }, [activeCycle]);
  
  const handleCalculateAllGrades = async () => {
    if (!activeCycle) return;
    
    for (const enrollment of enrollments) {
      try {
        await calculateFinalGrade(enrollment.id, activeCycle.requiredClasses);
      } catch (error) {
        console.error(`Error calculating grade for ${enrollment.id}:`, error);
      }
    }
    
    toast.success('Notas calculadas exitosamente');
  };
  
  const getGradeColor = (grade: number) => {
    if (grade >= 75) return 'text-green-500';
    if (grade >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const getGradeBadge = (grade: number) => {
    if (grade >= 75) return <Badge variant="default">Aprobado</Badge>;
    if (grade >= 50) return <Badge variant="secondary">En proceso</Badge>;
    return <Badge variant="destructive">Reprobado</Badge>;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestión de Progreso</h1>
        <Button onClick={handleCalculateAllGrades}>
          <Award className="mr-2 h-4 w-4" />
          Calcular Todas las Notas
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Estudiantes</CardTitle>
          <CardDescription>
            {activeCycle?.name} - {enrollments.length} estudiantes inscritos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estudiante</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Asistencias</TableHead>
                <TableHead>Progreso</TableHead>
                <TableHead>Nota</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map((enrollment) => {
                const attendanceList = attendances.filter(
                  a => a.studentEnrollmentId === enrollment.id
                );
                const attendedCount = attendanceList.filter(a => a.attended).length;
                const progress = activeCycle ? (attendedCount / activeCycle.requiredClasses) * 100 : 0;
                
                return (
                  <TableRow key={enrollment.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {enrollment.studentId?.name} {enrollment.studentId?.lastName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={enrollment.status === 'active' ? 'default' : 'secondary'}>
                        {enrollment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {attendedCount} / {activeCycle?.requiredClasses || 0}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 w-32">
                        <Progress value={progress} className="h-2" />
                        <span className="text-xs">{progress.toFixed(0)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${getGradeColor(enrollment.finalGrade || 0)}`}>
                          {enrollment.finalGrade ? `${enrollment.finalGrade.toFixed(1)}%` : '-'}
                        </span>
                        {enrollment.finalGrade && getGradeBadge(enrollment.finalGrade)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        disabled={enrollment.status !== 'active' || !enrollment.finalGrade || enrollment.finalGrade < 75}
                      >
                        <ArrowRight className="mr-1 h-4 w-4" />
                        Promover
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {enrollments.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              No hay estudiantes inscritos
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
