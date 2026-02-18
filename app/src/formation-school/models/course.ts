export interface Course {
    id: string;
    levelId: string;
    teacherId: string;
    classroomId: string;
    scheduleId: string;
    cycleId: string;
    type?: 'vision' | 'doctrina';
    requiredClasses?: number;
    qrCode?: string;
    qrExpiration?: Date;
    createdUser: string;
    createdDate: Date;
}
