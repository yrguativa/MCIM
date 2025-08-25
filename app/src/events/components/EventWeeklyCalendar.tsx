import React from 'react';
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

interface EventWeeklyCalendarProps {
    event: Event;
}

export const EventWeeklyCalendar: React.FC<EventWeeklyCalendarProps> = ({ event }) => {
    const { t } = useTranslation();
    return (
        <Sheet>
            <SheetTrigger className="p-2 bg-primary/10 rounded-md text-sm">
                <div className="font-medium">{event.name}</div>
                <div className="text-xs text-gray-500">
                    {format(new Date(event.date), 'HH:mm')}
                </div>
                <div className="text-xs truncate">
                    {event.location}
                </div>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{event.name}</SheetTitle>
                    <SheetDescription>
                        {event.description}
                    </SheetDescription>
                </SheetHeader>
                <span className="block mb-2 mt-6">
                    {t('events.dateStart')}: {format(new Date(event.date), 'dd/MM/yyyy')}
                </span>
                <span className="block mb-2">
                    {t('events.time')}: {format(new Date(event.date), 'HH:mm')}
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
                <span className="block mb-2">
                    <DonutChartFillableHalf name={t('events.assistance')} value={20} />
                </span>
                <Separator />
                <span className="block mb-2 mt-4">
                    {t('events.organizer')}: {event.createdBy || t('events.notOrganizer')}
                </span>
                <span className="block mb-2">
                    {t('events.createdBy')}: {format(new Date(event.createdAt), 'dd/MM/yyyy')}
                </span>
                <SheetFooter>
                    <Button >
                        <NavLink to={`/registerInEvent/${event.id}`} target="_blank" rel="noopener noreferrer">{t('events.viewEventPage')}</NavLink>
                    </Button>
                    <SheetClose asChild>
                        <Button variant="outline">{t('events.close')}</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}