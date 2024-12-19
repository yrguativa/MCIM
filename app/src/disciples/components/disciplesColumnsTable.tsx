import { ColumnDef } from "@tanstack/react-table";

export const DisciplesColummsTable: ColumnDef<any>[] = [
    {
        header: "Nombres",
        accessorKey: "date",
    },
    {
        header: "Apellidos",
        accessorKey: "assistants",
    },
    {
        header: "Fecha de Cumpleaños",
        accessorKey: "assistants",
    },
    {
        header: "Celular",
        accessorKey: "assistants",
    },
    {
        id: "More",
        header: "Más",
        accessorKey: "id",
    },
];
