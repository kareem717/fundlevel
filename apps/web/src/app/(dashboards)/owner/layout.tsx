import { AppSidebar } from "./components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Metadata } from "next"
import { redirect } from "next/navigation";
import redirects from "@/lib/config/redirects";
import AuthProvider from "@/components/providers/auth-provider";
import { getAccountCached, getUserCached } from "@/actions/auth";
import { getAccountBusinesses } from "@/actions/busineses"
import { DashboardBreadcrumb } from "./components/dashboard-breadcrumb."
import { Business } from "@/lib/api";

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let user
  try {
    const userResponse = await getUserCached();
    if (!userResponse?.data) {
      redirect(redirects.auth.login);
    }

    user = userResponse.data
  } catch (error) {
    console.error('Error fetching user data:', error);
  }

  let account
  try {
    const accountResponse = await getAccountCached();
    if (!accountResponse?.data) {
      redirect(redirects.auth.createAccount);
    }

    account = accountResponse.data
  } catch (error) {
    console.error('Error fetching account data:', error);
  }

  let busineses: Business[] = []
  try {
    const businessesResponse = await getAccountBusinesses();
    if (!businessesResponse?.data?.businesses || businessesResponse.data.businesses?.length === 0) {
      redirect(redirects.app.myBusinesses.create);
    }

    busineses = businessesResponse.data.businesses
  } catch (error) {
    console.error('Error fetching businesses data:', error);
  }

  return (
    <AuthProvider user={user} account={account}>
      <SidebarProvider>
        <AppSidebar businesses={busineses} />
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
