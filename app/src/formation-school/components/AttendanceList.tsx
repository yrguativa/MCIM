import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

interface StudentInfo {
  id: string;
  name?: string;
  lastName?: string;
}

interface EnrollmentWithStudent {
  id: string;
  studentId: StudentInfo | string;
  status: string;
  finalGrade?: number;
  courseId?: string;
}

interface AttendanceInfo {
  id: string;
  studentEnrollmentId: string;
  courseId: string;
  attended: boolean;
}

interface AttendanceListProps {
  courseId: string;
  enrollments: EnrollmentWithStudent[];
  attendances: AttendanceInfo[];
  onClose: () => void;
}

export const AttendanceList: React.FC<AttendanceListProps> = ({
  courseId,
  enrollments,
  attendances,
  onClose,
}) => {
  const getStudentName = (studentId: StudentInfo | string): string => {
    if (typeof studentId === 'object' && studentId !== null) {
      return `${studentId.name || ''} ${studentId.lastName || ''}`.trim();
    }
    return 'Estudiante';
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Lista de Asistencia</DialogTitle>
        </DialogHeader>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Estudiante</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Nota</TableHead>
              <TableHead>Asistencias</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrollments.map((enrollment) => {
              const studentAttendance = attendances.filter(
                a => a.studentEnrollmentId === enrollment.id
              );
              const attendedCount = studentAttendance.filter(a => a.attended).length;
              
              return (
                <TableRow key={enrollment.id}>
                  <TableCell className="font-medium">
                    {getStudentName(enrollment.studentId)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={enrollment.status === 'active' ? 'default' : 'secondary'}>
                      {enrollment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {enrollment.finalGrade !== undefined ? `${enrollment.finalGrade.toFixed(1)}%` : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {attendedCount > 0 ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      {attendedCount} / {attendances.filter(a => a.courseId === courseId).length || 0}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {enrollments.length === 0 && (
          <p className="text-center text-muted-foreground py-4">
            No hay estudiantes inscritos en esta clase
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};
