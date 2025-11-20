import React from 'react';

import { useTranslation } from 'react-i18next';
import { enUS, es } from 'date-fns/locale';
import { format } from 'date-fns';
import { Event } from '../models/event';
import { LineChartStep } from '@/components/chart/LineChartStep';
import { IntervalsWithEvents } from '../tools/event.tool';

import TableComponent from '@/src/app/components/TableComponent';
import { RecordsEventColumns } from './RecordsEventColumns';
import { MinistryAttendanceTable } from './MinistryAttendanceTable';
import { CalendarDays, Clock, ListChecks, MapPinCheckInside, Users } from 'lucide-react';

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
                <h2 className="font-bold text-2xl">{event.name}</h2>
                <span className="block mb-2 mt-6">
                    <strong><CalendarDays className="inline mr-1" /> Fecha Inicio:</strong>  {format(new Date(event.date), 'dd/MM/yyyy')}
                </span>
                <span className="block mb-2">
                    <strong><Clock className="inline mr-1" /> Hora:</strong> {format(new Date(event.date), 'HH:mm a', { locale })}
                </span>
                <span className="block mb-2">
                    <strong><CalendarDays className="inline mr-1" /> Fecha Fin:</strong> {event.endDate ? format(new Date(event.endDate), 'dd/MM/yyyy', { locale }) : ""}
                </span>
                <p><strong><MapPinCheckInside className="inline mr-1" />Ubicación:</strong> {event.location}</p>
                <p><strong><Users className="inline mr-1" /> Capidad:</strong> {event.capacity}</p>
                {event.attendees && (
                    <p><strong><ListChecks  className="inline mr-1" /> Asistentes:</strong> <span className="text-green-500">{event.attendees.length}</span></p>
                )}
            </div>

            <div className='col-span-2 row-span-2  border-1 border-solid border-neutral-200 p-4 rounded-lg '>
                <h3 className="mb-3">{t('events.recordsAssistance.title')}</h3>
                <TableComponent data={event.attendees || []} columns={RecordsEventColumns()}></TableComponent>
            </div>

            <div className='col-span-2  border-1 border-solid border-neutral-200 p-4 rounded-lg' >
                <h3 className="mb-4">Tiempos de Registro </h3>
                <LineChartStep data={timeRegister} />
            </div>

            <div className='col-span-4 border-1 border-solid border-neutral-200 p-4 rounded-lg'>
                <h3 className="mb-4">Asistencia por Ministerio</h3>
                <MinistryAttendanceTable event={event} />
            </div>
        </div>
    )
}

export default LastEvent;