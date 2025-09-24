import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { es } from "date-fns/locale";
import { formatRelative } from "date-fns";

import { useDiscipleStore } from "@/src/disciples/store/disciple.store";
import { EventAttendance } from "../models/event";


export const RecordsEventColumns: ColumnDef<EventAttendance>[] = [
    {
        header: "Fecha registro",
        accessorKey: "dateRegister",
        cell: (info) => {
            return <>{formatRelative(new Date(info.getValue()), new Date(), { locale: es, addSuffix: true, })}</>
        }
    },
    {
        header: "Discipulo",
        accessorKey: "discipleId",
        cell: (info): React.FC => {
            const disciplesState = useDiscipleStore(state => state.Disciples);
            return (<>{info.getValue() ? disciplesState.find((x) => x.id == info.getValue())?.name : ""}</>);
        },
    },
    {
        header: "Ministerio",
        accessorKey: "discipleId",
        cell: (info) => {

            return (<>{info.getValue() && info.getValue().assistants ? info.getValue().assistants.length : "0"}</>);
        },
    },

];
