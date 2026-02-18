import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

interface AttendanceListProps {
  courseId: string;
  enrollments: Record<string, unknown>[];
  attendances: Record<string, unknown>[];
  onClose: () => void;
}

export const AttendanceList: React.FC<AttendanceListProps> = ({
  courseId,
  enrollments,
  attendances,
  onClose,
}) => {
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
                    {enrollment.studentId?.name} {enrollment.studentId?.lastName}
                  </TableCell>
                  <TableCell>
                    <Badge variant={enrollment.status === 'active' ? 'default' : 'secondary'}>
                      {enrollment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {enrollment.finalGrade ? `${enrollment.finalGrade.toFixed(1)}%` : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {attendedCount > 0 ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      {attendedCount} / {attendances.filter(a => a.courseClassId === courseId).length || 0}
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
