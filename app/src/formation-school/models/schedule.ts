export interface Schedule {
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    courseId?: string;
    createdUser: string;
    createdDate: Date;
}
