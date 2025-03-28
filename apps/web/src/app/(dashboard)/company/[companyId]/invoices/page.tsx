import { CursorInvoices } from "./components/cursor-invoices";

export default async function InvoicesPage({
  params,
}: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;
  const parsedId = Number.parseInt(companyId, 10);

  return (
    <div>
      <h1>Invoices</h1>
      <CursorInvoices companyId={parsedId} />
    </div>
  );
}
