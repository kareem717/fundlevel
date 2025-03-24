import { redirects } from "@fundlevel/web/lib/config/redirects";
import { buttonVariants } from "@fundlevel/ui/components/button";
import Link from "next/link";
import { cn } from "@fundlevel/ui/lib/utils";
import { getTokenCached } from "@fundlevel/web/actions/auth"
import { redirect } from "next/navigation";
import { client } from "@fundlevel/sdk";
import { env } from "@fundlevel/web/env";

export default async function BankAccountsPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const companyId = Number.parseInt(id, 10);

  const token = await getTokenCached()
  if (!token) {
    return redirect(redirects.auth.login)
  }

  const req = await client(env.NEXT_PUBLIC_BACKEND_URL, token).accounting["bank-accounts"].company[":companyId"].$get({ param: { companyId } });

  if (!req.ok) {
    throw new Error("Failed to fetch bank accounts");
  }

  const bankAccounts = await req.json();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold mb-2">Bank Accounts</h1>
        <p className="text-muted-foreground">
          Manage your linked account and view financial data
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {bankAccounts.length > 0 ? (
          bankAccounts.map((account) => (
            <pre
              key={account.remoteId}
              className="bg-muted p-4 rounded-md gap-4 flex flex-col overflow-hidden"
            >
              {JSON.stringify(account, null, 2)}
              <Link
                href={redirects.app
                  .company(companyId)
                  .bank.transactions(account.remoteId)}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                View Transactions
              </Link>
            </pre>
          ))
        ) : (
          <p className="text-muted-foreground">No bank accounts found</p>
        )}
      </div>
    </div>
  );
}
