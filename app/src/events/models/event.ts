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
    createdBy: string; // User ID of the creator
    updatedAt: Date;
}