import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Event } from "@/src/events/models/event";
import { eventService } from "@/src/events/services/event.services";
import { EventAttendance } from "@/src/events/models/eventAttendance";
import { LastOrCurrentEvent } from "../tools/event.tool";

interface EventState {
    event?: Event;
    lastEvent?: Event;
    events: Event[];
    attendances: EventAttendance[];
    isOpenModal: boolean;

    // Event methods
    getEvent: (id: string) => Promise<void>;
    getEvents: () => Promise<void>;
    addEvent: (event: Event) => Promise<boolean>;
    updateEvent: (event: Event) => Promise<boolean>;

    // Attendance methods
    registerAttendance: (attendance: Partial<EventAttendance>) => Promise<boolean>;
    getEventAttendance: (eventId: string) => Promise<EventAttendance[]>;
    validateEventCapacity: (eventId: string) => Promise<boolean>;

    // Modal methods  
    toggleModal: () => void;
}

const storeEvent: StateCreator<EventState> = (set, get) => ({
    event: undefined,
    lastEvent: undefined,
    events: [],
    attendances: [],
    isOpenModal: false,

    // Event methods implementation
    getEvent: async (id: string) => {
        const event = await eventService.getEvent(id);
        set({ event });
    },
    getEvents: async () => {
        const events = await eventService.getEvents();
        if (events) {
            set({ events: [...events] });
            const lastOrCurrentEvent = LastOrCurrentEvent(events);
            if (lastOrCurrentEvent && (get().lastEvent === undefined || get().lastEvent?.id !== lastOrCurrentEvent.id)) {
                const lastEventInfo = await eventService.getEvent(lastOrCurrentEvent.id);
                set({ lastEvent: lastEventInfo });
            }
            else if (!lastOrCurrentEvent && events.length > 0 && (get().lastEvent === undefined ||
                get().lastEvent?.id !== events[events.length - 1].id)) {
                const lastEventInfo = await eventService.getEvent(events[events.length - 1].id);
                set({ lastEvent: lastEventInfo });
            }
        }
    },
    addEvent: async (event: Event) => {
        const events = get().events;
        try {
            const eventId = await eventService.createEvent(event);
            set({ events: [...events, { ...event, id: eventId }] });
            return true;
        } catch (error) {
            console.error("Error in addEvent:", error);
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
            console.error("Error in updateEvent:", error);
            return false;
        }
    },

    // Attendance methods implementation
    registerAttendance: async (attendance: Partial<EventAttendance>) => {
        const attendances = get().attendances;
        try {
            const attendanceRegister = await eventService.registerAttendance(attendance);
            set({
                attendances: [...attendances, {
                    id: attendanceRegister.id,
                    eventId: attendance.eventId!,
                    discipleId: attendance.discipleId || '',
                    event: attendance.event,
                    disciple: attendance.disciple,
                    registrationDate: new Date(attendanceRegister.registrationDate),
                    attended: false,
                    attendanceDate: attendance.attendanceDate,
                    notes: attendance.notes || '',
                }],
                isOpenModal: true,
            });
            return true;
        } catch (error) {
            console.error("Error in registerAttendance:", error);
            return false;
        }
    },
    getEventAttendance: async (eventId: string) => {
        try {
            const eventAttendances = await eventService.getEventAttendance(eventId);
            set({ attendances: [...eventAttendances] });
            return eventAttendances;
        } catch (error) {
            console.error("Error in getEventAttendance:", error);
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
            console.error("Error in validateEventCapacity:", error);
            return false;
        }
    },

    // Modal methods implementation
    toggleModal: () => {
        const isOpen = get().isOpenModal;
        set({ isOpenModal: !isOpen })
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
