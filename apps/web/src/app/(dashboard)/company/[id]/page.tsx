import { getCompanyByIdAction } from "@/actions/company";
import { notFound } from "next/navigation";

export default async function CompanyPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsedId = Number.parseInt(id, 10);

  if (Number.isNaN(parsedId)) {
    return notFound();
  }

  const company = (await getCompanyByIdAction(parsedId))?.data;

  if (!company) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold mb-2">{company.name}</h1>
        <p className="text-muted-foreground">
          Manage your linked account and view financial data
        </p>
      </div>
      <pre className="bg-muted p-4 rounded-md w-min">
        {JSON.stringify(company, null, 2)}
      </pre>
    </div>
  );
}
