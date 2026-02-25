import { Level } from './level';
import { Schedule } from './schedule';
import { Classroom } from './classroom';

export interface Course {
    id: string;
    levelId: string;
    level?: Level;
    teacherId?: string;
    teacher?: { id: string; name: string };
    classroomId?: string;
    classroom?: Classroom;
    scheduleId?: string;
    schedule?: Schedule;
    cycleId: string;
    type?: 'vision' | 'doctrina';
    requiredClasses?: number;
    qrCode?: string;
    qrExpiration?: Date;
    createdUser: string;
    createdDate: Date;
}
