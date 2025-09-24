import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { enUS, es } from "date-fns/locale";
import { formatRelative, format, formatDistanceToNow } from "date-fns";

import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { EventAttendance } from "../models/event";
import { useTranslation } from "react-i18next";
import { useMinistryStore } from "@/src/ministries/store/ministries.store";
import { Disciple } from "@/src/disciples/models/disciple";

export const RecordsEventColumns = (): ColumnDef<EventAttendance>[] => {
    const { t, i18n } = useTranslation();
    const locale = i18n.language === 'es' ? es : enUS;
    
    return [
        {
            header: t('events.recordsAssistance.columns.dateRegister'),
            accessorKey: "dateRegister",
            cell: (info) => {
                console.log("🚀 ~ RecordsEventColumns ~ info:", info)
                const value = info.getValue() as string;
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                {formatDistanceToNow(new Date(value), { locale, addSuffix: true })}
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    {formatRelative(new Date(value), new Date(), { locale })} 
                                    {format(new Date(value), "hh:mm a", { locale })}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            }
        },
        {
            header: t('events.recordsAssistance.columns.disciple'),
            accessorKey: "disciple",
            cell: (info) => {
                const disciple = info.getValue() as Disciple;
                return <>{disciple?.name} {disciple?.lastName}</>;
            },
        },
        {
            header: t('events.recordsAssistance.columns.ministry'),
            accessorKey: "disciple.ministryId",
            cell: (info) => {
                const ministryId = info.getValue() as string;
                const ministriesState = useMinistryStore(state => state.ministries);
                const ministry = ministriesState.find((x) => x.id === ministryId);
                return <>{ministry?.name }</>;
            },
        },
    ];
};
