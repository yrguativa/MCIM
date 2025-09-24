import { Event, EventAttendance } from '../models/event';
import { addMinutes } from 'date-fns';

export const LastOrCurrentEvent = (event: Event[]): Event | undefined => {
    if (event.length === 0) return undefined;
    const currentDate = new Date();
    const lastEvents = event.filter(e => new Date(e.date).getTime() <= currentDate.getTime());
    const sortedEvents = lastEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (sortedEvents.length === 0) {
        // get events of today
        const todayEvents = event.filter(e => new Date(e.date).toDateString() === currentDate.toDateString());

        if (todayEvents.length > 0) {
            const sortedTodayEvents = todayEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            return sortedTodayEvents[0];
        }
    };

    return sortedEvents[0];
}

// function get intervals giving a minimum value between 2 dates
export const Intervals = (start: Date, end: Date, minValue: number): { start: Date; end: Date; }[] => {
    const intervals: {
        start: Date;
        end: Date;
    }[] = [];
    const diff = end.getTime() - start.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hoursDiff = Math.floor(minutes / 60);

    let currentInterval = start;
    let numberOfIntervals = minValue;
    let addByMinutes = 15;
    if (hoursDiff < 2) {
        currentInterval = new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours(), 0)
    }
    if (hoursDiff > 2) {
        numberOfIntervals = (hoursDiff * 60) / 30;
        addByMinutes = 30;
    }
    if (hoursDiff > 10) {
        numberOfIntervals = hoursDiff;
        addByMinutes = 60;
    }
    if (hoursDiff > 48) {
        numberOfIntervals = hoursDiff / 6;
        addByMinutes = 6 * 60;
    }

    for (let i = 0; i < numberOfIntervals; i++) {
        const interval: Date = addMinutes(currentInterval, addByMinutes);
        intervals.push({
            start: currentInterval,
            end: interval,

        });
        currentInterval = interval;
    }

    return intervals;
}

// function to get intervals with events from events  parameter
export const IntervalsWithEvents = (eventsRegistrations: EventAttendance[], minValue: number = 4): { start: Date; end: Date; registers: EventAttendance[] }[] => {
    if (eventsRegistrations.length === 0) return [];

    const attendancesSort = eventsRegistrations.sort((a, b) => new Date(a.dateRegister).getTime() - new Date(b.dateRegister).getTime());
    const start = new Date(attendancesSort[0].dateRegister);
    const end = new Date(attendancesSort[attendancesSort.length - 1].dateRegister);
    const eventIntervals = Intervals(start, end, minValue);
    const intervals: { start: Date; end: Date; registers: EventAttendance[] }[] = [];

    // get events by each interval
    for (let j = 0; j < eventIntervals.length; j++) {
        const interval = eventIntervals[j];
        const eventsInInterval = eventsRegistrations.filter(e => {
            const eventDate = new Date(e.dateRegister);
            return eventDate.getTime() >= interval.start.getTime() && eventDate.getTime() < interval.end.getTime();
        });

        intervals.push({
            start: interval.start,
            end: interval.end,
            registers: eventsInInterval
        });

    }

    return intervals;
}
