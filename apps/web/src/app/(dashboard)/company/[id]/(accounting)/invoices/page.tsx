import { CursorInvoices } from "./components/cursor-invoices";

export default async function InvoicesPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const companyId = Number.parseInt(id, 10);

  return (
    <div>
      <h1>Invoices</h1>
        <CursorInvoices companyId={companyId} />
    </div>
  );
}
