import { client } from "@fundlevel/sdk";
import { redirects } from "@fundlevel/web/lib/config/redirects";
import { redirect } from "next/navigation";
import { getTokenCached } from "@fundlevel/web/actions/auth";
import Link from "next/link";
import { buttonVariants } from "@fundlevel/ui/components/button";
import { cn } from "@fundlevel/ui/lib/utils";
import { env } from "@fundlevel/web/env";
export default async function TransactionsPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const companyId = Number.parseInt(id, 10);
  const token = await getTokenCached();
  if (!token) {
    return redirect(redirects.auth.login);
  }

  const req = await client(
    env.NEXT_PUBLIC_BACKEND_URL,
    token,
  ).accounting.companies[":companyId"].transactions.$get({
    param: { companyId },
  });
  if (!req.ok) {
    throw new Error("Failed to get transactions");
  }

  const transactions = await req.json();

  return (
    <div>
      <h1>Transactions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <pre
              key={transaction.id}
              className="bg-muted p-4 rounded-md gap-4 flex flex-col overflow-hidden"
            >
              {JSON.stringify(transaction, null, 2)}
              <Link
                href={redirects.app
                  .company(companyId)
                  .accounting.transaction(transaction.id.toString())}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                View Transaction
              </Link>
            </pre>
          ))
        ) : (
          <p className="text-muted-foreground">No transactions found</p>
        )}
      </div>
    </div>
  );
}
