import React, { useState } from "react";
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable, Row, PaginationState } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    defaultPageSize?: number
    disablePagination?: boolean
}

function TableComponent<TData, TValue = unknown>({
    columns,
    data,
    getRowId,
    emptyMessage = "No results.",
    defaultPageSize = 10,
    disablePagination = false,
}: DataTableProps<TData, TValue>) {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: defaultPageSize,
    });

    const table = useReactTable({
        data,
        columns,
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
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
            {!disablePagination && (
                <div className="flex items-center justify-between px-4 py-2">
                    <div className="text-sm text-muted-foreground">
                        {data.length > 0 ? (
                            <>
                                Mostrando {pagination.pageIndex * pagination.pageSize + 1} - {Math.min((pagination.pageIndex + 1) * pagination.pageSize, data.length)} de {data.length}
                            </>
                        ) : (
                            <>0 resultados</>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                            <Button size="sm" variant="ghost" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                                «
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                                ‹
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                                ›
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                                »
                            </Button>
                        </div>

                        <div className="flex items-center">
                            <Select onValueChange={(v) => table.setPageSize(Number(v))} defaultValue={String(pagination.pageSize)}>
                                <SelectTrigger className="w-24 h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    ) as React.ReactElement;
}

export default TableComponent;