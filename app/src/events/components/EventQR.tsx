import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card } from '@/components/ui/card';
import { Event } from '../models/event';

interface EventQRProps {
    event: Event;
}

export const EventQR: React.FC<EventQRProps> = ({ event }) => {
    const qrData = JSON.stringify({
        id: event.id,
        name: event.name,
        date: event.date,
        location: event.location
    });

    return (
        <Card className="p-6 flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">{event.name} - QR Code</h3>
            <div className="bg-white p-4 rounded-lg">
                <QRCodeSVG value={qrData} size={256} />
            </div>
            <p className="mt-4 text-sm text-gray-600">Scan this code to register attendance</p>
        </Card>
    );
};
