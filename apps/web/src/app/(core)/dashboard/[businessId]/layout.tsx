import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@repo/ui/components/sidebar"
import { Metadata } from "next"
import { notFound } from "next/navigation";
import { getBusinessByIdAction } from "@/actions/busineses"
import { Separator } from "@repo/ui/components/separator";
import { BusinessDashboardSidebar } from "./components/business-dashboard-sidebar";
import { BusinessDashboardBreadcrumb } from "./components/business-dashboard-breadcrumb";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Dashboard",
  },
}

export default async function BusinessDashboardLayout({ children, params }: { children: React.ReactNode, params: Promise<{ businessId: string }> }) {
  const { businessId } = await params;
  const parsedBusinessId = parseInt(businessId);

  if (isNaN(parsedBusinessId)) {
    return notFound();
  }

  const business = await getBusinessByIdAction(parsedBusinessId);

  if (!business?.data) {
    //TODO: handler error
    console.error("Business not found or error occurred");
    return notFound();
  }

  return (
    <SidebarProvider>
      <BusinessDashboardSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <BusinessDashboardBreadcrumb />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider >
  );
}