import { redirects } from "@fundlevel/web/lib/config/redirects";
import { CreateCompanyDialog } from "./components/create-company-dialog";
import { client } from "@fundlevel/sdk";
import { redirect } from "next/navigation";
import { getTokenCached } from "@fundlevel/web/actions/auth";
import { env } from "@fundlevel/web/env";
import { CompanyGrid } from "./components/company-grid";

export default async function DashboardPage() {
  const token = await getTokenCached();
  if (!token) {
    return redirect(redirects.auth.login);
  }

  const req = await client(env.NEXT_PUBLIC_BACKEND_URL, token).company.$get();
  if (!req.ok) {
    throw new Error("Failed to get companies");
  }

  const companies = await req.json();

  return (
    <div className="py-8 mx-auto w-full">
      <div className="mb-6 flex justify-between">
        {/* <SearchCommand /> */}
        <CreateCompanyDialog />
      </div>
      <CompanyGrid />
    </div>
  );
}
