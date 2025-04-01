import { Suspense } from "react";
import { TransactionsTable } from "./components/transactions-table";
import { Skeleton } from "@fundlevel/ui/components/skeleton";
import { client } from "@fundlevel/sdk";
import { env } from "@fundlevel/web/env";
import { getTokenCached } from "@fundlevel/web/actions/auth";
import { Label } from "@fundlevel/ui/components/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fundlevel/ui/components/card";
import { format } from "date-fns";
import { formatCurrency } from "@fundlevel/web/lib/utils";

async function BankAccountDetails({ accountId }: { accountId: number }) {
  const token = await getTokenCached();
  if (!token) {
    throw new Error("No token found");
  }

  const resp = await client(env.NEXT_PUBLIC_BACKEND_URL, token)["bank-account"][":id"].$get({
    param: { id: accountId },
  });

  const account = await resp.json();
  if ("error" in account) {
    throw new Error(account.error);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">{account.name}</CardTitle>
          <CardDescription>{account.officialName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold">
                {formatCurrency(account.availableBalance || 0)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-2xl font-bold">
                {formatCurrency(account.currentBalance || 0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-1">
            <p className="text-sm text-muted-foreground">Account Type</p>
            <p className="text-sm text-right capitalize">{account.type}</p>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <p className="text-sm text-muted-foreground">Subtype</p>
            <p className="text-sm text-right capitalize">{account.subtype}</p>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <p className="text-sm text-muted-foreground">Account #</p>
            <p className="text-sm text-right">****{account.mask}</p>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <p className="text-sm text-muted-foreground">Currency</p>
            <p className="text-sm text-right">{account.isoCurrencyCode || "USD"}</p>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <p className="text-sm text-muted-foreground">Last Updated</p>
            {account.updatedAt ? (
              <p className="text-sm text-right">{format(account.updatedAt, "MM/dd/yyyy")}</p>
            ) : (
              <p className="text-sm text-right">N/A</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function BankAccountPage({
  params,
}: { params: Promise<{ accountId: string }> }) {
  const { accountId } = await params;
  const bankAccountId = Number.parseInt(accountId);

  return (
    <div className="space-y-4">
      <Suspense fallback={
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <Skeleton className="h-40 w-full md:w-2/3" />
          <Skeleton className="h-40 w-full md:w-1/3" />
        </div>
      }  >
        <BankAccountDetails accountId={bankAccountId} />
      </Suspense>
      <div className="space-y-4">
        <Label className="text-lg font-bold">Transactions</Label>
        <TransactionsTable bankAccountId={bankAccountId} />
      </div>
    </div>
  );
}
