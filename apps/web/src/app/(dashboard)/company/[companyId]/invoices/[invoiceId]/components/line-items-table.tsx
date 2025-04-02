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
  useReactTable,
} from "@tanstack/react-table";
import { client } from "@fundlevel/sdk";
import { env } from "@fundlevel/web/env";
import { lineItemsColumns } from "./line-items-columns";
import { Skeleton } from "@fundlevel/ui/components/skeleton";
import { generate } from "shortid";
import { cn } from "@fundlevel/ui/lib/utils";
import type { ComponentPropsWithoutRef } from "react";
import { getTokenCached } from "@fundlevel/web/actions/auth";
import { useQuery } from "@tanstack/react-query";

interface LineItemsTableProps extends ComponentPropsWithoutRef<"div"> {
  invoiceId: number;
}

export function LineItemsTable({
  invoiceId,
  className,
  ...props
}: LineItemsTableProps) {
  const { data, isPending } = useQuery({
    queryKey: ["line-items", invoiceId],
    queryFn: async () => {
      const token = await getTokenCached();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const req = await client(env.NEXT_PUBLIC_BACKEND_URL, token).invoice[
        ":invoiceId"
      ]["line-items"].$get({
        param: { invoiceId },
      });

      if (!req.ok) {
        throw new Error("Failed to get invoice line items");
      }

      return await req.json();
    },
  });

  const table = useReactTable({
    data: data || [],
    columns: lineItemsColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={cn("rounded-md border", className)} {...props}>
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
                  {lineItemsColumns.map((column, colIndex) => (
                    <TableCell
                      key={`loading-skeleton-${i}-${colIndex}-${String(column.header)}`}
                    >
                      <Skeleton className="h-6 w-[80%]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </>
          ) : data?.length && data.length > 0 ? (
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
                colSpan={lineItemsColumns.length}
                className="h-24 text-center text-muted-foreground"
              >
                No line items available for this invoice
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
