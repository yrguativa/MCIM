import React from 'react';
import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { es } from "date-fns/locale"
import { BookUp } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { useCellStore } from "@/src/cells/store/cell.store"
import { buttonVariants } from "@/components/ui/button"
import { CellFull } from "../models/cellFull"

type RecordCellComponentProps = {
    idCell: string
}
export const RecordCellComponent: React.FC<RecordCellComponentProps> = (props: RecordCellComponentProps) => {
    const [dates, setDates] = useState<Date[] | undefined>([]);
    const { id } = useParams();
    const getCellState = useCellStore(state => state.getCell);
    let cellForUpdate: CellFull | undefined;

    if (id) {
        cellForUpdate = getCellState(id);
        if (cellForUpdate && cellForUpdate.records && cellForUpdate.records.length > 0) {
            const datesRecords = cellForUpdate.records.map(record => new Date(record.date));
            if (JSON.stringify(dates) !== JSON.stringify(datesRecords)) {
                setDates(datesRecords);
            }
        }
    }

    return (
        <div className="flex flex-col  text-start rounded-lg border border-dashed p-4 shadow-sm">
            <h2 className="text-2xl font-semibold mb-2">Registro de celula</h2>
            <div className="flex flex-row justify-around">
                <Calendar
                    mode="multiple"
                    selected={dates}
                    onSelect={setDates}
                    locale={es}
                    className="rounded-md border"
                />
                <div className='w-3/5'>
                    <div className="flex flex-row justify-between pb-2">
                        Ultimas Celulas
                        <Link className={buttonVariants({ variant: "outline" })} to={`/cell/${props.idCell}/register`}>
                            <BookUp className='mr-2' />Registrar Asistencia
                        </Link>
                    </div>
                    {
                        // cellForUpdate?.records && cellForUpdate.records.length > 0 && (
                        //     <RecordsCellTableComponent data={cellForUpdate.records} columns={RecordsCellColummsTable}></RecordsCellTableComponent>
                        // )
                    }
                </div>
            </div>
        </div>
    )
}