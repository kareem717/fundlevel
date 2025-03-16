import { getCompanyByIdAction } from "@/actions/company";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@fundlevel/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@fundlevel/ui/components/tabs";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { LinkPlaidButton } from "./components/link-plaid-button";
import { LinkQuickBooksButton } from "./components/link-quick-books-button";
import Link from "next/link";
import { redirects } from "@/lib/config/redirects";
import { buttonVariants } from "@fundlevel/ui/components/button";

export default async function CompanyPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsedId = Number.parseInt(id, 10);

  if (Number.isNaN(parsedId)) {
    return notFound();
  }

  const company = (await getCompanyByIdAction(parsedId))?.data;

  if (!company) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{company.name}</h1>
          <p className="text-muted-foreground">
            Manage your linked account and view financial data
          </p>
        </div>
        <div className="flex gap-3">
          <LinkPlaidButton companyId={company.id} variant="outline" />
          <LinkQuickBooksButton companyId={company.id} variant="default" />
          <Link
            href={redirects.app.company(company.id).reconciliation}
            className={buttonVariants({ variant: "outline" })}
          >
            Reconcile
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Details about your linked account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    ID
                  </p>
                  <p>{company.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Name
                  </p>
                  <p>{company.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Connected on
                  </p>
                  <p>{format(new Date(company.created_at), "PPP")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Last updated
                  </p>
                  <p>
                    {company.updated_at
                      ? format(new Date(company.updated_at), "PPP")
                      : "Never"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="invoices" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>View and manage your invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Invoice data will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>View your transaction history</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Transaction data will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Settings will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
