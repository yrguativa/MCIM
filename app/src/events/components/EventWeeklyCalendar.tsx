import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import { Separator } from "@/components/ui/separator"
import { Button } from '@/components/ui/button';
import { DonutChartFillableHalf } from '@/components/chart/DonutChartFillableHalf';
import { format } from 'date-fns';
import { Event } from '../models/event';
import { useTranslation } from 'react-i18next';
import { es, enUS } from 'date-fns/locale';
import { eventService } from '../services/event.services';

interface EventWeeklyCalendarProps {
    event: Event;
}

export const EventWeeklyCalendar: React.FC<EventWeeklyCalendarProps> = ({ event }) => {

    const { t, i18n } = useTranslation();
    const esLocale = i18n.language === 'es' ? es : enUS;

    const [open, setOpen] = useState(false);
    const [percent, setPercent] = useState(0);

    const openSheet = async () => {
        const eventInfo = await eventService.getEvent(event.id);
        let percentAttendance = 0;

        const capacity = event.capacity || 0;
        if (capacity === 0 && eventInfo.attendees && eventInfo.attendees?.length > 0) {
            percentAttendance = 100;
        }
        else if (capacity > 0) {
            const attendees = eventInfo.attendees?.length || 0;
            percentAttendance = Math.floor(attendees * 100 / capacity);
        }

        if (percentAttendance > 100) {
            percentAttendance = 100;
        }

        if (percentAttendance != percent) {
            setPercent(percentAttendance);
        }

        setOpen(true);
    };

    return (
        <Sheet>
            <SheetTrigger className="p-2 bg-primary/10 rounded-md text-sm" onClick={openSheet}>
                <div className="font-medium">{event.name}</div>
                <div className="text-xs text-gray-500">
                    {format(new Date(event.date), 'HH:mm')}
                </div>
                <div className="text-xs truncate">
                    {event.location}
                </div>
            </SheetTrigger>
            <SheetContent >
                <SheetHeader>
                    <SheetTitle>{event.name}</SheetTitle>
                    <SheetDescription>
                        {event.description}
                    </SheetDescription>
                </SheetHeader>
                <span className="block mb-2 mt-6">
                    {t('events.dateStart')}: {format(new Date(event.date), 'dd MMM yyyy', { locale: esLocale })}
                </span>
                <span className="block mb-2">
                    {t('events.time')}: {format(new Date(event.date), 'HH:mm', { locale: esLocale })}
                </span>
                <span className="block mb-2">
                    {t('events.dateEnd')}: {event.endDate ? format(new Date(event.endDate), 'dd/MM/yyyy') : ""}
                </span>
                <span className="block mb-2">
                    {t('events.location')}: {event.location}
                </span>
                <span className="block mb-2">
                    {t('events.capacity')}: {event.capacity || 'Sin límite'}
                </span>
                <span className="block mb-2">
                    {t('events.assistance')}:
                </span>
                {open && (<span className="block mb-2">
                    <DonutChartFillableHalf name={t('events.assistance')} value={percent} />
                </span>)}
                <Separator />
                <span className="block mb-2 mt-4">
                    {t('events.organizer')}: {event.createdBy || t('events.notOrganizer')}
                </span>
                <span className="block mb-2">
                    {t('events.createdBy')}: {format(new Date(event.createdAt), 'dd/MM/yyyy')}
                </span>
                <SheetFooter>
                    <Button >
                        <NavLink to={`/public/eventPage/${event.id}`} target="_blank" rel="noopener noreferrer">{t('events.viewEventPage')}</NavLink>
                    </Button>
                    <SheetClose asChild>
                        <Button variant="outline">{t('events.close')}</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}