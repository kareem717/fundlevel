import { ReconcilationClient } from "./components/reconcilation-client";

export default async function ReconcileInvoicePage({
  params,
}: {
  params: Promise<{
    invoiceId: string;
  }>;
}) {
  const { invoiceId } = await params;

  const parsedInvoiceId = Number.parseInt(invoiceId, 10);
  if (Number.isNaN(parsedInvoiceId)) {
    throw new Error("Invalid invoice ID");
  }

  return (
    <div>
      <ReconcilationClient invoiceId={parsedInvoiceId} />
    </div>
  );
}
