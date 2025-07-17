import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Event } from "../../events/models/event";
import { EventAttendance } from "../../events/models/eventAttendance";
import { EventsService } from "../../events/services/events.services";

export interface EventState {
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

    getEvents: async () => {
        try {
            const events = await EventsService.getEvents();
            set({ events });
        } catch (error) {
            console.error('Error getting events:', error);
            set({ events: [] });
        }
    },

    addEvent: async (event: Event) => {
        const events = get().events;
        try {
            const idEventInserted = await EventsService.addEvent(event);
            set({ events: [...events, { ...event, id: idEventInserted }] });
            return true;
        } catch (error) {
            console.error('Error adding event:', error);
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
            console.error('Error updating event:', error);
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
            console.error('Error deleting event:', error);
            return false;
        }
    },

    registerAttendance: async (attendance: EventAttendance) => {
        const attendances = get().attendances;
        try {
            const canAttend = await get().validateEventCapacity(attendance.eventId);
            if (!canAttend) {
                throw new Error("El evento ha alcanzado su capacidad máxima");
            }

            const idAttendanceInserted = await EventsService.registerAttendance(attendance);
            set({ 
                attendances: [...attendances, { ...attendance, id: idAttendanceInserted }] 
            });
            return true;
        } catch (error) {
            console.error('Error registering attendance:', error);
            return false;
        }
    },

    getEventAttendance: async (eventId: string) => {
        try {
            const eventAttendances = await EventsService.getEventAttendance(eventId);
            set({ attendances: eventAttendances });
            return eventAttendances;
        } catch (error) {
            console.error('Error getting event attendance:', error);
            return [];
        }
    },

    validateEventCapacity: async (eventId: string) => {
        try {
            const event = get().events.find(e => e.id === eventId);
            if (!event || !event.capacity) return true;

            const attendances = await get().getEventAttendance(eventId);
            return attendances.length < event.capacity;
        } catch (error) {
            console.error('Error validating event capacity:', error);
            return false;
        }
    },

    getAttendanceByDisciple: async (discipleId: string) => {
        try {
            const attendances = await EventsService.getAttendanceByDisciple(discipleId);
            return attendances;
        } catch (error) {
            console.error('Error getting disciple attendance:', error);
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
