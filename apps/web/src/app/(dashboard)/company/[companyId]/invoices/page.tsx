import { InvoiceTable } from "./components/invoice-table";
import { Button } from "@fundlevel/ui/components/button";
import { CalendarIcon, Download, Filter, Plus, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fundlevel/ui/components/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@fundlevel/ui/components/tabs";
import { Separator } from "@fundlevel/ui/components/separator";
import { Badge } from "@fundlevel/ui/components/badge";

interface InvoicesPageProps {
  params: Promise<{
    companyId: string;
  }>;
}

export default async function InvoicesPage({ params }: InvoicesPageProps) {
  const { companyId } = await params;

  const parsedCompanyId = Number.parseInt(companyId, 10);
  if (Number.isNaN(parsedCompanyId)) {
    throw new Error("Invalid company ID");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
          <p className="text-sm text-muted-foreground">
            View, manage, and reconcile your company invoices with transactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Invoices</TabsTrigger>
            <TabsTrigger value="pending">
              Pending
              <Badge variant="secondary" className="ml-2 py-0 px-1.5">24</Badge>
            </TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="overdue">
              Overdue
              <Badge variant="destructive" className="ml-2 py-0 px-1.5">5</Badge>
            </TabsTrigger>
          </TabsList>
          <Button variant="ghost" size="sm" className="gap-1">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>All Invoices</CardTitle>
                  <CardDescription>Manage your invoice records and reconciliations</CardDescription>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <InvoiceTable companyId={parsedCompanyId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Pending Invoices</CardTitle>
              <CardDescription>Invoices that are awaiting payment</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <InvoiceTable companyId={parsedCompanyId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paid" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Paid Invoices</CardTitle>
              <CardDescription>Invoices that have been fully paid</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <InvoiceTable companyId={parsedCompanyId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Overdue Invoices</CardTitle>
              <CardDescription>Invoices that are past their due date</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <InvoiceTable companyId={parsedCompanyId} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
