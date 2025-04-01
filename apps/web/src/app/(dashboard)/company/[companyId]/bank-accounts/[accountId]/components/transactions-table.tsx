"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@fundlevel/ui/components/table";
import { useQuery } from "@tanstack/react-query";
import { client } from "@fundlevel/sdk";
import { env } from "@fundlevel/web/env";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { columns } from "./columns";
import { DataTablePagination } from "@fundlevel/ui/components/data-table-pagination";
import { toast } from "@fundlevel/ui/components/sonner";
import { parseAsInteger, useQueryState } from "nuqs";
import { Skeleton } from "@fundlevel/ui/components/skeleton";
import { useEffect, useRef } from "react";
import { generate } from "shortid";
import { getTokenCached } from "@fundlevel/web/actions/auth";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@fundlevel/ui/lib/utils";

interface TransactionsTableProps extends ComponentPropsWithoutRef<"div"> {
  bankAccountId: number;
}

export function TransactionsTable({
  bankAccountId,
  className,
  ...props
}: TransactionsTableProps) {
  const [pageIndex, setPageIndex] = useQueryState(
    "page",
    parseAsInteger.withDefault(0),
  );
  const [pageSize, setPageSize] = useQueryState(
    "limit",
    parseAsInteger.withDefault(10),
  );

  // Keep track of the last known page count
  const lastPageCount = useRef<number>(0);

  const { data, isLoading } = useQuery({
    queryKey: ["transactions", bankAccountId, pageIndex, pageSize],
    queryFn: async () => {
      const authToken = await getTokenCached();
      if (!authToken) {
        throw new Error("No auth token found");
      }

      const sdk = client(env.NEXT_PUBLIC_BACKEND_URL, authToken);

      const response = await sdk["bank-transaction"]["bank-account"][
        ":bankAccountId"
      ].$get({
        param: { bankAccountId },
        query: {
          page: pageIndex,
          pageSize: pageSize,
          order: "asc",
        },
      });

      const body = await response.json();

      if ("error" in body) {
        toast.error(body.error);
        return {
          data: [],
          totalPages: lastPageCount.current, // Preserve the last known page count on error
        };
      }

      return {
        data: body.data || [],
        totalPages: body.totalPages,
      };
    },
    // 2 min
    staleTime: 1000 * 60 * 2,
  });

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({
          pageIndex,
          pageSize,
        });
        setPageIndex(newState.pageIndex);
        setPageSize(newState.pageSize);
      } else {
        setPageIndex(updater.pageIndex);
        setPageSize(updater.pageSize);
      }
    },
    pageCount: isLoading ? lastPageCount.current : (data?.totalPages ?? 0),
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    manualPagination: true,
  });

  // Update the last known page count whenever we get new data
  useEffect(() => {
    if (data?.totalPages !== undefined) {
      lastPageCount.current = data.totalPages;
    }
  }, [data?.totalPages]);

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
            {isLoading ? (
              <>
                {Array.from({ length: 10 }, (_, rowIndex) => (
                  <TableRow key={`loading-skeleton-${generate()}`}>
                    {columns.map((column, colIndex) => (
                      <TableCell
                        key={`loading-skeleton-${rowIndex}-${colIndex}-${String(column.id)}`}
                      >
                        <Skeleton className="h-6 w-[80%]" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {typeof cell.column.columnDef.cell === "function"
                        ? cell.column.columnDef.cell({
                          ...cell,
                          cell,
                          table,
                        })
                        : (cell.getValue() as string)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {isLoading ? "Loading..." : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} showSelectedRowCount={false} />
    </div>
  );
}
