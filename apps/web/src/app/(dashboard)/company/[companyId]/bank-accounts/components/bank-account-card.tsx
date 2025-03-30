import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@fundlevel/ui/components/card";
import type { ComponentPropsWithoutRef } from "react";
import type { BankAccount } from "@fundlevel/db/types";
import { cn } from "@fundlevel/ui/lib/utils";
import { buttonVariants } from "@fundlevel/ui/components/button";
import Link from "next/link";
import { redirects } from "@fundlevel/web/lib/config/redirects";

interface BankAccountCardProps extends ComponentPropsWithoutRef<typeof Card> {
  account: BankAccount;
}

export function BankAccountCard({
  account,
  className,
  ...props
}: BankAccountCardProps) {
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
