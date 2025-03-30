import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@fundlevel/ui/components/card";
import { Badge } from "@fundlevel/ui/components/badge";
import { AlertCircle, ArrowUpDown, DollarSign } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import type { PlaidBankAccount } from "@fundlevel/db/types";
import { cn } from "@fundlevel/ui/lib/utils";
import { useAuth } from "@fundlevel/web/components/providers/auth-provider";
import { useQuery } from "@tanstack/react-query";
import { client } from "@fundlevel/sdk";
import { env } from "@fundlevel/web/env";
import { Skeleton } from "@fundlevel/ui/components/skeleton";
import { Button, buttonVariants } from "@fundlevel/ui/components/button";
import { RefreshCcw } from "lucide-react";
import Link from "next/link";
import { redirects } from "@fundlevel/web/lib/config/redirects";
interface BankAccountCardProps extends ComponentPropsWithoutRef<typeof Card> {
  account: PlaidBankAccount;
}

export function BankAccountCard({
  account,
  className,
  ...props
}: BankAccountCardProps) {
  const { authToken } = useAuth();
  if (!authToken) {
    throw new Error("No auth token found");
  }

  const {
    data: details,
    isPending,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["bank-account-transaction-details", account.remoteId],
    queryFn: async () => {
      const resp = await client(
        env.NEXT_PUBLIC_BACKEND_URL,
        authToken,
      ).accounting["bank-accounts"][":bankAccountId"][
        "transaction-details"
      ].$get({ param: { bankAccountId: account.remoteId } });
      if (!resp.ok) {
        throw new Error("Failed to fetch bank account transaction details");
      }

      return await resp.json();
    },
    staleTime: Number.POSITIVE_INFINITY,
  });

  const unaccountedPercentage = details?.unaccountedPercentage || 0;
  const unaccountedAmount = details?.unaccountedAmount || 0;
  const totalVolume = details?.totalVolume || 0;
  const accountedAmount = details?.accountedAmount || 0;
  const isLoading = isPending || isRefetching;

  return (
    <Card className={cn("overflow-hidden relative", className)} {...props}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold">{account.name}</CardTitle>
            <CardDescription className="mt-1">
              {account.officialName || account.subtype} •{" "}
              {account.mask ? `••••${account.mask}` : ""}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCcw
                className={cn("h-4 w-4", isLoading && "animate-spin")}
              />
            </Button>
            <Link
              href={redirects.app
                .company(account.companyId)
                .bankAccounts.show(account.remoteId)}
              prefetch={true}
              className={buttonVariants({
                size: "sm",
              })}
            >
              View
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="mb-12 h-full flex flex-col justify-between gap-8">
        <div>
          <div className="text-sm text-muted-foreground">Current Balance</div>
          <div className="text-2xl font-bold">
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: account.isoCurrencyCode || "USD",
            }).format(account.currentBalance || 0)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Last updated:{" "}
            {account.updatedAt
              ? new Date(account.updatedAt).toLocaleString()
              : "N/A"}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-16 text-muted-foreground" />
              <span className="text-sm">Total Transaction Volume</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-4 w-16" />
            ) : (
              <Badge variant="outline" className="font-mono">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: account.isoCurrencyCode || "USD",
                }).format(totalVolume)}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-16 text-muted-foreground" />
              <span className="text-sm">In Fundlevel</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-4 w-16" />
            ) : (
              <Badge variant="outline" className="font-mono">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: account.isoCurrencyCode || "USD",
                }).format(accountedAmount)}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-16 text-muted-foreground" />
              <span className="text-sm">Unreconciled</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-4 w-16" />
            ) : (
              <Badge variant="outline" className="font-mono">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: account.isoCurrencyCode || "USD",
                }).format(unaccountedAmount)}
              </Badge>
            )}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm">Reconciliation Progress</span>
            {isLoading ? (
              <Skeleton className="h-4 w-4" />
            ) : (
              <span className="text-xs font-medium">
                {unaccountedPercentage}%
              </span>
            )}
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            {isLoading ? (
              <Skeleton className="h-2 w-full" />
            ) : (
              <div
                className={cn(
                  "h-full rounded-full",
                  unaccountedPercentage < 50
                    ? "bg-destructive"
                    : unaccountedPercentage < 80
                      ? "bg-amber-500"
                      : "bg-emerald-500",
                )}
                style={{ width: `${unaccountedPercentage}%` }}
              />
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="borde r-t bg-muted/50 px-6 py-3 absolute bottom-0 w-full h-12 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Account Type: {account.type}
        </span>
        <span className="text-xs font-medium">Subtype: {account.subtype}</span>
      </CardFooter>
    </Card>
  );
}
