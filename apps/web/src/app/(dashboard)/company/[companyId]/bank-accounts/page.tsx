import { BankAccountList } from "./components/bank-account-list";
import { Button, buttonVariants } from "@fundlevel/ui/components/button";
import { Badge } from "@fundlevel/ui/components/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fundlevel/ui/components/card";
import { Plus, RefreshCw, Filter, Link as LinkIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@fundlevel/ui/components/tabs";
import { Separator } from "@fundlevel/ui/components/separator";
import { redirects } from "@fundlevel/web/lib/config/redirects";
import Link from "next/link";

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
        <Link href={redirects.app.company(parsedId).connections.banking} className={buttonVariants({ size: "sm" })} prefetch={true}>
          <Plus className="mr-2 h-4 w-4" />
          Link Account
        </Link>
      </div>
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
    </div>
  );
}
