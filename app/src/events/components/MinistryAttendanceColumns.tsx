import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Progress } from "@/components/ui/progress";

export interface MinistryAttendanceData {
    ministryName: string;
    attendedCount: number;
    totalDisciples: number;
    percentage: number;
}

const getProgressColor = (percentage: number) => {
    if (percentage < 50) return "bg-red-500";
    if (percentage < 80) return "bg-yellow-500";
    return "bg-green-500";
};

export const MinistryAttendanceColumns = (): ColumnDef<MinistryAttendanceData>[] => {
    return [
        {
            header: "Ministerio",
            accessorKey: "ministryName",
        },
        {
            header: "Asistencia",
            accessorKey: "attendedCount",
        },
        {
            header: "Total Discipulos",
            accessorKey: "totalDisciples",
        },
        {
            header: "Porcentaje",
            accessorKey: "percentage",
            cell: (info) => {
                const percentage = info.getValue() as number;
                return <>{percentage.toFixed(1)}%</>;
            },
        },
        {
            header: "Progreso",
            accessorKey: "percentage",
            id: "progress",
            cell: (info) => {
                const percentage = info.getValue() as number;
                const colorClass = getProgressColor(percentage);
                return (
                    <div className="w-full">
                        <Progress value={percentage} className="h-2" indicatorClassName={colorClass} />
                    </div>
                );
            },
        },
    ];
};
