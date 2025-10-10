import React from "react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable, Row } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"

/**
 * Generic table component backed by @tanstack/react-table.
 *
 * Type parameters:
 *  - TData: the row data type
 *  - TValue: the cell value type (usually inferred)
 *
 * Props:
 *  - columns: ColumnDef<TData, TValue>[]
 *  - data: TData[]
 *  - getRowId?: optional function to derive a stable row id from TData
 *  - emptyMessage?: optional message to show when data is empty
 */
interface DataTableProps<TData, TValue = unknown> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    getRowId?: (row: TData, index: number) => string
    emptyMessage?: React.ReactNode
}

function TableComponent<TData, TValue = unknown>({
    columns,
    data,
    getRowId,
    emptyMessage = "No results.",
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        // Provide getRowId only when consumer passes it
        ...(getRowId ? { getRowId } : {}),
    })

    return (
        <div className="rounded-md border w-full">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row: Row<TData>) => (
                            <TableRow
                                key={row.id}
                                // only set the attribute when selected; avoid boolean values
                                {...(row.getIsSelected() ? { "data-state": "selected" } : {})}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                {emptyMessage}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    ) as React.ReactElement;
}

export default TableComponent;