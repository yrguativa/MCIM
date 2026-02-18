import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QrCode, Camera, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useFormationSchoolStore } from '../store/formation-school.store';
import { useAuthStore } from '@/src/app/stores';
import { toast } from 'sonner';

interface StudentWithDetails {
  id: string;
  name?: string;
  lastName?: string;
  identification?: string;
}

type StudentIdType = string | StudentWithDetails;

interface EnrollmentWithStudent {
  id: string;
  studentId: StudentIdType;
  courseClassId: string;
  enrollmentDate: Date;
  status: 'active' | 'completed' | 'withdrawn';
  finalGrade?: number;
  createdUser: string;
  createdDate: Date;
}

const getStudentId = (studentId: StudentIdType): string => {
  return typeof studentId === 'string' ? studentId : studentId.id;
};

const getStudentName = (studentId: StudentIdType): string => {
  if (typeof studentId === 'string') return studentId;
  return `${studentId.name || ''} ${studentId.lastName || ''}`.trim();
};

export const ScanAttendance: React.FC = () => {
  const [searchParams] = useSearchParams();
  const userState = useAuthStore(state => state.user);
  const { createAttendance, getEnrollmentsByCourse, enrollments, getAttendanceByCourse, attendances } = useFormationSchoolStore();
  
  const [scanResult, setScanResult] = useState<'success' | 'error' | 'expired' | null>(null);
  const [lastStudent, setLastStudent] = useState<string | null>(null);
  const [mode, setMode] = useState<'manual' | 'scan'>('manual');
  
  const courseId = searchParams.get('courseId');
  
  useEffect(() => {
    if (courseId) {
      getEnrollmentsByCourse(courseId);
      getAttendanceByCourse(courseId);
    }
  }, [courseId]);
  
  const handleManualAttendance = async (studentId: string) => {
    if (!courseId) {
      toast.error('No se ha proporcionado el ID del curso');
      return;
    }
    
    const enrollment = enrollments.find(e => getStudentId(e.studentId) === studentId);
    
    if (!enrollment) {
      toast.error('El estudiante no está inscrito en este curso');
      setScanResult('error');
      setLastStudent(studentId);
      return;
    }
    
    const existingAttendance = attendances.find(
      a => a.studentEnrollmentId === enrollment.id && a.courseClassId === courseId
    );
    
    if (existingAttendance) {
      toast.warning('El estudiante ya tiene asistencia registrada');
      setScanResult('error');
      return;
    }
    
    try {
      await createAttendance({
        studentEnrollmentId: enrollment.id,
        courseClassId: courseId,
        attended: true,
        attendanceDate: new Date(),
        createdUser: userState?.id || '',
        createdDate: new Date(),
      });
      
      const studentName = getStudentName(enrollment.studentId);
      setScanResult('success');
      setLastStudent(studentName);
      toast.success(`Asistencia registrada para ${studentName}`);
      
      await getAttendanceByCourse(courseId);
    } catch {
      setScanResult('error');
      toast.error('Error al registrar asistencia');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Registro de Asistencia</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {mode === 'scan' ? <Camera className="h-5 w-5" /> : <QrCode className="h-5 w-5" />}
              {mode === 'scan' ? 'Escanear QR' : 'Registro Manual'}
            </CardTitle>
            <CardDescription>
              {mode === 'scan' 
                ? 'Escanea el código QR del estudiante'
                : 'Ingresa la identificación del estudiante'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Button 
                variant={mode === 'manual' ? 'default' : 'outline'} 
                onClick={() => setMode('manual')}
              >
                Manual
              </Button>
              <Button 
                variant={mode === 'scan' ? 'default' : 'outline'} 
                onClick={() => setMode('scan')}
              >
                Escanear
              </Button>
            </div>
            
            {mode === 'manual' && (
              <ManualAttendanceForm 
                onSubmit={handleManualAttendance}
                enrollments={enrollments as EnrollmentWithStudent[]}
              />
            )}
            
            {mode === 'scan' && (
              <div className="text-center py-8">
                <Camera className="mx-auto h-16 w-16 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  Use la cámara del dispositivo para escanear
                </p>
                <p className="text-sm text-muted-foreground">
                  Para probar, usa el modo manual
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Estado del Registro</CardTitle>
          </CardHeader>
          <CardContent>
            {scanResult === 'success' && (
              <div className="flex flex-col items-center justify-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <p className="mt-4 text-lg font-medium">Asistencia Registrada</p>
                {lastStudent && (
                  <p className="text-muted-foreground">{lastStudent}</p>
                )}
              </div>
            )}
            
            {scanResult === 'error' && (
              <div className="flex flex-col items-center justify-center py-8">
                <XCircle className="h-16 w-16 text-red-500" />
                <p className="mt-4 text-lg font-medium">Error en el Registro</p>
                {lastStudent && (
                  <p className="text-muted-foreground">{lastStudent}</p>
                )}
              </div>
            )}
            
            {scanResult === 'expired' && (
              <div className="flex flex-col items-center justify-center py-8">
                <AlertCircle className="h-16 w-16 text-yellow-500" />
                <p className="mt-4 text-lg font-medium">Código Expirado</p>
                <p className="text-muted-foreground">Solicita un nuevo código QR</p>
              </div>
            )}
            
            {!scanResult && (
              <div className="flex flex-col items-center justify-center py-8">
                <QrCode className="h-16 w-16 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  Esperando registro...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Asistencias del Día</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {attendances.map((attendance) => {
              const enrollment = enrollments.find(e => e.id === attendance.studentEnrollmentId) as EnrollmentWithStudent | undefined;
              return (
                <div 
                  key={attendance.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted"
                >
                  <span>
                    {enrollment ? getStudentName(enrollment.studentId) : 'Desconocido'}
                  </span>
                  {attendance.attended ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              );
            })}
            {attendances.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No hay asistencia registrada
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface ManualAttendanceFormProps {
  onSubmit: (studentId: string) => void;
  enrollments: EnrollmentWithStudent[];
}

const ManualAttendanceForm: React.FC<ManualAttendanceFormProps> = ({ onSubmit, enrollments }) => {
  const [identification, setIdentification] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enrollment = enrollments.find(
      e => {
        const sid = e.studentId;
        const student = typeof sid === 'string' ? null : sid;
        return student?.identification === identification || student?.id === identification;
      }
    );
    
    if (enrollment) {
      onSubmit(getStudentId(enrollment.studentId));
      setIdentification('');
    } else {
      toast.error('Estudiante no encontrado');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Ingresa la identificación"
          value={identification}
          onChange={(e) => setIdentification(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full">
        Registrar Asistencia
      </Button>
    </form>
  );
};
