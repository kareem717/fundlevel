"use client";

import type { ComponentPropsWithoutRef } from "react";
import { redirects } from "@fundlevel/web/lib/config/redirects";
import Link from "next/link";
import { useUserCompanies } from "@fundlevel/web/hooks/use-user-companies";
import { CreateCompanyDialog } from "./create-company-dialog";
import { Card, CardHeader, CardTitle, CardDescription } from "@fundlevel/ui/components/card";
import { format } from "date-fns";
import { StoreIcon } from "lucide-react";
import { Skeleton } from "@fundlevel/ui/components/skeleton";
import { useIsMobile } from "@fundlevel/ui/hooks/use-mobile";
import { generate } from "shortid";

export function CompanyGrid({
  ...props
}: ComponentPropsWithoutRef<"div">) {
  const { data, isFetching } = useUserCompanies();
  const isMobile = useIsMobile();

  return (
    <div {...props}>
      {isFetching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: isMobile ? 3 : 6 }).map(() => (
            <Skeleton key={generate()} className="w-full h-full" />
          ))}
        </div>
      ) : data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((company) => (
            <Link
              key={company.id}
              href={redirects.app.company(company.id).root}
              prefetch={true}
            >
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {company.name}
                  </CardTitle>
                  <CardDescription>
                    Connected on{" "}
                    {format(new Date(company.createdAt), "MMM d, yyyy")}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-muted rounded-full p-6 mb-4">
            <StoreIcon className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No companies yet</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            Connect your financial accounts to get started with FundLevel. Link
            your first account to begin tracking your finances.
          </p>
          <CreateCompanyDialog />
        </div>
      )}
    </div>
  );
}
