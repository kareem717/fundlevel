"use client";

import { redirects } from "@fundlevel/web/lib/config/redirects";
import { getTokenCached } from "@fundlevel/web/actions/auth";
import { redirect } from "next/navigation";
import { client } from "@fundlevel/sdk";
import { env } from "@fundlevel/web/env";
import { BankAccountCard } from "./bank-account-card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@fundlevel/ui/components/skeleton";
import { parseAsInteger, useQueryState } from "nuqs";
import { useRef, useEffect } from "react";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTablePagination } from "@fundlevel/ui/components/data-table-pagination";
import { cn } from "@fundlevel/ui/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

interface BankAccountListProps extends ComponentPropsWithoutRef<"div"> {
  companyId: number;
}

export function BankAccountList({
  companyId,
  className,
  ...props
}: BankAccountListProps) {
  const [pageIndex, setPageIndex] = useQueryState(
    "page",
    parseAsInteger.withDefault(0)
  );
  const [pageSize, setPageSize] = useQueryState(
    "limit",
    parseAsInteger.withDefault(10)
  );

  // Keep track of the last known page count
  const lastPageCount = useRef<number>(0);

  const { data: bankAccounts, isPending } = useQuery({
    queryKey: ["bank-accounts", companyId, pageIndex, pageSize],
    queryFn: async () => {
      const token = await getTokenCached();
      if (!token) {
        return redirect(redirects.auth.login);
      }

      const req = await client(env.NEXT_PUBLIC_BACKEND_URL, token)["bank-account"].company[":companyId"].$get({
        query: {
          page: pageIndex,
          pageSize,
          order: "desc",
        },
        param: {
          companyId,
        },
      });

      const result = await req.json();

      if ("error" in result) {
        return {
          data: [],
          totalPages: lastPageCount.current, // Preserve the last known page count on error
        };
      }

      return {
        data: result.data || [],
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        totalRecords: result.totalRecords,
        hasNextPage: result.hasNextPage,
        hasPreviousPage: result.hasPreviousPage,
      };
    },
    // staleTime: 1000 * 60 * 5,
  });

  // Update the last known page count whenever we get new data
  useEffect(() => {
    if (bankAccounts?.totalPages !== undefined) {
      lastPageCount.current = bankAccounts.totalPages;
    }
  }, [bankAccounts?.totalPages]);

  // Create a table instance to handle pagination
  const table = useReactTable({
    data: bankAccounts?.data ?? [],
    columns: [], // We don't need columns for cards but we need the table for pagination
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
    pageCount: isPending ? lastPageCount.current : (bankAccounts?.totalPages ?? 0),
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {isPending ? (
          Array.from({ length: pageSize }).map((_, index) => (
            <Skeleton
              key={`bank-account-skeleton-${index}-${Math.random().toString(36).substring(7)}`}
              className="h-96 w-full"
            />
          ))
        ) : bankAccounts && "data" in bankAccounts ? (
          bankAccounts.data.map((account) => (
            <BankAccountCard key={account.id} account={account} />
          ))
        ) : (
          <p className="text-muted-foreground">No bank accounts found</p>
        )}
      </div>
      <DataTablePagination table={table} showSelectedRowCount={false} />
    </div>
  );
}
