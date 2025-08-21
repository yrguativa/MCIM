import React from 'react';

import { Event } from '../models/event';
import { format } from 'date-fns';

type LastEventProps = {
    event: Event;
};

const LastEvent: React.FC<LastEventProps> = ({ event }) => (
    <div className='mt-4' style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
        <h2>{event.name}</h2>
        <span className="block mb-2">
            Hora: {format(new Date(event.date), 'HH:mm')}
        </span>
        <span className="block mb-2">
            Fecha Fin: {event.endDate ? format(new Date(event.endDate), 'dd/MM/yyyy') : ""}
        </span>
        <p><strong>Ubicación:</strong> {event.location}</p>
        {event.description && (
            <p><strong>Descripción:</strong> {event.description}</p>
        )}
    </div>
);

export default LastEvent;