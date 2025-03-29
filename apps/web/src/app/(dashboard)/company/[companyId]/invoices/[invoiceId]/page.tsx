import { client } from "@fundlevel/sdk";
import { redirect } from "next/navigation";
import { redirects } from "@fundlevel/web/lib/config/redirects";
import { getTokenCached } from "@fundlevel/web/actions/auth";
import { env } from "@fundlevel/web/env";

export default async function AccountingInvoicePage({
  params,
}: { params: Promise<{ companyId: string; invoiceId: string }> }) {
  const { invoiceId } = await params;

  const token = await getTokenCached();
  if (!token) {
    return redirect(redirects.auth.login);
  }

  const req = await client(
    env.NEXT_PUBLIC_BACKEND_URL,
    token,
  ).accounting.invoices[":invoiceId"].$get({
    param: { invoiceId: Number.parseInt(invoiceId) },
  });
  if (!req.ok) {
    throw new Error("Failed to get invoice");
  }

  const invoice = await req.json();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold mb-2">Invoice {invoice.id}</h1>
        <p className="text-muted-foreground">
          Manage your linked account and view financial data
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <pre className="bg-muted p-4 rounded-md w-min">
          {JSON.stringify(invoice, null, 2)}
        </pre>
      </div>
    </div>
  );
}
