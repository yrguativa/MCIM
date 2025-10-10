import React from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import HumanizeNaturalDay from "@/lib/utilsDate";
import { CellRecordInput } from "../schemas/cellRecordsSchema";

export const RecordsCellColummsTable: ColumnDef<CellRecordInput>[] = [
    {
        header: "Fecha",
        accessorKey: "date",
        cell: (info) => {
            return <span>{HumanizeNaturalDay.HumanizeNaturalDay(info.getValue() ? new Date(info.getValue() as string | number | Date) : new Date())}</span>
        }
    },
    {
        header: "Total de asistentes",
        accessorKey: "assistants",
        cell: (info) => {
            return (
                <div className="text-center">
                    <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                        {info.getValue() ? (info.getValue() as Array<string>).length : "0"}
                    </div>
                </div>
            );
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
                    <Pencil className='mr-2' /> Editar
                </Button>
            ) as React.ReactElement;
        }
    },
];
