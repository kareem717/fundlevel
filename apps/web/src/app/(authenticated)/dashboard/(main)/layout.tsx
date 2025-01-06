import { DashboardSidebar } from "./components/dashboard-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@repo/ui/components/sidebar"
import { Metadata } from "next"
import { redirect } from "next/navigation";
import redirects from "@/lib/config/redirects";
import { getAccountBusinesses } from "@/actions/busineses"
import { Business } from "@repo/sdk";
import { Separator } from "@repo/ui/components/separator";
import { BusinessContextProvider } from "./components/business-context";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Dashboard",
  },
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  let busineses: Business[] = []
  try {
    const businessesResponse = await getAccountBusinesses();

    busineses = businessesResponse?.data?.businesses || []
  } catch (error) {
    console.error('Error fetching businesses data:', error);
  }

  if (!busineses || busineses?.length === 0) {
    console.log('No businesses found, redirecting to create business')
    redirect(redirects.app.dashboard.business.create);
  }

  return (
    <SidebarProvider>
      <BusinessContextProvider businesses={busineses}>
        <DashboardSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              {/* //TODO: make breadcrumb dynamic */}
              {/* <DynamicBreadcrumb items={[{ title: "Dashboard" }]} /> */}
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
          </div>
        </SidebarInset>
      </BusinessContextProvider>
    </SidebarProvider>
  )
}
