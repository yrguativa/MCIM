import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Event } from "@/src/events/models/event";
import { eventService } from "@/src/events/services/event.services";
import { EventAttendance } from "@/src/events/models/eventAttendance";
import { LastOrCurrentEvent } from "../tools/event.tool";

interface EventState {
    event?: Event;
    eventSelected?: Event;
    events: Event[];
    attendances: EventAttendance[];

    // Event methods
    getEvent: (id: string) => Promise<void>;
    getEvents: () => Promise<void>;
    addEvent: (event: Event) => Promise<boolean>;
    updateEvent: (event: Event) => Promise<boolean>;

    // Attendance methods
    getEventAttendance: (eventId: string) => Promise<EventAttendance[]>;
    validateEventCapacity: (eventId: string) => Promise<boolean>;
}

const storeEvent: StateCreator<EventState> = (set, get) => ({
    event: undefined,
    eventSelected: undefined,
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
            if (lastOrCurrentEvent && (get().eventSelected === undefined || get().eventSelected?.id !== lastOrCurrentEvent.id)) {
                const lastEventInfo = await eventService.getEvent(lastOrCurrentEvent.id);
                set({ eventSelected: lastEventInfo });
            }
            else if (!lastOrCurrentEvent && events.length > 0 && (get().eventSelected === undefined ||
                get().eventSelected?.id !== events[events.length - 1].id)) {
                const lastEventInfo = await eventService.getEvent(events[events.length - 1].id);
                set({ eventSelected: lastEventInfo });
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
