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
import { PlaidBankAccount } from "@fundlevel/db/types";
import { cn } from "@fundlevel/ui/lib/utils";

interface BankAccountCardProps extends ComponentPropsWithoutRef<typeof Card> {
  account: PlaidBankAccount & {
    inFundlevel: number;
    unReconciled: number;
    totalTransactionVolume: number;
  };
}

export function BankAccountCard({
  account,
  className,
  ...props
}: BankAccountCardProps) {
  const formattedBalance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: account.isoCurrencyCode || "USD",
  }).format(account.currentBalance || 0);

  const classificationPercentage =
    Math.round(
      ((account.totalTransactionVolume - account.unReconciled) /
        account.totalTransactionVolume) *
        100,
    ) || 0;

  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold">{account.name}</CardTitle>
            <CardDescription className="mt-1">
              {account.officialName || account.subtype} •{" "}
              {account.mask ? `••••${account.mask}` : ""}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">Current Balance</div>
            <div className="text-2xl font-bold">{formattedBalance}</div>
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
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Total Transaction Volume</span>
              </div>
              <Badge variant="outline" className="font-mono">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: account.isoCurrencyCode || "USD",
                }).format(account.totalTransactionVolume)}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">In Fundlevel</span>
              </div>
              <Badge variant="outline" className="font-mono">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: account.isoCurrencyCode || "USD",
                }).format(account.inFundlevel)}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Unreconciled</span>
              </div>
              <Badge variant="outline" className="font-mono">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: account.isoCurrencyCode || "USD",
                }).format(account.unReconciled)}
              </Badge>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">Reconciliation Progress</span>
              <span className="text-xs font-medium">
                {classificationPercentage}%
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full",
                  classificationPercentage < 50
                    ? "bg-destructive"
                    : classificationPercentage < 80
                      ? "bg-amber-500"
                      : "bg-emerald-500",
                )}
                style={{ width: `${classificationPercentage}%` }}
              />
            </div>
            {account.unReconciled > 0 && (
              <div className="flex items-center gap-1 mt-2 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                <span>
                  {new Intl.NumberFormat("en-US", {
                    currency: account.isoCurrencyCode || "USD",
                    style: "currency",
                  }).format(account.unReconciled)}{" "}
                  needs reconciliation
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-3">
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-muted-foreground">
            Account Type: {account.type}
          </span>
          <span className="text-xs font-medium">
            Subtype: {account.subtype}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
