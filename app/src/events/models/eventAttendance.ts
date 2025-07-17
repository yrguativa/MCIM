import { Disciple } from "@/src/disciples/models/disciple";
import { Event } from "./event";

export interface EventAttendance {
    id?: string;
    eventId: string;
    event?: Event;
    discipleId: string;
    disciple?: Disciple;
    registrationDate: Date;
    attended: boolean;
    attendanceDate?: Date;
    notes?: string;
}
