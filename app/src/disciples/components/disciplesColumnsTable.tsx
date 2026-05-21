import { useMinistryStore } from "@/src/ministries/store/ministries.store";
import { buttonVariants } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Pen } from "lucide-react";
import { Link } from "react-router-dom";
import { Disciple } from "../models/disciple";

export const getDisciplesColumns = (t: (key: string) => string): ColumnDef<Disciple>[] => [
    {
        header: t("disciples.names"),
        accessorKey: "name",
    },
    {
        header: t("disciples.lastName"),
        accessorKey: "lastName",
    },
    {
        header: t("disciples.identification"),
        accessorKey: "identification",
    },
    {
        header: t("disciples.columns.ministry"),
        accessorKey: "ministryId",
        cell: (info) => {
            const ministryId = info.getValue() as string;
            const ministries = useMinistryStore(state => state.ministries);
            const ministry = ministries.find(m => m.id === ministryId);
            return <>{ministry?.name || 'N/A'}</>;
        }
    },
    {
        id: "Edit",
        header: t("disciples.columns.edit"),
        accessorKey: "id",
        cell: (info) => {
            return (
                <Link to={'/disciples/' + info.getValue()} className={buttonVariants({ variant: "secondary" }) + " mr-14"}>
                    <Pen className="mr-2" />{t("disciples.columns.edit")}
                </Link>
            )
        }
    },
];
