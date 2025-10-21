import React, { } from 'react';
import { NavLink } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { CalendarPlus, Info, QrCode } from 'lucide-react';
import { EventWeeklyCalendar } from '../components/EventWeeklyCalendar';
import { useWeeklyCalendarHook } from '../hooks/weeklyCalendarHook';
import LastEvent from '../components/LastEvent';
import { useTranslation } from 'react-i18next';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { QRCodeSVG } from 'qrcode.react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const WeeklyCalendar: React.FC = () => {
    const { t, i18n } = useTranslation();
    const esLocale = i18n.language === 'es' ? es : enUS;

    const { weekDays, lastEvent } = useWeeklyCalendarHook();
    const urlPageRegister = window.location.origin + (import.meta.env.VITE_BASE && import.meta.env.VITE_BASE !== '' ? '/' + import.meta.env.VITE_BASE : "") + '/public/registerInEvent';
    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">

                <h1 className="text-2xl font-bold">
                    {t('events.eventCalendar')}
                    <TooltipProvider>
                        <Popover>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <PopoverTrigger className=" ml-2">
                                        <Info />
                                    </PopoverTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('events.messageRegisterInEventTooltip')}</p>
                                </TooltipContent>
                            </Tooltip>
                            <PopoverContent className='min-w-md'>
                                <p>
                                    {t('events.messageRegisterInEvent')}
                                    <NavLink to={urlPageRegister} target="_blank" rel="noopener noreferrer">
                                        {t('events.linkEvetnRegister')}
                                    </NavLink>
                                </p>
                                <QRCodeSVG
                                    value={urlPageRegister}
                                    size={400}
                                    level="H"
                                    includeMargin={true}
                                />
                            </PopoverContent>
                        </Popover>
                    </TooltipProvider>
                </h1>

                <div className="flex gap-2">
                    <Button
                        asChild
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <NavLink to="/events/scan">
                            <QrCode className="h-5 w-5" />
                            {t('events.scanQR')}
                        </NavLink>
                    </Button>
                    <Button
                        asChild
                        className="flex items-center gap-2"
                    >
                        <NavLink to="/events/create">
                            <CalendarPlus className="h-5 w-5" />
                            {t('events.create')}
                        </NavLink>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-4">
                {weekDays.map(({ date, events }) => (
                    <Card key={date.toISOString()} className="p-2">
                        <div className="text-center border-b pb-2">
                            <div className="font-medium">
                                {format(date, 'EEEE', { locale: esLocale })}
                            </div>
                            <div className="text-sm text-gray-500">
                                {format(date, 'd MMM', { locale: esLocale })}
                            </div>
                        </div>
                        <div className="mt-2 space-y-2 min-h-[150px]">
                            {events.length > 0 ? (
                                events.map((event) => (
                                    <EventWeeklyCalendar event={event} key={event.id}>
                                    </EventWeeklyCalendar>
                                ))
                            ) : (
                                <div className="text-center text-sm text-gray-400 mt-4">
                                    {t('events.withoutEvents')}
                                </div>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            {lastEvent && <LastEvent event={lastEvent} />}
        </div>
    );
};

export default WeeklyCalendar;