import { ColumnDef } from "@tanstack/react-table";
import { MapPin, Video } from "lucide-react";
import { useDiscipleStore } from "@/src/disciples/store/disciple.store";
import { useMinistryStore } from "@/src/ministries/store/ministries.store";
import { Badge } from "@/components/ui/badge";

export interface CellReportRow {
  cellId: string;
  cellLeader: string;
  cellDay: string;
  cellTime: string;
  cellAddress: string;
  recordTopic: string;
  recordDate: Date;
  recordMode: "presencial" | "virtual";
  recordLocation?: string;
  recordLeader: string;
  assistantsCount: number;
}

export const getReportColumns = (t: (key: string) => string): ColumnDef<CellReportRow>[] => [
  {
    header: t("cells.report.leader"),
    accessorKey: "recordLeader",
    cell: (info) => {
      const disciplesState = useDiscipleStore(state => state.Disciples);
      const leaderId = info.getValue() as string;
      const disciple = leaderId ? disciplesState.find((x) => x.id === leaderId) : undefined;
      return <>{disciple ? `${disciple.name} ${disciple.lastName}` : leaderId || ""}</>;
    },
  },
  {
    header: t("cells.report.ministry"),
    accessorKey: "recordLeader",
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
    header: t("cells.report.modality"),
    accessorKey: "recordMode",
    cell: (info) => {
      const mode = info.getValue() as string;
      return (
        <Badge variant={mode === "presencial" ? "default" : "secondary"} className="flex items-center gap-1 w-fit">
          {mode === "presencial" ? <MapPin className="h-3 w-3" /> : <Video className="h-3 w-3" />}
          {mode === "presencial" ? "Presencial" : "Virtual"}
        </Badge>
      );
    },
  },
  {
    header: t("cells.report.location"),
    accessorKey: "recordLocation",
    cell: (info) => <>{info.getValue() as string || "—"}</>,
  },
  {
    header: t("cells.report.topic"),
    accessorKey: "recordTopic",
    cell: (info) => <>{info.getValue() as string}</>,
  },
  {
    header: t("cells.report.date"),
    accessorKey: "recordDate",
    cell: (info) => {
      const date = info.getValue() as Date;
      if (!date) return <></>;
      return <>{new Date(date).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}</>;
    },
  },
  {
    header: t("cells.report.assistants"),
    accessorKey: "assistantsCount",
    cell: (info) => {
      const count = info.getValue() as number;
      return <Badge variant="outline">{count}</Badge>;
    },
  },
];
