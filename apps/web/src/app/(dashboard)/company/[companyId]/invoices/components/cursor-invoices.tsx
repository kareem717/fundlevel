"use client";

import { client } from "@fundlevel/sdk";
import { redirects } from "@fundlevel/web/lib/config/redirects";
import { redirect } from "next/navigation";
import { getTokenCached } from "@fundlevel/web/actions/auth";
import Link from "next/link";
import { buttonVariants } from "@fundlevel/ui/components/button";
import { cn } from "@fundlevel/ui/lib/utils";
import { env } from "@fundlevel/web/env";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Skeleton } from "@fundlevel/ui/components/skeleton";
import { useEffect, useRef } from "react";

interface CursorInvoicesProps {
  companyId: number;
}

export function CursorInvoices({
  companyId,
}: CursorInvoicesProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['invoices', companyId],
    queryFn: async ({ pageParam }) => {
      const token = await getTokenCached();
      if (!token) {
        return redirect(redirects.auth.login);
      }

      const req = await client(
        env.NEXT_PUBLIC_BACKEND_URL,
        token,
      ).accounting.companies[":companyId"].invoices.$get({
        param: {
          companyId,
        },
        query: {
          cursor: pageParam,
          limit: 10,
        },
      });
      if (!req.ok) {
        throw new Error("Failed to get invoices");
      }

      const res = await req.json();
      return res;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (status === "error") {
    return <div className="text-destructive">Error: {error.message}</div>;
  }

  const invoices = data?.pages.flatMap((page) => page.invoices) ?? [];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {invoices.length > 0 ? (
          <>
            {invoices.map((invoice) => (
              <pre
                key={invoice.id}
                className="bg-muted p-4 rounded-md gap-4 flex flex-col overflow-auto max-h-60"
              >
                {JSON.stringify(invoice, null, 2)}
                <Link
                  href={redirects.app
                    .company(companyId)
                    .invoices.show(invoice.id.toString())}
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  View Invoice
                </Link>
              </pre>
            ))}
            {(isFetching || isFetchingNextPage) &&
              [1, 2, 3].map((num) => (
                <div key={`loading-skeleton-${num}`} className="bg-muted p-4 rounded-md gap-4 flex flex-col overflow-hidden">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              ))
            }
          </>
        ) : status === "pending" ?
          [1, 2, 3, 4, 5, 6].map((num) => (
            <div key={`initial-skeleton-${num}`} className="bg-muted p-4 rounded-md gap-4 flex flex-col overflow-hidden">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))
          : (
            <p className="text-muted-foreground">No invoices found</p>
          )}
      </div>
      <div ref={observerTarget} className="h-4 w-full" />
    </div>
  );
}
