import { Event } from '../models/event';

export const LastOrCurrentEvent = (event: Event[]) => {
    if (event.length === 0) return undefined;
    const currentDate = new Date();
    const lastEvents = event.filter(e => new Date(e.date).getTime() <= currentDate.getTime());
    const sortedEvents = lastEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (sortedEvents.length === 0){
        // get events of today
        const todayEvents = event.filter(e => new Date(e.date).toDateString() === currentDate.toDateString());

        if (todayEvents.length > 0) {   
            const sortedTodayEvents = todayEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            return sortedTodayEvents[0];
        }
    };
    
    return sortedEvents[0];
}