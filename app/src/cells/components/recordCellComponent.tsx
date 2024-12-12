import { buttonVariants } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { useCellStore } from "@/src/stores/cell/cell.store"
import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { CellFull } from "../models/cellFull"
import RecordsCellTableComponent from "./recordsCellTableComponent"
import { RecordsCellColummsTable } from "./recordsCellColumnsTableComponent"

type RecordCellComponentProps = {
    idCell: string
}
export const RecordCellComponent: React.FC<RecordCellComponentProps> = (props: RecordCellComponentProps) => {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const { id } = useParams();
    const getCellState = useCellStore(state => state.getCell);
    let cellForUpdate: CellFull | undefined;

    if (id) {
        cellForUpdate = getCellState(id);

    }

    return (
        <div className="flex flex-col  text-start rounded-lg border border-dashed p-4 shadow-sm">
            <h2 className="text-2xl font-semibold mb-2">Registro de celula</h2>
            <div className="flex flex-row justify-around">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                />
                <div>
                    Ultimas Celulas
                    <Link className={buttonVariants({ variant: "outline" })} to={`/cell/${props.idCell}/register`}>Registrar Asistencia</Link>

                    {
                        cellForUpdate?.records && cellForUpdate.records.length > 0 && (
                            <RecordsCellTableComponent data={cellForUpdate.records} columns={RecordsCellColummsTable}></RecordsCellTableComponent>
                        )
                    }
                </div>
            </div>
        </div>
    )
}