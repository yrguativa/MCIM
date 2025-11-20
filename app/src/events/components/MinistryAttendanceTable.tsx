import React, { useMemo } from 'react';
import { Event } from '../models/event';
import { useMinistryStore } from '@/src/ministries/store/ministries.store';
import { Disciple } from '@/src/disciples/models/disciple';
import { useDiscipleStore } from '@/src/disciples/store/disciple.store';
import TableComponent from '@/src/app/components/TableComponent';
import { MinistryAttendanceColumns, MinistryAttendanceData } from './MinistryAttendanceColumns';

interface MinistryAttendanceTableProps {
    event: Event;
}

export const MinistryAttendanceTable: React.FC<MinistryAttendanceTableProps> = ({ event }) => {
    const { ministries, getMinistries } = useMinistryStore(state => state);
    const { Disciples: disciples, getDisciples } = useDiscipleStore(state => state);
    console.log("🚀 ~ MinistryAttendanceTable ~ disciples:", disciples)

    React.useEffect(() => {
        getMinistries();
        getDisciples();
    }, [getMinistries, getDisciples]);

    const data: MinistryAttendanceData[] = useMemo(() => {
        if (!ministries || !disciples) return [];

        return ministries.map(ministry => {
            // Total disciples in this ministry
            const ministryDisciples = disciples.filter(d => d.ministryId === ministry.id);
            const totalDisciples = ministryDisciples.length;

            // Attendees from this ministry
            const attendedCount = event.attendees?.filter(a => {
                // Check if the attendee's disciple belongs to this ministry
                // The attendee object has a 'disciple' property which is the full Disciple object
                const disciple = a.disciple as unknown as Disciple;
                return disciple?.ministryId === ministry.id;
            }).length || 0;

            const percentage = totalDisciples > 0 ? (attendedCount / totalDisciples) * 100 : 0;

            return {
                ministryName: ministry.name,
                attendedCount,
                totalDisciples,
                percentage
            };
        }).sort((a, b) => b.percentage - a.percentage); // Sort by percentage descending
    }, [ministries, disciples, event.attendees]);

    return (
        <TableComponent
            data={data}
            columns={MinistryAttendanceColumns()}
            emptyMessage="No hay datos de ministerios disponibles."
            disablePagination={true}
            defaultPageSize={20}
        />
    );
};
