import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Event } from '../models/event';

export const CreateEvent = () => {
    const [event, setEvent] = useState<Partial<Event>>({
        name: '',
        description: '',
        date: undefined,
        location: '',
        capacity: undefined,
    });
    const [hasEndDate, setHasEndDate] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement event creation logic
        console.log('Creando evento:', event);
    };

    return (
        <div className="container mx-auto p-4">
            <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Crear Nuevo Evento</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nombre del Evento</Label>
                        <Input
                            id="name"
                            value={event.name}
                            onChange={(e) => setEvent({ ...event, name: e.target.value })}
                            placeholder="Ingrese el nombre del evento"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="description">Descripción</Label>
                        <Input
                            id="description"
                            value={event.description}
                            onChange={(e) => setEvent({ ...event, description: e.target.value })}
                            placeholder="Describa el evento"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="date">Fecha de Inicio</Label>
                        <Input
                            id="date"
                            type="datetime-local"
                            onChange={(e) => setEvent({ ...event, date: new Date(e.target.value) })}
                            required
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="has-end-date"
                            checked={hasEndDate}
                            onCheckedChange={setHasEndDate}
                        />
                        <Label htmlFor="has-end-date">¿Tiene fecha de finalización?</Label>
                    </div>
                    {hasEndDate && (
                        <div>
                            <Label htmlFor="endDate">Fecha de Finalización</Label>
                            <Input
                                id="endDate"
                                type="datetime-local"
                                onChange={(e) => setEvent({ ...event, endDate: new Date(e.target.value) })}
                                required={hasEndDate}
                            />
                        </div>
                    )}
                    <div>
                        <Label htmlFor="location">Ubicación</Label>
                        <Input
                            id="location"
                            value={event.location}
                            onChange={(e) => setEvent({ ...event, location: e.target.value })}
                            placeholder="Indique la ubicación del evento"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="capacity">Capacidad</Label>
                        <Input
                            id="capacity"
                            type="number"
                            value={event.capacity}
                            onChange={(e) => setEvent({ ...event, capacity: parseInt(e.target.value) })}
                            placeholder="Número máximo de participantes"
                        />
                    </div>
                    <Button type="submit" className="w-full">Crear Evento</Button>
                </form>
            </Card>
        </div>
    );
};
