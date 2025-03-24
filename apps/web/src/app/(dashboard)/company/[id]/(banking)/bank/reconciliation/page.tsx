import { client } from "@fundlevel/sdk";
import { ReconciliationClient } from "./components/reconciliation-client";
import { redirect } from "next/navigation";
import { redirects } from "@fundlevel/web/lib/config/redirects";
import { getTokenCached } from "@fundlevel/web/actions/auth";
import { env } from "@fundlevel/web/env";

export default async function ReconciliationPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const companyId = Number.parseInt(id, 10);

  const token = await getTokenCached();
  if (!token) {
    return redirect(redirects.auth.login)
  }

  const req = await client(env.NEXT_PUBLIC_BACKEND_URL, token).accounting["bank-accounts"].company[":companyId"].$get({ param: { companyId } });
  if (!req.ok) {
    throw new Error("Failed to fetch bank accounts");
  }

  const bankAccounts = await req.json();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold mb-6">Transaction Reconcili ation</h1>
      <p className="text-muted-foreground mb-8">
        Reconcile your bank transactions with invoices automatically using AI.
      </p>

      <ReconciliationClient bankAccounts={bankAccounts} />
    </div>
  );
}
