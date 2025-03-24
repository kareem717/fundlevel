import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@fundlevel/ui/components/card";
import Link from "next/link";
import { format } from "date-fns";
import { redirects } from "@fundlevel/web/lib/config/redirects";
import { StoreIcon } from "lucide-react";
import { CreateCompanyDialog } from "./components/create-company-dialog";
import { client } from "@fundlevel/sdk";
import { redirect } from "next/navigation";
import { getTokenCached } from "@fundlevel/web/actions/auth";
import { env } from "@fundlevel/web/env";

export default async function DashboardPage() {
  const token = await getTokenCached()
  if (!token) {
    return redirect(redirects.auth.login)
  }

  const req = await client(env.NEXT_PUBLIC_BACKEND_URL, token).company.$get();
  if (!req.ok) {
    throw new Error("Failed to get companies")
  }

  const companies = await req.json();

  return (
    <div className="py-8 mx-auto w-full">
      <div className="mb-6 flex justify-between">
        {/* <SearchCommand /> */}
        <CreateCompanyDialog />
      </div>
      {companies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <Link
              key={company.id}
              href={redirects.app.company(company.id).root}
            >
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {company.name}
                  </CardTitle>
                  <CardDescription>
                    Connected on{" "}
                    {format(new Date(company.createdAt), "MMM d, yyyy")}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-muted rounded-full p-6 mb-4">
            <StoreIcon className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No companies yet</h2>
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
