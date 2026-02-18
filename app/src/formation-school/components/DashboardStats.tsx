import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, GraduationCap, Clock } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, description }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);

interface DashboardStatsProps {
  totalStudents: number;
  activeCourses: number;
  assignedTeachers: number;
  averageAttendance: number;
  studentsByLevel: { levelName: string; count: number }[];
  studentsByCourseType: { type: string; count: number }[];
  attendanceByClass: { className: string; attendance: number }[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalStudents,
  activeCourses,
  assignedTeachers,
  averageAttendance,
  studentsByLevel,
  studentsByCourseType,
  attendanceByClass,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Estudiantes Inscritos"
          value={totalStudents}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="Total en el ciclo actual"
        />
        <StatCard
          title="Cursos Activos"
          value={activeCourses}
          icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
          description="Cursos disponibles"
        />
        <StatCard
          title="Maestros Asignados"
          value={assignedTeachers}
          icon={<GraduationCap className="h-4 w-4 text-muted-foreground" />}
          description="Maestros activos"
        />
        <StatCard
          title="Asistencia Promedio"
          value={`${averageAttendance}%`}
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          description="General del ciclo"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Estudiantes por Nivel</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={studentsByLevel} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Estudiantes por Tipo de Curso</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={studentsByCourseType} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Asistencia por Clase</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart data={attendanceByClass} />
        </CardContent>
      </Card>
    </div>
  );
};

interface BarChartProps {
  data: { levelName?: string; type?: string; className?: string; count?: number; attendance?: number }[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.count || d.attendance || 0), 1);
  
  if (data.length === 0) {
    return <p className="text-muted-foreground text-sm">No hay datos disponibles</p>;
  }

  return (
    <div className="flex items-end space-x-2 h-64">
      {data.map((item, index) => {
        const value = item.count || item.attendance || 0;
        const height = (value / maxValue) * 100;
        const label = item.levelName || item.type || item.className || '';
        
        return (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full flex items-end justify-center flex-1">
              <div
                className="w-full max-w-[40px] bg-primary rounded-t-md transition-all duration-300"
                style={{ height: `${height}%`, minHeight: value > 0 ? '4px' : '0' }}
                title={`${value}`}
              />
            </div>
            <span className="text-xs text-muted-foreground mt-2 text-center truncate w-full">
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

interface PieChartProps {
  data: { type?: string; levelName?: string; count?: number }[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + (item.count || 0), 0);
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  
  if (data.length === 0 || total === 0) {
    return <p className="text-muted-foreground text-sm">No hay datos disponibles</p>;
  }

  let cumulativeAngle = 0;
  
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <svg width="200" height="200" viewBox="0 0 42 42" className="transform -rotate-90">
          {data.map((item, index) => {
            const percentage = (item.count || 0) / total;
            const angle = percentage * 100;
            const startAngle = cumulativeAngle;
            cumulativeAngle += angle;
            
            const startX = 21 + 15 * Math.cos((2 * Math.PI * startAngle) / 100);
            const startY = 21 + 15 * Math.sin((2 * Math.PI * startAngle) / 100);
            const endX = 21 + 15 * Math.cos((2 * Math.PI * (startAngle + angle)) / 100);
            const endY = 21 + 15 * Math.sin((2 * Math.PI * (startAngle + angle)) / 100);
            
            const largeArcFlag = angle > 50 ? 1 : 0;
            
            const pathD = `M 21 21 L ${startX} ${startY} A 15 15 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
            
            return (
              <path
                key={index}
                d={pathD}
                fill={colors[index % colors.length]}
                stroke="#fff"
                strokeWidth="1"
              />
            );
          })}
          <circle cx="21" cy="21" r="10" fill="#fff" />
        </svg>
      </div>
      <div className="ml-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center text-sm">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-muted-foreground">
              {item.type || item.levelName}: {item.count || 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
