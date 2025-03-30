import { redirect } from "next/navigation";
import { redirects } from "@fundlevel/web/lib/config/redirects";
import { getTokenCached } from "@fundlevel/web/actions/auth";
import { client } from "@fundlevel/sdk";
import { env } from "@fundlevel/web/env";

export default async function CompanyPage({
  params,
}: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;
  console.log("companyId", companyId);
  const parsedId = Number.parseInt(companyId, 10);

  const token = await getTokenCached();
  if (!token) {
    return redirect(redirects.auth.login);
  }

  console.log("CompanyPage");

  const resp = await client(env.NEXT_PUBLIC_BACKEND_URL, token).company[
    ":companyId"
  ].$get({ param: { companyId: parsedId } });

  if (resp.status !== 200) {
    throw new Error(`Failed to fetch company, status: ${resp.status}`);
  }

  const company = await resp.json();

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
