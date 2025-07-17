import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Event } from "@/src/events/models/event";
import { EventAttendance } from "@/src/events/models/eventAttendance";
import { EventsService } from "@/src/events/services/events.services";

interface EventState {
    events: Event[];
    attendances: EventAttendance[];
    
    // Event methods
    getEvents: () => Promise<void>;
    addEvent: (event: Event) => Promise<boolean>;
    updateEvent: (event: Event) => Promise<boolean>;
    deleteEvent: (eventId: string) => Promise<boolean>;
    
    // Attendance methods
    registerAttendance: (attendance: EventAttendance) => Promise<boolean>;
    getEventAttendance: (eventId: string) => Promise<EventAttendance[]>;
    validateEventCapacity: (eventId: string) => Promise<boolean>;
    getAttendanceByDisciple: (discipleId: string) => Promise<EventAttendance[]>;
}

const storeEvent: StateCreator<EventState> = (set, get) => ({
    events: [],
    attendances: [],

    // Event methods implementation
    getEvents: async () => {
        const events = await EventsService.getEvents();
        set({ events });
    },

    addEvent: async (event: Event) => {
        const events = get().events;
        try {
            const eventId = await EventsService.addEvent(event);
            set({ events: [...events, { ...event, id: eventId }] });
            return true;
        } catch (error) {
            return false;
        }
    },

    updateEvent: async (event: Event) => {
        const events = get().events;
        try {
            await EventsService.updateEvent(event);
            set({ 
                events: events.map(e => 
                    e.id === event.id ? { ...event } : e
                ) 
            });
            return true;
        } catch (error) {
            return false;
        }
    },

    deleteEvent: async (eventId: string) => {
        const events = get().events;
        try {
            await EventsService.deleteEvent(eventId);
            set({ events: events.filter(e => e.id !== eventId) });
            return true;
        } catch (error) {
            return false;
        }
    },

    // Attendance methods implementation
    registerAttendance: async (attendance: EventAttendance) => {
        const attendances = get().attendances;
        try {
            // Primero validamos la capacidad
            const canAttend = await get().validateEventCapacity(attendance.eventId);
            if (!canAttend) {
                throw new Error("El evento ha alcanzado su capacidad máxima");
            }

            const attendanceId = await EventsService.registerAttendance(attendance);
            set({ 
                attendances: [...attendances, { ...attendance, id: attendanceId }] 
            });
            return true;
        } catch (error) {
            return false;
        }
    },

    getEventAttendance: async (eventId: string) => {
        try {
            const eventAttendances = await EventsService.getEventAttendance(eventId);
            set({ attendances: eventAttendances });
            return eventAttendances;
        } catch (error) {
            return [];
        }
    },

    validateEventCapacity: async (eventId: string) => {
        try {
            const event = get().events.find(e => e.id === eventId);
            if (!event || !event.capacity) return true; // Si no hay límite de capacidad

            const attendances = await get().getEventAttendance(eventId);
            return attendances.length < event.capacity;
        } catch (error) {
            return false;
        }
    },

    getAttendanceByDisciple: async (discipleId: string) => {
        try {
            const attendances = await EventsService.getAttendanceByDisciple(discipleId);
            return attendances;
        } catch (error) {
            return [];
        }
    },
});

export const useEventStore = create<EventState>()(
    devtools(
        persist(
            storeEvent,
            {
                name: 'event-storage',
            }
        ),
    )
);
