import { notFound } from "next/navigation";
import { Separator } from "@fundlevel/ui/components/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@fundlevel/ui/components/sidebar";
import type { ReactNode } from "react";
import { CompanyProvider } from "@fundlevel/web/components/providers/company-provider";
import { Companiesidebar } from "./components/company-sidebar";
import { client } from "@fundlevel/sdk";
import { redirect } from "next/navigation";
import { redirects } from "@fundlevel/web/lib/config/redirects";
import { getTokenCached } from "@fundlevel/web/actions/auth";
import { env } from "@fundlevel/web/env";
import type { Company } from "@fundlevel/db/types";

export default async function CompanyLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ companyId: string }>;
}) {
  const token = await getTokenCached();
  if (!token) {
    return redirect(redirects.auth.login);
  }

  const { companyId } = await params;
  const parsedId = Number.parseInt(companyId, 10);

  console.log("companyId", companyId);

  if (Number.isNaN(parsedId)) {
    return notFound();
  }

  const resp = await client(env.NEXT_PUBLIC_BACKEND_URL, token).company.$get();

  if (resp.status !== 200) {
    throw new Error(`Failed to fetch companies, status: ${resp.status}`);
  }

  const companies = await resp.json();
  if (!companies.length) {
    return notFound();
  }

  const current = companies.find((company: Company) => company.id === parsedId);
  if (!current) {
    return notFound();
  }

  return (
    <CompanyProvider accounts={companies} defaultAccount={current}>
      <SidebarProvider>
        <Companiesidebar companyId={current.id} />
        <SidebarInset>
          {/* {alertComponent} */}
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              {/* <BusinessBreadcrumb /> */}
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 px-4 container mx-auto py-12">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </CompanyProvider>
  );
}
