export interface Event {
    id: string;
    name: string;
    description: string;
    date: Date;
    endDate?: Date;
    location: string;
    capacity?: number;
    attendees?: EventAttendance[]; 
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
}

export interface EventAttendance{
    id: string;
    disciple: string;
    discipleId: string;
    dateRegister: Date;
}
