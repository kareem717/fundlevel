import { client } from "@fundlevel/sdk";
import { redirect } from "next/navigation";
import { redirects } from "@fundlevel/web/lib/config/redirects";
import { getTokenCached } from "@fundlevel/web/actions/auth";
import { env } from "@fundlevel/web/env";
import { Button } from "@fundlevel/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@fundlevel/ui/components/card";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  FileText,
  MoreHorizontal,
  Printer,
  RefreshCw,
} from "lucide-react";
import { Separator } from "@fundlevel/ui/components/separator";
import Link from "next/link";
import { Badge } from "@fundlevel/ui/components/badge";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@fundlevel/ui/components/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@fundlevel/ui/components/tabs";
import { LineItemsTable } from "./components/line-items-table";
import { TransactionsTable } from "./components/transactions-table";
import { formatCurrency } from "@fundlevel/web/lib/utils";

export default async function AccountingInvoicePage({
  params,
}: { params: Promise<{ companyId: string; invoiceId: string }> }) {
  const { companyId, invoiceId: invoiceIdString } = await params;

  const invoiceId = Number.parseInt(invoiceIdString, 10);

  const token = await getTokenCached();
  if (!token) {
    return redirect(redirects.auth.login);
  }

  const req = await client(
    env.NEXT_PUBLIC_BACKEND_URL,
    token,
  ).invoice[":invoiceId"].$get({
    param: { invoiceId },
  });
  if (!req.ok) {
    throw new Error("Failed to get invoice");
  }

  const invoice = await req.json();

  // Determine invoice status
  const getInvoiceStatus = () => {
    if (invoice.balanceRemaining === 0) {
      return { label: "Paid", variant: "default" as const };
    }
    if (invoice.dueDate && new Date(invoice.dueDate) < new Date()) {
      return { label: "Overdue", variant: "destructive" as const };
    }
    return { label: "Pending", variant: "secondary" as const };
  };

  const invoiceStatus = getInvoiceStatus();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href={redirects.app.company(Number(companyId)).invoices.index}
            className="inline-flex items-center rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Invoices
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4 mr-2" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Invoice Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            href={redirects.app.company(Number(companyId)).invoices.reconcile(Number(invoiceId))}
          >
            <Button>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reconcile
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold">Invoice #{invoice.id}</CardTitle>
                  <CardDescription className="mt-1">
                    {invoice.remoteId && (
                      <span className="flex items-center text-sm text-muted-foreground">
                        <FileText className="h-3.5 w-3.5 mr-1" />
                        External ID: {invoice.remoteId}
                      </span>
                    )}
                  </CardDescription>
                </div>
                <Badge variant={invoiceStatus.variant}>
                  {invoiceStatus.label}
                </Badge>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Invoice Amount</h3>
                    <div className="mt-1 flex items-baseline">
                      <span className="text-2xl font-bold">
                        {formatCurrency(invoice.totalAmount, invoice.currency || undefined)}
                      </span>
                      {invoice.balanceRemaining !== null && invoice.balanceRemaining > 0 && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          {formatCurrency(invoice.balanceRemaining, invoice.currency || undefined)} remaining
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                      <p className="mt-1 flex items-center">
                        <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                        {format(new Date(invoice.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Due Date</h3>
                      <p className="mt-1 flex items-center">
                        <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                        {invoice.dueDate ? format(new Date(invoice.dueDate), "MMM d, yyyy") : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="items">
            <TabsList>
              <TabsTrigger value="items">Line Items</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>
            <TabsContent value="items" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Line Items</CardTitle>
                  <CardDescription>Details of products or services included in this invoice</CardDescription>
                </CardHeader>
                <CardContent>
                  <LineItemsTable invoiceId={invoiceId} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="transactions" className="mt-4">
              <Card className="relative">
                <CardHeader>
                  <CardTitle>Related Transactions</CardTitle>
                  <CardDescription>Banking transactions that may be related to this invoice</CardDescription>
                </CardHeader>
                <CardContent className="mb-20">
                  <TransactionsTable invoiceId={invoiceId} />
                </CardContent>
                <CardFooter className="flex justify-center border-t bg-muted/50 py-4 absolute bottom-0 left-0 w-full">
                  <Link
                    href={redirects.app.company(Number(companyId)).invoices.reconcile(Number(invoiceId))}
                  >
                    <Button variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reconcile Now
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
              <CardDescription>Current payment information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-lg font-medium">{formatCurrency(invoice.totalAmount, invoice.currency || undefined)}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Amount Paid</p>
                  <p className="text-lg font-medium">{formatCurrency(invoice.totalAmount - (invoice.balanceRemaining || 0), invoice.currency || undefined)}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Balance Remaining</p>
                  <p className="text-lg font-bold">{formatCurrency(invoice.balanceRemaining || 0, invoice.currency || undefined)}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 flex flex-col items-stretch gap-2">
              <Link
                href={redirects.app.company(Number(companyId)).invoices.reconcile(Number(invoiceId))}
                className="w-full"
              >
                <Button variant="outline" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Find Matching Transactions
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Activity</CardTitle>
              <CardDescription>Recent actions and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(invoice.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
                {invoice.updatedAt && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Last Modified</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(invoice.updatedAt), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
