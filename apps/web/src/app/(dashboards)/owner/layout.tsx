import { AppSidebar } from "./components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Metadata } from "next"
import { redirect } from "next/navigation";
import redirects from "@/lib/config/redirects";
import AuthProvider from "@/components/providers/auth-provider";
import { getAccount, getUser } from "@/actions/auth";
import { getAccountBusinesses } from "@/actions/busineses"
import { DashboardBreadcrumb } from "./components/dashboard-breadcrumb."

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userResponse = await getUser();
  if (!userResponse?.data) {
    redirect(redirects.auth.login);
  }

  const accountResponse = await getAccount();
  if (!accountResponse?.data) {
    redirect(redirects.auth.createAccount);
  }

  const businessesResponse = await getAccountBusinesses();
  if (!businessesResponse?.data?.businesses || businessesResponse.data.businesses?.length === 0) {
    redirect(redirects.app.myBusinesses.create);
  }

  return (
    <AuthProvider user={userResponse.data} account={accountResponse.data}>
      <SidebarProvider>
        <AppSidebar businesses={businessesResponse.data.businesses} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <DashboardBreadcrumb />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  )
}
