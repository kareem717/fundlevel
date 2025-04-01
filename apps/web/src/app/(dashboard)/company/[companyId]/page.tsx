import { redirect } from "next/navigation";
import { redirects } from "@fundlevel/web/lib/config/redirects";
import { getTokenCached } from "@fundlevel/web/actions/auth";
import { client } from "@fundlevel/sdk";
import { env } from "@fundlevel/web/env";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fundlevel/ui/components/card";
import { Button } from "@fundlevel/ui/components/button";
import { ArrowUpRight, Building, ChevronRight, CreditCard, DollarSign, FileText, MoreHorizontal, PiggyBank, Wallet } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@fundlevel/ui/components/badge";
import { formatCurrency } from "@fundlevel/web/lib/utils";

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

  // Mock data for demo - would be replaced with real API data
  const accountsData = {
    checking: { balance: 42500, transactions: 23, reconciled: 21 },
    savings: { balance: 125000, transactions: 5, reconciled: 5 },
    credit: { balance: -3200, transactions: 17, reconciled: 14 }
  };

  const recentActivity = [
    { id: 1, type: 'invoice', title: 'New invoice created', amount: 1200, date: new Date(), status: 'pending' },
    { id: 2, type: 'payment', title: 'Payment received', amount: 3500, date: new Date(Date.now() - 86400000), status: 'completed' },
    { id: 3, type: 'transaction', title: 'Bank transaction imported', amount: -850, date: new Date(Date.now() - 172800000), status: 'reconciled' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
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
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4 mr-1" />
            Actions
          </Button>
          <Button size="sm" asChild>
            <Link href={redirects.app.company(parsedId).settings.connections}>
              <Building className="h-4 w-4 mr-1" />
              Connections
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <CardDescription>Across all accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(accountsData.checking.balance + accountsData.savings.balance - Math.abs(accountsData.credit.balance))}</div>
            <div className="flex items-center gap-2 mt-2 text-sm">
              <span className="text-green-500 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                8.2%
              </span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Linked Accounts</CardTitle>
            <CardDescription>Banking & credit cards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-muted-foreground">
                {accountsData.checking.transactions + accountsData.savings.transactions + accountsData.credit.transactions} transactions this month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reconciliation</CardTitle>
            <CardDescription>Transaction matching status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round(((accountsData.checking.reconciled + accountsData.savings.reconciled + accountsData.credit.reconciled) /
                (accountsData.checking.transactions + accountsData.savings.transactions + accountsData.credit.transactions)) * 100)}%
            </div>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-muted-foreground">
                {(accountsData.checking.transactions + accountsData.savings.transactions + accountsData.credit.transactions) -
                  (accountsData.checking.reconciled + accountsData.savings.reconciled + accountsData.credit.reconciled)} transactions need review
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Linked Accounts</h2>
          <div className="grid gap-4">
            <Card className="overflow-hidden">
              <div className="border-l-4 border-blue-500 pl-4 py-4 pr-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-950 p-2 rounded-full">
                    <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Main Checking</h3>
                    <p className="text-sm text-muted-foreground">Bank of America</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(accountsData.checking.balance)}</div>
                  <div className="text-sm text-muted-foreground">{accountsData.checking.transactions} transactions</div>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/company/${parsedId}/bank-accounts/1`}>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="border-l-4 border-green-500 pl-4 py-4 pr-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 dark:bg-green-950 p-2 rounded-full">
                    <PiggyBank className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Business Savings</h3>
                    <p className="text-sm text-muted-foreground">Bank of America</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(accountsData.savings.balance)}</div>
                  <div className="text-sm text-muted-foreground">{accountsData.savings.transactions} transactions</div>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/company/${parsedId}/bank-accounts/2`}>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="border-l-4 border-red-500 pl-4 py-4 pr-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 dark:bg-red-950 p-2 rounded-full">
                    <CreditCard className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Business Credit Card</h3>
                    <p className="text-sm text-muted-foreground">American Express</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-red-500">-{formatCurrency(Math.abs(accountsData.credit.balance))}</div>
                  <div className="text-sm text-muted-foreground">{accountsData.credit.transactions} transactions</div>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/company/${parsedId}/bank-accounts/3`}>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>

            <Button variant="outline" className="mt-2" asChild>
              <Link href={redirects.app.company(parsedId).settings.connections}>
                <Building className="h-4 w-4 mr-2" />
                Connect more accounts
              </Link>
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="px-4 py-3 flex items-start justify-between hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full mt-0.5 ${activity.type === 'invoice' ? 'bg-purple-100 dark:bg-purple-950' :
                        activity.type === 'payment' ? 'bg-green-100 dark:bg-green-950' :
                          'bg-blue-100 dark:bg-blue-950'
                        }`}>
                        {activity.type === 'invoice' ? <FileText className="h-3 w-3 text-purple-600 dark:text-purple-400" /> :
                          activity.type === 'payment' ? <DollarSign className="h-3 w-3 text-green-600 dark:text-green-400" /> :
                            <Building className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                        }
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{format(activity.date, 'MMM d, yyyy')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${activity.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {activity.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(activity.amount))}
                      </p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="sm" className="justify-start">
                <FileText className="h-4 w-4 mr-2" />
                View Invoices
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Building className="h-4 w-4 mr-2" />
                Bank Connections
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <DollarSign className="h-4 w-4 mr-2" />
                Payments
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <CreditCard className="h-4 w-4 mr-2" />
                Expenses
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
