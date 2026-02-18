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
  const { courses, getCoursesByTeacher, getEnrollmentsByCourse, getAttendanceByCourse, enrollments, attendances } = useFormationSchoolStore();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [showQR, setShowQR] = useState<string | null>(null);
  
  useEffect(() => {
    if (userState?.id) {
      getCoursesByTeacher(userState.id);
    }
  }, [userState?.id]);
  
  const handleViewAttendance = async (courseId: string) => {
    setSelectedCourse(courseId);
    await getEnrollmentsByCourse(courseId);
    await getAttendanceByCourse(courseId);
  };

  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Panel del Maestro</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {course.levelId?.name || 'Curso'}
              </CardTitle>
              <Badge variant={course.qrExpiration && new Date(course.qrExpiration) > new Date() ? 'default' : 'secondary'}>
                {course.qrExpiration && new Date(course.qrExpiration) > new Date() ? 'QR Activo' : 'QR Inactivo'}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {course.scheduleId ? `${days[course.scheduleId.dayOfWeek]} ${course.scheduleId.startTime}-${course.scheduleId.endTime}` : 'Horario no definido'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {course.classroomId?.name || 'Salón no asignado'}
                </p>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowQR(course.id)}
                  >
                    <QrCode className="mr-2 h-4 w-4" />
                    Generar QR
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewAttendance(course.id)}
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
      
      {courses.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No tienes cursos asignados</p>
          </CardContent>
        </Card>
      )}
      
      {showQR && (
        <QRGenerator
          courseId={showQR}
          onClose={() => setShowQR(null)}
        />
      )}
      
      {selectedCourse && (
        <AttendanceList
          courseId={selectedCourse}
          enrollments={enrollments}
          attendances={attendances}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
};
