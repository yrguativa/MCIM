import React from 'react';
import { Badge } from '@/components/ui/badge';
import { StudentCourseHistory } from '../models/studentCourseHistory';
import { Level } from '../models/level';
import { BookOpen, CheckCircle, Clock, XCircle } from 'lucide-react';

interface StudentHistoryProps {
  histories: StudentCourseHistory[];
  levels: Level[];
}

export const StudentHistory: React.FC<StudentHistoryProps> = ({ histories, levels }) => {
  const getStatusBadge = (status: StudentCourseHistory['status']) => {
    switch (status) {
      case 'in_progress':
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            En Proceso
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="default" className="gap-1 bg-green-500">
            <CheckCircle className="h-3 w-3" />
            Completado
          </Badge>
        );
      case 'withdrawn':
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Abandonado
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getLevelName = (levelId: string) => {
    const level = levels.find(l => l.id === levelId);
    return level?.name || 'Nivel desconocido';
  };

  const getGradeColor = (grade?: number) => {
    if (!grade) return 'text-muted-foreground';
    if (grade >= 75) return 'text-green-500';
    if (grade >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (histories.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <BookOpen className="mx-auto h-8 w-8 mb-2 opacity-50" />
        <p>No hay historial de cursos</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {histories.map((history) => (
        <div
          key={history.id}
          className="flex items-center justify-between p-3 bg-background rounded-lg border"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {getLevelName(history.courseId as unknown as string)}
              </span>
              {getStatusBadge(history.status)}
            </div>
            <div className="text-sm text-muted-foreground">
              <span>Inscripción: </span>
              {new Date(history.enrollmentDate).toLocaleDateString()}
              {history.completionDate && (
                <>
                  <span> | Promoción: </span>
                  {new Date(history.completionDate).toLocaleDateString()}
                </>
              )}
            </div>
          </div>
          <div className="text-right">
            {history.finalGrade !== undefined && (
              <div className={`font-bold text-lg ${getGradeColor(history.finalGrade)}`}>
                {history.finalGrade.toFixed(1)}%
              </div>
            )}
            {history.promotedToNextLevel && (
              <Badge variant="outline" className="mt-1">
                Promovido
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
