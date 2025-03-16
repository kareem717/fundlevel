import { getLinkedAccountsAction } from "@/actions/linked-account";
import { notFound } from "next/navigation";
import { Separator } from "@fundlevel/ui/components/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@fundlevel/ui/components/sidebar";
import type { ReactNode } from "react";
import { LinkedAccountProvider } from "@/components/providers/linked-account-provider";
import { LinkedAccountSidebar } from "./components/linked-account-sidebar";

export default async function LinkedAccountLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { id: string };
}) {
  const { id } = params;
  const parsedId = Number.parseInt(id, 10);

  if (Number.isNaN(parsedId)) {
    return notFound();
  }

  const linkedAccounts = (await getLinkedAccountsAction())?.data;
  if (!linkedAccounts || !linkedAccounts.length) {
    return notFound();
  }

  const current = linkedAccounts.find((account) => account.id === parsedId);
  if (!current) {
    return notFound();
  }

  return (
    <LinkedAccountProvider accounts={linkedAccounts} defaultAccount={current}>
      <SidebarProvider>
        <LinkedAccountSidebar accountId={current.id} />
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
    </LinkedAccountProvider>
  );
}
