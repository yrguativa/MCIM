import { useEffect, useState } from "react";
import { useEventStore } from "../store/event.store";
import { addDays, addWeeks, isSameDay, startOfWeek, subWeeks } from "date-fns";

export const useWeeklyCalendarHook = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const events = useEventStore(state => state.events);
    const lastEvent = useEventStore(state => state.lastEvent);
    const getEventsState = useEventStore(state => state.getEvents);

    const nextWeek = () => {
        setCurrentDate(prev => addWeeks(prev, 1));
    };

    const previousWeek = () => {
        setCurrentDate(prev => subWeeks(prev, 1));
    };

    useEffect(() => {
        getEventsState();
    }, [currentDate]); // Recargar eventos cuando cambie la fecha

    // Get the start and end of the current week
    const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
    const endOfCurrentWeek = addDays(startOfCurrentWeek, 6);

    // Filter events for the current week range
    const currentWeekEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= startOfCurrentWeek && eventDate <= endOfCurrentWeek;
    });

    // Create array with the days of the week
    const weekDays = [...Array(7)].map((_, index) => {
        const day = addDays(startOfCurrentWeek, index);
        const dayEvents = currentWeekEvents.filter(event =>
            isSameDay(new Date(event.date), day)
        );
        return {
            date: day,
            events: dayEvents,
        };
    });
    
    return {
        events,
        lastEvent,
        weekDays,
        nextWeek,
        previousWeek,
        currentDate
    };
}