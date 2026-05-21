import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { BookUp, MoreHorizontal, Pen } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useDiscipleStore } from "@/src/disciples/store/disciple.store";
import { useMinistryStore } from "@/src/ministries/store/ministries.store";
import { CellFull } from "../models/cellFull";

export const getColumnsAssistants = (t: (key: string) => string): ColumnDef<CellFull>[] => [
  {
    header: t("cells.columns.leader"),
    accessorKey: "leader",
    cell: (info) => {
      const disciplesState = useDiscipleStore(state => state.Disciples);
      return (<>{info.getValue() ? disciplesState.find((x) => x.id == info.getValue())?.name : ""}</>);
    },
  },
  {
    header: t("cells.columns.ministry"),
    accessorKey: "leader",
    cell: (info) => {
      const disciplesState = useDiscipleStore(state => state.Disciples);
      const ministries = useMinistryStore(state => state.ministries);
      const leaderId = info.getValue() as string;
      const disciple = leaderId ? disciplesState.find((x) => x.id === leaderId) : undefined;
      const ministry = disciple?.ministryId ? ministries.find((m) => m.id === disciple.ministryId) : undefined;
      return <>{ministry?.name || ""}</>;
    },
  },
  {
    header: t("cells.columns.day"),
    accessorKey: "day",
    cell: (info) => <>{info.getValue() as string || ""}</>,
  },
  {
    header: t("cells.columns.time"),
    accessorKey: "time",
    cell: (info) => {
      const time = info.getValue() as string;
      if (!time) return <></>;
      const [hours, minutes] = time.split(":");
      if (!hours || !minutes) return <>{time}</>;
      const h = parseInt(hours, 10);
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 || 12;
      return <>{`${h12}:${minutes} ${ampm}`}</>;
    },
  },
  {
    header: t("cells.columns.assistants"),
    accessorKey: "assistants",
    cell: (info) => {
      const assistants = info.getValue() as unknown[];
      return <>{assistants?.length || 0}</>;
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
              <span className="sr-only">{t("cells.actions.actions")}</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("cells.actions.actions")}</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigate('/cells/' + info.getValue())}>
              <Pen className="mr-2" />{t("cells.actions.edit")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate(`/cells/${info.getValue()}/register`)}>
              <BookUp className='mr-2' /> {t("cells.actions.register")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) as React.JSX.Element;
    },
  },
];
