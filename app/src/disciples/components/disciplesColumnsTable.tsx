import { useMinistryStore } from "@/src/ministries/store/ministries.store";
import { buttonVariants } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Pen } from "lucide-react";
import { Link } from "react-router-dom";
import { Disciple } from "../models/disciple";

export const DisciplesColumnsTable: ColumnDef<Disciple>[] = [
    {
        header: "Nombres",
        accessorKey: "name",
    },
    {
        header: "Apellidos",
        accessorKey: "lastName",
    },
    {
        header: "Identificación",
        accessorKey: "identification",
    },
    {
        header: "Ministerio",
        accessorKey: "ministryId",
        cell: (info) => {
            const ministryId = info.getValue() as string;
            const ministries = useMinistryStore(state => state.ministries);
            const ministry = ministries.find(m => m.id === ministryId);
            return <>{ministry?.name || 'N/A'}</>;
        }
    },
    {
        id: "Edit",
        header: "Editar",
        accessorKey: "id",
        cell: (info) => {
            return (
                <Link to={'/disciples/' + info.getValue()} className={buttonVariants({ variant: "secondary" }) + " mr-14"}>
                    <Pen className="mr-2" />Editar
                </Link>
            )
        }
    },
];