import { BankAccountList } from "./components/bank-account-list";
import { Button } from "@fundlevel/ui/components/button";
import { Badge } from "@fundlevel/ui/components/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fundlevel/ui/components/card";
import { Plus, RefreshCw, Filter, Link as LinkIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@fundlevel/ui/components/tabs";
import { Separator } from "@fundlevel/ui/components/separator";

export default async function BankAccountsPage({
  params,
}: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;
  const parsedId = Number.parseInt(companyId, 10);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Bank Accounts</h1>
          <p className="text-sm text-muted-foreground">
            View your linked bank accounts and financial transactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Link Account
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Accounts</TabsTrigger>
            <TabsTrigger value="checking">
              Checking
              <Badge variant="secondary" className="ml-2 py-0 px-1.5">2</Badge>
            </TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
            <TabsTrigger value="credit">
              Credit Cards
              <Badge variant="outline" className="ml-2 py-0 px-1.5">1</Badge>
            </TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>All Bank Accounts</CardTitle>
                  <CardDescription>Manage your linked financial accounts</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <LinkIcon className="h-3 w-3" />
                    Connected
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <BankAccountList companyId={parsedId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checking" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Checking Accounts</CardTitle>
              <CardDescription>Your primary business checking accounts</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <BankAccountList companyId={parsedId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="savings" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Savings Accounts</CardTitle>
              <CardDescription>Interest-earning savings accounts</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <BankAccountList companyId={parsedId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credit" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Credit Cards</CardTitle>
              <CardDescription>Business credit cards and lines of credit</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <BankAccountList companyId={parsedId} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
