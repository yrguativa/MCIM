import React, { } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarPlus, QrCode } from 'lucide-react';
import { EventWeeklyCalendar } from '../components/EventWeeklyCalendar';
import { useWeeklyCalendarHook } from '../hooks/weeklyCalendarHook';
import LastEvent from '../components/LastEvent';

export const WeeklyCalendar: React.FC = () => {
    const navigate = useNavigate();

    const { weekDays, lastEvent } = useWeeklyCalendarHook();

    const handleCreateEvent = () => {
        navigate('/events/create');
    };

    const handleScanQR = () => {
        navigate('/events/scan');
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Calendario de Eventos</h1>
                <div className="flex gap-2">
                    <Button
                        onClick={handleScanQR}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <QrCode className="h-5 w-5" />
                        Escanear QR
                    </Button>
                    <Button
                        onClick={handleCreateEvent}
                        className="flex items-center gap-2"
                    >
                        <CalendarPlus className="h-5 w-5" />
                        Crear Evento
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-4">
                {weekDays.map(({ date, events }) => (
                    <Card key={date.toISOString()} className="p-2">
                        <div className="text-center border-b pb-2">
                            <div className="font-medium">
                                {format(date, 'EEEE', { locale: es })}
                            </div>
                            <div className="text-sm text-gray-500">
                                {format(date, 'd MMM', { locale: es })}
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
                                    Sin eventos
                                </div>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            { lastEvent && <LastEvent event={lastEvent}  />}
        </div>
    );
};
