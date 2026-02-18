export interface Course {
    id: string;
    levelId: string;
    teacherId: string;
    classroomId: string;
    scheduleId: string;
    cycleId: string;
    qrCode?: string;
    qrExpiration?: Date;
    createdUser: string;
    createdDate: Date;
}
