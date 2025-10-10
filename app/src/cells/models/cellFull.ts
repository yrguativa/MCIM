
import { type CellInput } from "../schemas/cellSchema";
import { type CellRecordInput } from "../schemas/cellRecordsSchema"; 

export type CellFull =  CellInput & {
    records: CellRecordInput[]
}