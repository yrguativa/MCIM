import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, Users, Eye } from 'lucide-react';
import { useFormationSchoolStore } from '../store/formation-school.store';
import { useAuthStore } from '@/src/app/stores';
import { QRGenerator } from './QRGenerator';
import { AttendanceList } from './AttendanceList';

export const TeacherDashboard: React.FC = () => {
  const userState = useAuthStore(state => state.user);
  const { courseClasses, getCourseClassesByTeacher, getEnrollmentsByCourseClass, enrollments, getAttendanceByCourseClass, attendances } = useFormationSchoolStore();
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [showQR, setShowQR] = useState<string | null>(null);
  
  useEffect(() => {
    if (userState?.id) {
      getCourseClassesByTeacher(userState.id);
    }
  }, [userState?.id]);
  
  const handleViewAttendance = async (classId: string) => {
    setSelectedClass(classId);
    await getEnrollmentsByCourseClass(classId);
    await getAttendanceByCourseClass(classId);
  };

  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Panel del Maestro</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courseClasses.map((courseClass) => (
          <Card key={courseClass.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {courseClass.levelId?.name || 'Clase'}
              </CardTitle>
              <Badge variant={courseClass.qrExpiration && new Date(courseClass.qrExpiration) > new Date() ? 'default' : 'secondary'}>
                {courseClass.qrExpiration && new Date(courseClass.qrExpiration) > new Date() ? 'QR Activo' : 'QR Inactivo'}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {courseClass.scheduleId ? `${days[courseClass.scheduleId.dayOfWeek]} ${courseClass.scheduleId.startTime}-${courseClass.scheduleId.endTime}` : 'Horario no definido'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {courseClass.classroomId?.name || 'Salón no asignado'}
                </p>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowQR(courseClass.id)}
                  >
                    <QrCode className="mr-2 h-4 w-4" />
                    Generar QR
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewAttendance(courseClass.id)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Ver
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {courseClasses.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No tienes clases asignadas</p>
          </CardContent>
        </Card>
      )}
      
      {showQR && (
        <QRGenerator
          courseClassId={showQR}
          onClose={() => setShowQR(null)}
        />
      )}
      
      {selectedClass && (
        <AttendanceList
          courseClassId={selectedClass}
          enrollments={enrollments}
          attendances={attendances}
          onClose={() => setSelectedClass(null)}
        />
      )}
    </div>
  );
};
