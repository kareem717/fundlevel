import { redirect } from "next/navigation";
import { redirects } from "@fundlevel/web/lib/config/redirects";
import { getTokenCached } from "@fundlevel/web/actions/auth";
import { client } from "@fundlevel/sdk";
import { env } from "@fundlevel/web/env";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@fundlevel/ui/components/card";
import { Button, buttonVariants } from "@fundlevel/ui/components/button";
import { Building, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Badge } from "@fundlevel/ui/components/badge";
import { formatCurrency } from "@fundlevel/web/lib/utils";
import { Suspense } from "react";
import { Skeleton } from "@fundlevel/ui/components/skeleton";
import { generate } from "shortid";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@fundlevel/ui/components/table";
import { cn } from "@fundlevel/ui/lib/utils";

async function BankBalance({ companyId }: { companyId: number }) {
  const token = await getTokenCached();
  if (!token) {
    return redirect(redirects.auth.login);
  }

  const resp = await client(env.NEXT_PUBLIC_BACKEND_URL, token)[
    "bank-account"
  ].company[":companyId"].balance.$get({ param: { companyId } });

  if (resp.status !== 200) {
    throw new Error(`Failed to fetch company, status: ${resp.status}`);
  }

  const data = await resp.json();

  return (
    <div className="grid grid-cols-3 [&>*]:flex [&>*]:flex-col">
      <div>
        <span className="text-sm text-muted-foreground">Available Balance</span>
        <div className="text-3xl font-bold">
          {formatCurrency(data.availableBalance)}
        </div>
      </div>
      <div>
        <span className="text-sm text-muted-foreground">Current Balance</span>
        <div className="text-3xl font-bold">
          {formatCurrency(data.currentBalance)}
        </div>
      </div>
      <div>
        <span className="text-sm text-muted-foreground">Ratio</span>
        <div className="text-3xl font-bold">
          {Math.round((data.availableBalance / data.currentBalance) * 100)}%
        </div>
      </div>
    </div>
  );
}

async function RecentTransactions({ companyId }: { companyId: number }) {
  const token = await getTokenCached();
  if (!token) {
    return redirect(redirects.auth.login);
  }

  const resp = await client(env.NEXT_PUBLIC_BACKEND_URL, token)[
    "bank-transaction"
  ].company[":companyId"].$get({
    param: { companyId },
    query: {
      page: 0,
      pageSize: 5,
      order: "desc",
      sortBy: "date",
    },
  });

  if (resp.status !== 200) {
    throw new Error(`Failed to fetch company, status: ${resp.status}`);
  }

  const { data } = await resp.json();

  return (
    <>
      {data.map((transaction) => (
        <TableRow key={transaction.id}>
          <TableCell className="font-medium">{transaction.date}</TableCell>
          <TableCell>{transaction.code}</TableCell>
          <TableCell>{transaction.name}</TableCell>
          <TableCell className="text-right">
            {formatCurrency(
              transaction.amount,
              transaction.isoCurrencyCode || undefined,
            )}
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

async function BankAccounts({ companyId }: { companyId: number }) {
  const token = await getTokenCached();
  if (!token) {
    return redirect(redirects.auth.login);
  }

  const resp = await client(env.NEXT_PUBLIC_BACKEND_URL, token)[
    "bank-account"
  ].company[":companyId"].$get({
    param: { companyId },
    query: {
      page: 0,
      pageSize: 3,
      order: "desc",
      sortBy: "transactions",
    },
  });

  if (resp.status !== 200) {
    throw new Error(`Failed to fetch company, status: ${resp.status}`);
  }

  const { data } = await resp.json();

  return (
    <>
      {data.map((account) => (
        <TableRow key={account.id}>
          <TableCell className="font-medium">{account.name}</TableCell>
          <TableCell>{account.type}</TableCell>
          <TableCell>{account.subtype}</TableCell>
          <TableCell className="text-right">
            {formatCurrency(
              account.currentBalance || 0,
              account.isoCurrencyCode || undefined,
            )}
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default async function CompanyPage({
  params,
}: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;
  const parsedId = Number.parseInt(companyId, 10);

  const token = await getTokenCached();
  if (!token) {
    return redirect(redirects.auth.login);
  }

  const resp = await client(env.NEXT_PUBLIC_BACKEND_URL, token).company[
    ":companyId"
  ].$get({ param: { companyId: parsedId } });

  if (resp.status !== 200) {
    throw new Error(`Failed to fetch company, status: ${resp.status}`);
  }

  const company = await resp.json();

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">{company.name}</h1>
          <Badge variant="outline" className="ml-2 h-6">
            {"Business"}
          </Badge>
        </div>
        <p className="text-muted-foreground mt-2">
          Dashboard overview and financial summary
        </p>
      </div>

      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          <CardDescription>Across all accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={
              <div className="grid grid-cols-3 divide-x">
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-muted-foreground">
                    Available Balance
                  </span>
                  <div className="text-3xl font-bold">
                    <Skeleton className="h-10 w-24" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-muted-foreground">
                    Current Balance
                  </span>
                  <div className="text-3xl font-bold">
                    <Skeleton className="h-10 w-24" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-muted-foreground">
                    Current Balance
                  </span>
                  <div className="text-3xl font-bold">
                    <Skeleton className="h-10 w-24" />
                  </div>
                </div>
              </div>
            }
          >
            <BankBalance companyId={parsedId} />
          </Suspense>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Bank Accounts
              <Link
                href={redirects.app.company(parsedId).bankAccounts.index}
                className={buttonVariants({ variant: "outline", size: "sm" })}
                prefetch={true}
              >
                <Building className="h-4 w-4 mr-1" />
                View All
              </Link>
            </CardTitle>
            <CardDescription>Banking & credit cards</CardDescription>
          </CardHeader>
          <CardContent className="h-full">
            <Table className="w-full h-full">
              <TableCaption>Banking & credit cards</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Subtype</TableHead>
                  <TableHead className="text-right">Current Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="h-full">
                <Suspense
                  fallback={Array.from({ length: 3 }).map(() => (
                    <TableRow key={generate()}>
                      <TableCell className="font-medium">
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    </TableRow>
                  ))}
                >
                  <BankAccounts companyId={parsedId} />
                </Suspense>
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Link
              href={redirects.app.company(parsedId).connections.banking}
              className={cn(buttonVariants({ size: "sm" }), "w-full")}
              prefetch={true}
            >
              <Building className="h-4 w-4 mr-2" />
              Connect more accounts
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Transactions
            </CardTitle>
            <CardDescription>
              Recent transactions from all accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="h-full">
            <Table className="w-full h-full">
              <TableCaption>A list of your recent transactions.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="h-full">
                <Suspense
                  fallback={Array.from({ length: 3 }).map(() => (
                    <TableRow key={generate()}>
                      <TableCell className="font-medium">
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    </TableRow>
                  ))}
                >
                  <RecentTransactions companyId={parsedId} />
                </Suspense>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
