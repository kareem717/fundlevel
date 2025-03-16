import { getCompaniesAction } from "@/actions/company";
import { notFound } from "next/navigation";
import { Separator } from "@fundlevel/ui/components/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@fundlevel/ui/components/sidebar";
import type { ReactNode } from "react";
import { CompanyProvider } from "@/components/providers/company-provider";
import { Companiesidebar } from "./components/company-sidebar";

export default async function CompanyLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parsedId = Number.parseInt(id, 10);

  if (Number.isNaN(parsedId)) {
    return notFound();
  }

  const companies = (await getCompaniesAction())?.data;
  if (!companies || !companies.length) {
    return notFound();
  }

  const current = companies.find((account) => account.id === parsedId);
  if (!current) {
    return notFound();
  }

  return (
    <CompanyProvider accounts={companies} defaultAccount={current}>
      <SidebarProvider>
        <Companiesidebar accountId={current.id} />
        <SidebarInset>
          {/* {alertComponent} */}
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              {/* <BusinessBreadcrumb /> */}
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </CompanyProvider>
  );
}
