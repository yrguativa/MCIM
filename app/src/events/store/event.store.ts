import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Event } from "@/src/events/models/event";
import { eventService } from "@/src/events/services/event.service";
import { EventAttendance } from "@/src/events/models/eventAttendance";

interface EventState {
    event?: Event;
    events: Event[];
    attendances: EventAttendance[];

    // Event methods
    getEvent: (id: string) => Promise<void>;
    getEvents: () => Promise<void>;
    addEvent: (event: Event) => Promise<boolean>;
    updateEvent: (event: Event) => Promise<boolean>;

    // Attendance methods
    registerAttendance: (attendance: EventAttendance) => Promise<boolean>;
    getEventAttendance: (eventId: string) => Promise<EventAttendance[]>;
    validateEventCapacity: (eventId: string) => Promise<boolean>;
}

const storeEvent: StateCreator<EventState> = (set, get) => ({
    event: undefined,
    events: [],
    attendances: [],

    // Event methods implementation
    getEvent: async (id: string) => {
        const event = await eventService.getEvent(id);
        console.log("🚀 ~ storeEvent ~ event:", event)
        set({ event });
    },
    getEvents: async () => {
        const events = await eventService.getEvents();
        set({ events });
    },
    addEvent: async (event: Event) => {
        const events = get().events;
        try {
            const eventId = await eventService.createEvent(event);
            set({ events: [...events, { ...event, id: eventId }] });
            return true;
        } catch (error) {
            return false;
        }
    },
    updateEvent: async (event: Event) => {
        const events = get().events;
        try {
            await eventService.updateEvent(event);
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

    // Attendance methods implementation
    registerAttendance: async (attendance: EventAttendance) => {
        const attendances = get().attendances;
        try {
            // Primero validamos la capacidad
            const canAttend = await get().validateEventCapacity(attendance.eventId);
            if (!canAttend) {
                throw new Error("El evento ha alcanzado su capacidad máxima");
            }

            const attendanceId = await eventService.registerAttendance(attendance);
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
            const eventAttendances = await eventService.getEventAttendance(eventId);
            set({ attendances: [...eventAttendances] });
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
