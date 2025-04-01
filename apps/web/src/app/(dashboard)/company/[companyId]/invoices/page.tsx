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
  );
}
