import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from 'react-router-dom';

export const RecordsCellColummsTable: ColumnDef<any>[] = [
    {
        header: "Fecha",
        accessorKey: "date",
        cell: (info) => {
            return <span>{info.getValue()}</span>
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
                    Editar
                </Button>
            )
        }
    },
];
