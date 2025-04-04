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
import { DataTablePagination } from "@fundlevel/ui/components/data-table-pagination";
import { toast } from "@fundlevel/ui/components/sonner";
import { parseAsInteger, useQueryState } from "nuqs";
import { Skeleton } from "@fundlevel/ui/components/skeleton";
import { useRef, useEffect } from "react";
import { generate } from "shortid";
import { getTokenCached } from "@fundlevel/web/actions/auth";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@fundlevel/ui/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@fundlevel/ui/components/button";
import { Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@fundlevel/ui/components/dropdown-menu";
import type { Invoice } from "@fundlevel/db/types";
import Link from "next/link";
import { redirects } from "@fundlevel/web/lib/config/redirects";
import { formatCurrency } from "@fundlevel/web/lib/utils";

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "remoteId",
    header: "Invoice ID",
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) =>
      formatCurrency(
        row.original.totalAmount,
        row.original.currency || undefined,
      ),
  },
  {
    accessorKey: "balanceRemaining",
    header: "Balance",
    cell: ({ row }) =>
      formatCurrency(
        row.original.balanceRemaining || 0,
        row.original.currency || undefined,
      ),
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => {
      const date = row.getValue("dueDate") as string;
      return date ? new Date(date).toLocaleDateString() : "-";
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return new Date(date).toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const invoice = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link
                href={redirects.app
                  .company(invoice.companyId)
                  .invoices.show(invoice.id)}
                prefetch={true}
              >
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={redirects.app
                  .company(invoice.companyId)
                  .invoices.reconcile(invoice.id)}
                prefetch={true}
              >
                Reconcile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                console.log("Download invoice", invoice.id);
              }}
            >
              Download
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                console.log("Mark as paid", invoice.id);
              }}
            >
              Mark as Paid
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface InvoiceTableProps extends ComponentPropsWithoutRef<"div"> {
  companyId: number;
}

export function InvoiceTable({
  companyId,
  className,
  ...props
}: InvoiceTableProps) {
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

  const { data: invoices, isLoading } = useQuery({
    queryKey: ["invoices", companyId, pageIndex, pageSize],
    queryFn: async () => {
      const authToken = await getTokenCached();
      if (!authToken) {
        throw new Error("No auth token found");
      }

      const sdk = client(env.NEXT_PUBLIC_BACKEND_URL, authToken);

      const response = await sdk.invoice.company[":companyId"].$get({
        param: { companyId },
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

  // Update the last known page count whenever we get new data
  useEffect(() => {
    if (invoices?.totalPages !== undefined) {
      lastPageCount.current = invoices.totalPages;
    }
  }, [invoices?.totalPages]);

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
    pageCount: isLoading ? lastPageCount.current : (invoices?.totalPages ?? 0),
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    manualPagination: true,
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
