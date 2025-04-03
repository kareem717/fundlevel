"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { BankTransaction } from "@fundlevel/db/types";
import { formatCurrency } from "@fundlevel/web/lib/utils";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@fundlevel/ui/components/table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Skeleton } from "@fundlevel/ui/components/skeleton";
import { generate } from "shortid";
import { cn } from "@fundlevel/ui/lib/utils";
import { DataTablePagination } from "@fundlevel/ui/components/data-table-pagination";
import type { ComponentPropsWithoutRef } from "react";
import { useLinkedTransactions } from "@fundlevel/web/hooks/use-linked-transactions";

export const transactionColumns: ColumnDef<
  Omit<BankTransaction, "remainingRemoteContent">
>[] = [
    {
      accessorKey: "name",
      header: "Description",
      cell: ({ row }) => {
        const name = row.getValue("name") as string;
        return name || "No description";
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = row.getValue("amount") as number;
        return formatCurrency(amount);
      },
    },
  ];


interface TransactionsTableProps extends ComponentPropsWithoutRef<"div"> {
  entityType: "invoice" | "bill";
  entityId: number;
}

export function TransactionsTable({
  entityType,
  entityId,
  className,
  ...props
}: TransactionsTableProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isPending } = useLinkedTransactions(entityType, entityId, {
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
    order: "desc",
    sortBy: "date",
  });  

  const table = useReactTable({
    data: data?.data || [],
    columns: transactionColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    pageCount: data?.totalPages || 0,
    manualPagination: true,
    state: {
      pagination,
    },
  });

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isPending ? (
              // Loading skeleton
              <>
                {Array.from({ length: 5 }, (_, i) => (
                  <TableRow key={`loading-skeleton-${generate()}`}>
                    {transactionColumns.map((column, colIndex) => (
                      <TableCell
                        key={`loading-skeleton-${i}-${colIndex}-${String(column.header)}`}
                      >
                        <Skeleton className="h-6 w-[80%]" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            ) : data?.data.length && data.data.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={transactionColumns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No transactions available for this invoice
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {data?.data.length && data.data.length > 0 && (
        <DataTablePagination table={table} showSelectedRowCount={false} />
      )}
    </div>
  );
}
