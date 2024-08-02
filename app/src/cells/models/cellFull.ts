
import { type Cell } from "../schemas/cellSchema";
import { type CellRecord } from "../schemas/cellRecordsSchema"; 

export type CellFull =  Cell & {
    records: CellRecord[]
}