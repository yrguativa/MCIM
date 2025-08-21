import { useEffect, useState } from "react";
import { useEventStore } from "../store/event.store";
import { addDays, isSameDay, startOfWeek } from "date-fns";

export const useWeeklyCalendarHook = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const events = useEventStore(state => state.events);
    const lastEvent = useEventStore(state => state.lastEvent);
    const getEventsState = useEventStore(state => state.getEvents);

    useEffect(() => {
        getEventsState();
    }, []);

    if (events && events.length > 0 && new Date(events[0].date).toDateString() != currentDate.toDateString()) {
        setCurrentDate(new Date(events[0].date));
    }

    // Get the start of the current week
    const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });

    // Create array with the days of the week
    const weekDays = [...Array(7)].map((_, index) => {
        const day = addDays(startOfCurrentWeek, index);
        const dayEvents = events.filter(event =>
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
        weekDays
    };
}