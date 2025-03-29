"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@fundlevel/ui/components/table";
import { useAuth } from "@fundlevel/web/components/providers/auth-provider";
import { useQuery } from "@tanstack/react-query";
import { client } from "@fundlevel/sdk";
import { env } from "@fundlevel/web/env";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { columns } from "./columns";
import { DataTablePagination } from "@fundlevel/ui/components/data-table-pagination";
import { toast } from "@fundlevel/ui/components/sonner";
import { parseAsInteger, useQueryState } from "nuqs";

interface DataTableProps {
  companyId: number;
}

export function InvoiceTable({ companyId }: DataTableProps) {
  const { authToken } = useAuth();
  if (!authToken) {
    throw new Error("No auth token found");
  }

  const [pageIndex, setPageIndex] = useQueryState(
    "page",
    parseAsInteger.withDefault(0),
  );
  const [pageSize, setPageSize] = useQueryState(
    "limit",
    parseAsInteger.withDefault(10),
  );

  const { data: invoices, isLoading } = useQuery({
    queryKey: ["invoices", companyId, pageIndex, pageSize],
    queryFn: async () => {
      const sdk = client(env.NEXT_PUBLIC_BACKEND_URL, authToken);

      const response = await sdk.invoice.company[":companyId"].$get({
        param: { companyId },
        query: {
          offset: pageIndex * pageSize,
          limit: pageSize,
          order: "asc",
        },
      });
      const body = await response.json();

      if ("error" in body) {
        toast.error(body.error);
        return {
          data: [],
          totalPages: 0,
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
    data: invoices?.data ?? [],
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
    pageCount: invoices?.totalPages ?? 0,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    manualPagination: true,
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : (header.column.columnDef.header as React.ReactNode)}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
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
