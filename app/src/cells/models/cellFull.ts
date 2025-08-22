
import { type Cell } from "../schemas/cellSchema";
import { type CellRecordInput } from "../schemas/cellRecordsSchema"; 

export type CellFull =  Cell & {
    records: CellRecordInput[]
}