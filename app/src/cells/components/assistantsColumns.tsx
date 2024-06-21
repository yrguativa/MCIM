import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export const ColumnsAssistants: ColumnDef<any>[] = [
  {
    header: "Nombre",
    accessorKey: "name",
    //  cell: (info) => <div>{info.getValue()}</div>,
  },
  {
    header: "Asistencia",
    accessorKey: "attended",
    cell: (info) => {
      return (<div>{info.getValue() ? "Si" : "No"}</div>);
    },
  },
  {
    id: "Acctions",
    header: () => (
      <Button type="button">
        Agregar asistente
      </Button>
    )
  }
];
