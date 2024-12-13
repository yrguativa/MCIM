import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { CellFull } from "../models/cellFull";
import HumanizeNaturalDay from "@/lib/utilsDate";

export const RecordsCellColummsTable: ColumnDef<CellFull>[] = [
    {
        header: "Fecha",
        accessorKey: "date",
        cell: (info) => {
            return <span>{HumanizeNaturalDay.HumanizeNaturalDay(new Date(info.getValue()))}</span>
        }
    },
    {
        header: "Total de asistentes",
        accessorKey: "assistants",
        cell: (info) => {
            return (<div>{info.getValue() ? info.getValue().length : "0"}</div>);
        },
    },
    {
        id: "Edit",
        header: "Editar",
        accessorKey: "id",
        cell: (info) => {
            const navigate = useNavigate();
            return (
                <Button variant="secondary" type="button" onClick={() => navigate('/cell/' + info.getValue())}>
                    <Pencil /> Editar
                </Button>
            )
        }
    },
];
