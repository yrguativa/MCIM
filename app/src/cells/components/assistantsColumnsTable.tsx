import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { BookUp, MoreHorizontal, Pen } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import HumanizeNaturalDay from "@/lib/utilsDate";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useDiscipleStore } from "@/src/disciples/store/disciple.store";
import { CellFull } from "../models/cellFull";

export const ColumnsAssistants: ColumnDef<CellFull>[] = [
  {
    header: "Fecha creación",
    accessorKey: "createdDate",
    cell: (info) => {
      return <>{HumanizeNaturalDay.HumanizeNaturalDay(info.getValue() ? new Date(info.getValue() as string | number | Date) : new Date())}</>
    }
  },
  {
    header: "Lider",
    accessorKey: "leader",
    cell: (info) => {
      const disciplesState = useDiscipleStore(state => state.Disciples);
      return (<>{info.getValue() ? disciplesState.find((x) => x.id == info.getValue())?.name : ""}</>);
    },
  },
  {
    header: "Asistentes",
    accessorKey: "records",
    cell: () => {
      return (<>0</>);
    },
  },
  {
    id: "actions",
    enableHiding: false,
    accessorKey: "id",
    cell: (info) => {
      const navigate = useNavigate();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigate('/cell/' + info.getValue())}>
              <Pen className="mr-2" />Editar Celula
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate(`/cell/${info.getValue()}/register`)}>
              <BookUp className='mr-2' /> Agregar Registro Celula
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) as React.JSX.Element;
    },
  },
];
