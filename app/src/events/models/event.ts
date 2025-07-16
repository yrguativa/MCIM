export interface Event {
    id: string;
    name: string;
    description: string;
    date: Date;
    endDate?: Date;
    location: string;
    capacity?: number;
    attendees?: string[]; // Array of disciple IDs
    createdAt: Date;
    updatedAt: Date;
}

export interface EventAttendance {
    id: string;
    eventId: string;
    discipleId: string;
    timestamp: Date;
}
