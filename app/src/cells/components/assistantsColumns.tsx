import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from 'react-router-dom';


export const ColumnsAssistants: ColumnDef<any>[] = [
  {
    id: "Edit",
    header: "Editar",
    accessorKey: "id",
    cell: (info) => {
      const navigate = useNavigate();
      return (
        <Button variant="secondary" type="button" onClick={() => navigate('/cell/'+info.getValue())}>
          Editar
        </Button>
      )
    }
  },
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
    id: "Acctions",
    header: "Asistants",
    cell: () => {
      const navigate = useNavigate();
      return (
        <Button type="button" onClick={() => navigate('/cells/register')}>
          Registrar Asistencia
        </Button>
      )
    }
  }
];
