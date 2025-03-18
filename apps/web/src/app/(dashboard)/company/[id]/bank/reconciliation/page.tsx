import { getBankAccountsByCompanyIdAction } from "@/actions/accounting";
import { ReconciliationClient } from "./components/reconciliation-client";

// Server Component - receives params directly from Next.js
export default async function ReconciliationPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const companyId = Number.parseInt(id, 10);

  const bankAccounts = (await getBankAccountsByCompanyIdAction(companyId))?.data || [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold mb-6">Transaction Reconciliation</h1>
      <p className="text-muted-foreground mb-8">
        Reconcile your bank transactions with invoices automatically using AI.
      </p>

      <ReconciliationClient bankAccounts={bankAccounts} />
    </div>
  );
}
