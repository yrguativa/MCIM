export interface Schedule {
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    levelId: string;
    createdUser: string;
    createdDate: Date;
}
