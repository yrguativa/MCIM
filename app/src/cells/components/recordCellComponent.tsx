import React, { useEffect } from 'react';
import { useState } from "react"
import { Link } from "react-router-dom"
import { es } from "date-fns/locale"
import { BookUp } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { useCellStore } from "@/src/cells/store/cell.store"
import { buttonVariants } from "@/components/ui/button"

type RecordCellComponentProps = {
    idCell: string
}
export const RecordCellComponent: React.FC<RecordCellComponentProps> = (props: RecordCellComponentProps) => {
    const [dates, setDates] = useState<Date[] | undefined>([]);
    const getCellState = useCellStore(state => state.getCell);

    useEffect(() => {
        const cell = getCellState(props.idCell);
        if (cell && cell.records && cell.records.length > 0) {
            const datesRecords = cell.records.map(record => new Date(record.date));
            setDates(datesRecords);
        }
    }, [props.idCell]);

    return (
        <div className="flex flex-col text-start rounded-lg border border-dashed p-4 shadow-sm">
            <h2 className="text-2xl font-semibold mb-2">Registro de celula</h2>
            <div className="flex flex-col md:flex-row justify-around gap-4">
                <Calendar
                    mode="multiple"
                    selected={dates}
                    onSelect={setDates}
                    locale={es}
                    className="rounded-md border"
                />
                <div className='w-full md:w-3/5'>
                    <div className="flex flex-row justify-between pb-2">
                        Ultimas Celulas
                        <Link className={buttonVariants({ variant: "outline" })} to={`/cells/${props.idCell}/register`}>
                            <BookUp className='mr-2' />Registrar Asistencia
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
