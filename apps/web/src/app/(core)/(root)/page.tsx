import { getCompaniesAction } from "@/actions/company";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@fundlevel/ui/components/card";
import Link from "next/link";
import { format } from "date-fns";
import { redirects } from "@/lib/config/redirects";
import { LinkIcon } from "lucide-react";
import { CreateCompanyDialog } from "./components/create-company-dialog";
import { env } from "@/env";
export default async function DashboardPage() {
  const companies = (await getCompaniesAction())?.data || [];

  return (
    <div className="container py-8 mx-auto">
      <div className="mb-6">
        <CreateCompanyDialog />
      </div>
      {companies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((account) => (
            <Link
              key={account.id}
              href={redirects.app.company(account.id).root}
            >
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {account.name}
                  </CardTitle>
                  <CardDescription>
                    Connected on{" "}
                    {format(new Date(account.created_at), "MMM d, yyyy")}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-muted rounded-full p-6 mb-4">
            <LinkIcon className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No accounts linked yet</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            Connect your financial accounts to get started with FundLevel. Link
            your first account to begin tracking your finances.
          </p>
          <CreateCompanyDialog />
        </div>
      )}
    </div>
  );
}
