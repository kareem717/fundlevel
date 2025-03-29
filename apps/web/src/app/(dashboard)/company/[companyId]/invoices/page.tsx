import { InvoiceTable } from "./components/invoice-table";

interface InvoicesPageProps {
  params: Promise<{
    companyId: string;
  }>;
}

export default async function InvoicesPage({ params }: InvoicesPageProps) {
  const { companyId } = await params;

  const parsedCompanyId = Number.parseInt(companyId, 10);
  if (Number.isNaN(parsedCompanyId)) {
    throw new Error("Invalid company ID");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Invoices</h1>
      <InvoiceTable companyId={parsedCompanyId} />
    </div>
  );
}
