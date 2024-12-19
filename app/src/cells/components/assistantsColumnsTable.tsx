import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Pen } from "lucide-react";
import { useNavigate } from 'react-router-dom';


export const ColumnsAssistants: ColumnDef<any>[] = [
  {
    header: "Fecha creación",
    accessorKey: "createdDate",

  },
  {
    header: "Lider",
    accessorKey: "leader",
  },
  {
    header: "Asistentes",
    accessorKey: "records",
    cell: (info) => {
      return (<div>{info.getValue() && info.getValue().assistants ? info.getValue().assistants.length : "0"}</div>);
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
          <Pen className="mr-2" />Editar
        </Button>
      )
    }
  },
];
