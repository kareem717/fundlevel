"use client";

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
import { client } from "@fundlevel/sdk";
import { env } from "@fundlevel/web/env";
import { transactionColumns } from "./transaction-columns";
import { Skeleton } from "@fundlevel/ui/components/skeleton";
import { generate } from "shortid";
import { cn } from "@fundlevel/ui/lib/utils";
import { DataTablePagination } from "@fundlevel/ui/components/data-table-pagination";
import type { ComponentPropsWithoutRef } from "react";
import { getTokenCached } from "@fundlevel/web/actions/auth";
import { useQuery } from "@tanstack/react-query";

interface TransactionsTableProps extends ComponentPropsWithoutRef<"div"> {
  invoiceId: number;
}

export function TransactionsTable({
  invoiceId,
  className,
  ...props
}: TransactionsTableProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isPending } = useQuery({
    queryKey: ["transactions", invoiceId],
    queryFn: async () => {
      const token = await getTokenCached();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const req = await client(
        env.NEXT_PUBLIC_BACKEND_URL,
        token,
      )["bank-transaction"].invoice[":invoiceId"].$get({
        param: { invoiceId },
        query: {
          page: pagination.pageIndex,
          pageSize: pagination.pageSize,
          order: "asc",
        },
      });

      if (!req.ok) {
        throw new Error("Failed to get related transactions");
      }

      return await req.json();

    },
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
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