import React from 'react';

import { useTranslation } from 'react-i18next';
import { enUS, es } from 'date-fns/locale';
import { format } from 'date-fns';
import { Event } from '../models/event';
import { LineChartStep } from '@/components/chart/LineChartStep';
import { IntervalsWithEvents } from '../tools/event.tool';

import TableComponent from '@/src/app/components/TableComponent';
import { RecordsEventColumns } from './RecordsEventColumns';


type LastEventProps = {
    event: Event;
};

const LastEvent: React.FC<LastEventProps> = ({ event }) => {
    const { t, i18n } = useTranslation();
    const locale = i18n.language === 'es' ? es : enUS;

    const data = IntervalsWithEvents(event.attendees || []);
    const timeRegister = data.map((item) => ({ start: item.start, end: item.end, value: item.registers.length }));

    return (
        <div className="grid grid-cols-4 gap-4 items-stretch justify-center mt-3 text-start rounded-lg border border-dashed  shadow-sm p-2">
            <h2 className="col-span-4 pb-2">Ultimo evento</h2>
            <div className='col-span-2 border-1 border-solid border-neutral-200 p-4 rounded-lg' >
                <h2>{event.name}</h2>
                <span className="block mb-2">
                    Hora: {format(new Date(event.date), 'HH:mm a', { locale })}
                </span>
                <span className="block mb-2">
                    Fecha Fin: {event.endDate ? format(new Date(event.endDate), 'dd/MM/yyyy', { locale }) : ""}
                </span>
                <p><strong>Ubicación:</strong> {event.location}</p>
                {event.description && (
                    <p><strong>Descripción:</strong> {event.description}</p>
                )}
            </div>

            <div className='col-span-2 row-span-2  border-1 border-solid border-neutral-200 p-4 rounded-lg '>
                <h3 className="mb-3">{t('events.recordsAssistance.title')}</h3>
                <TableComponent data={event.attendees || []} columns={RecordsEventColumns()}></TableComponent>
            </div>

            <div className='col-span-2  border-1 border-solid border-neutral-200 p-4 rounded-lg' >
                <h3 className="mb-4">Tiempos de Registro </h3>
                <LineChartStep data={timeRegister} />
            </div>°
        </div>
    )
}

export default LastEvent;