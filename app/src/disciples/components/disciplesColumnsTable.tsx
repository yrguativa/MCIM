import { ColumnDef } from "@tanstack/react-table";

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
        id: "More",
        header: "Más",
        accessorKey: "id",
    },
];
