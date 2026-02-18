import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DashboardStats } from '../components/DashboardStats';
import { useFormationSchoolStore } from '../store/formation-school.store';
import { useMinistryStore } from '@/src/ministries/store/ministries.store';
import { DisciplesService } from '@/src/disciples/services/disciples.services';
import TableComponent from '@/src/app/components/TableComponent';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

interface DiscipleInfo {
  id: string;
  name: string;
  lastName: string;
  ministryId: string;
}

interface StudentWithDisciple {
  id: string;
  discipleId: string;
  currentLevelId: string;
  status: 'active' | 'inactive';
  disciple?: DiscipleInfo;
  completedCourses: number;
  attendance: number;
  ministryName?: string;
}

export const FormationDashboard: React.FC = () => {
  const { 
    activeCycle, 
    getActiveCycle, 
    courses, 
    getCoursesByCycle,
    enrollments,
    getEnrollmentsByCourse,
    students,
    getStudents
  } = useFormationSchoolStore();
  
  const { ministries, getMinistries } = useMinistryStore();
  
  const [selectedCycleId, setSelectedCycleId] = useState<string>('');
  const [selectedMinistryId, setSelectedMinistryId] = useState<string>('all');
  const [disciples, setDisciples] = useState<DiscipleInfo[]>([]);
  const [cycles, setCycles] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    getActiveCycle();
    getMinistries();
    loadCycles();
    loadDisciples();
  }, []);

  useEffect(() => {
    if (activeCycle) {
      setSelectedCycleId(activeCycle.id);
      getCoursesByCycle(activeCycle.id);
    }
  }, [activeCycle]);

  useEffect(() => {
    if (selectedCycleId) {
      getCoursesByCycle(selectedCycleId);
      getStudents();
    }
  }, [selectedCycleId]);

  useEffect(() => {
    if (courses.length > 0) {
      courses.forEach(course => {
        getEnrollmentsByCourse(course.id);
      });
    }
  }, [courses]);

  const loadCycles = async () => {
    try {
      const data = await import('@/src/formation-school/services/formation-school.services').then(m => 
        m.FormationSchoolService.getCycles()
      );
      if (data?.cycles) {
        setCycles(data.cycles);
      }
    } catch (error) {
      console.error('Error loading cycles:', error);
    }
  };

  const loadDisciples = async () => {
    try {
      const data = await DisciplesService.getDisciples();
      setDisciples(data);
    } catch (error) {
      console.error('Error loading disciples:', error);
    }
  };

  const studentsWithDisciple: StudentWithDisciple[] = useMemo(() => {
    const allEnrollments = enrollments.flat();
    
    return students.map(student => {
      const disciple = disciples.find(d => d.id === student.discipleId);
      const studentEnrollments = allEnrollments.filter(e => e.studentId === student.id);
      const completedCourses = studentEnrollments.filter(e => e.status === 'completed').length;
      const attendedClasses = studentEnrollments.filter(e => e.status === 'active').length;
      const totalClasses = studentEnrollments.length;
      const attendance = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;
      
      const ministry = disciple?.ministryId 
        ? ministries.find(m => m.id === disciple.ministryId) 
        : null;
      
      return {
        ...student,
        disciple,
        completedCourses,
        attendance,
        ministryName: ministry?.name || 'Sin asignar'
      };
    });
  }, [students, disciples, enrollments, ministries]);

  const filteredStudents = useMemo(() => {
    return studentsWithDisciple.filter(student => {
      if (selectedMinistryId !== 'all' && student.disciple?.ministryId !== selectedMinistryId) {
        return false;
      }
      return true;
    });
  }, [studentsWithDisciple, selectedMinistryId]);

  const stats = useMemo(() => {
    const totalStudents = filteredStudents.length;
    const activeCourses = courses.length;
    const assignedTeachers = new Set(courses.map(c => c.teacherId).filter(Boolean)).size;
    
    const totalAttendance = filteredStudents.reduce((sum, s) => sum + s.attendance, 0);
    const averageAttendance = totalStudents > 0 ? Math.round(totalAttendance / totalStudents) : 0;

    const studentsByLevel: { levelName: string; count: number }[] = [];
    const levelCounts = new Map<string, number>();
    filteredStudents.forEach(student => {
      const levelName = student.currentLevelId || 'Sin nivel';
      levelCounts.set(levelName, (levelCounts.get(levelName) || 0) + 1);
    });
    levelCounts.forEach((count, levelName) => {
      studentsByLevel.push({ levelName, count });
    });

    const studentsByCourseType: { type: string; count: number }[] = [
      { type: 'Visión', count: filteredStudents.filter(s => s.completedCourses > 0).length },
      { type: 'Doctrina', count: filteredStudents.filter(s => s.attendance >= 75).length }
    ];

    const attendanceByClass: { className: string; attendance: number }[] = courses.map(course => {
      const courseEnrollments = enrollments.flat().filter(e => e.courseId === course.id);
      const attended = courseEnrollments.filter(e => e.status === 'active').length;
      const total = courseEnrollments.length;
      return {
        className: course.levelId || 'Curso',
        attendance: total > 0 ? Math.round((attended / total) * 100) : 0
      };
    });

    return {
      totalStudents,
      activeCourses,
      assignedTeachers,
      averageAttendance,
      studentsByLevel,
      studentsByCourseType,
      attendanceByClass
    };
  }, [filteredStudents, courses, enrollments]);

  const columns: ColumnDef<StudentWithDisciple>[] = useMemo(() => [
    {
      accessorKey: 'disciple',
      header: 'Nombre',
      cell: ({ row }) => {
        const disciple = row.original.disciple;
        return disciple ? `${disciple.name} ${disciple.lastName}` : 'Sin nombre';
      }
    },
    {
      accessorKey: 'currentLevelId',
      header: 'Nivel actual',
      cell: ({ row }) => row.original.currentLevelId || 'Sin asignar'
    },
    {
      accessorKey: 'completedCourses',
      header: 'Cursos completados',
      cell: ({ row }) => row.original.completedCourses
    },
    {
      accessorKey: 'attendance',
      header: 'Asistencia',
      cell: ({ row }) => (
        <span className={row.original.attendance >= 75 ? 'text-green-600' : row.original.attendance >= 50 ? 'text-yellow-600' : 'text-red-600'}>
          {row.original.attendance}%
        </span>
      )
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'active' ? 'default' : 'secondary'}>
          {row.original.status === 'active' ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    },
    {
      accessorKey: 'ministryName',
      header: 'Ministerio',
      cell: ({ row }) => row.original.ministryName
    }
  ], []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard - Escuela de Formación</h1>
      </div>

      <div className="flex gap-4">
        <Select value={selectedCycleId} onValueChange={setSelectedCycleId}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Selecciona un ciclo" />
          </SelectTrigger>
          <SelectContent>
            {cycles.map((cycle) => (
              <SelectItem key={cycle.id} value={cycle.id}>
                {cycle.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedMinistryId} onValueChange={setSelectedMinistryId}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Filtrar por ministerio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los ministerios</SelectItem>
            {ministries.map((ministry) => (
              <SelectItem key={ministry.id} value={ministry.id}>
                {ministry.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DashboardStats
        totalStudents={stats.totalStudents}
        activeCourses={stats.activeCourses}
        assignedTeachers={stats.assignedTeachers}
        averageAttendance={stats.averageAttendance}
        studentsByLevel={stats.studentsByLevel}
        studentsByCourseType={stats.studentsByCourseType}
        attendanceByClass={stats.attendanceByClass}
      />

      <Card>
        <CardHeader>
          <CardTitle>Estudiantes Inscritos</CardTitle>
        </CardHeader>
        <CardContent>
          <TableComponent
            columns={columns}
            data={filteredStudents}
            emptyMessage="No hay estudiantes inscritos en este ciclo"
          />
        </CardContent>
      </Card>
    </div>
  );
};
