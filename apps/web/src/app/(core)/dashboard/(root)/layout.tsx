import type { ReactNode } from "react";
import {
  SidebarInset,
  SidebarProvider,
} from "@fundlevel/ui/components/sidebar";
import { SidebarTrigger } from "@fundlevel/ui/components/sidebar";
import { Separator } from "@fundlevel/ui/components/separator";
import { DashboardSidebar } from "./components/dashboard-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@fundlevel/ui/components/breadcrumb";
import { AuthProvider } from "@/components/providers/auth-provider";
import { NotificationProvider } from "@/components/providers/notification-provider";
import { getAccountAction, getUserAction } from "@/actions/auth";

export default async function RootDashboardLayout({
  children,
}: { children: ReactNode }) {
  const user = (await getUserAction())?.data;
  const account = (await getAccountAction())?.data;

  return (
    <AuthProvider user={user} account={account}>
      <NotificationProvider notifications={[]}>
        <SidebarProvider>
          <DashboardSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
