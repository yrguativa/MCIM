import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
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
    accessorKey: "assistants",
    cell: (info) => {
      return (<div>{info.getValue().length}</div>);
    },
  },
  {
    id: "Acctions",
    header: "Asistants",
    cell: () => {
      const navigate = useNavigate();
      return (
        <Button type="button" onClick={() => navigate('/cells/register')}>
          Agregar Asistencia
        </Button>
      )
    }
  },
  {
    id: "Edit",
    header: "Editar",
    cell: () => {
      const navigate = useNavigate();
      return (
        <Button variant="secondary" type="button" onClick={() => navigate('/cells/register')}>
          Editar Celula
        </Button>
      )
    }
  }
];
