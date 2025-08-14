import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, startOfWeek, addDays, isSameDay, set } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarPlus, QrCode } from 'lucide-react';
import { useEventStore } from '../store/event.store';

export const WeeklyCalendar = () => {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());
    const events = useEventStore(state => state.events);

    if (events && events.length > 0 && new Date(events[0].date).toDateString() != currentDate.toDateString()) {
        setCurrentDate(new Date(events[0].date));
    }

    // Obtener el inicio de la semana actual
    const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });

    // Crear array con los días de la semana
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
                                    <div
                                        key={event.id}
                                        className="p-2 bg-primary/10 rounded-md text-sm"
                                    >
                                        <div className="font-medium">{event.name}</div>
                                        <div className="text-xs text-gray-500">
                                            {format(new Date(event.date), 'HH:mm')}
                                        </div>
                                        <div className="text-xs truncate">
                                            {event.location}
                                        </div>
                                    </div>
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
        </div>
    );
};
