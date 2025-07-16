import { buttonVariants } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Pen } from "lucide-react";
import { Link } from "react-router-dom";

export const DisciplesColumnsTable: ColumnDef<any>[] = [
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
        id: "Edit",
        header: "Editar",
        accessorKey: "id",
        cell: (info) => {
            return (
                <Link to={'/disciple/' + info.getValue()} className={buttonVariants({ variant: "secondary" }) + " mr-14"}>
                    <Pen className="mr-2" />Editar
                </Link>
            )
        }
    },
];