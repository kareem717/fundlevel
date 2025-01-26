import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@repo/ui/components/sidebar"
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation";
import { getBusinessesAction, getBusinessStripeAccountAction } from "@/actions/business"
import { Separator } from "@repo/ui/components/separator";
import { BusinessDashboardSidebar } from "./components/business-dashboard-sidebar";
import { BusinessDashboardBreadcrumb } from "./components/business-dashboard-breadcrumb";
import { BusinessProvider } from "@/components/providers/business-provider";
import { redirects } from "@/lib/config/redirects";
import { DollarSign } from "lucide-react";
import { buttonVariants } from "@repo/ui/components/button";
import { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert"
import { cn } from "@repo/ui/lib/utils";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Dashboard",
  },
}

export default async function BusinessDashboardLayout({ children, params }: { children: React.ReactNode, params: Promise<{ businessId: string }> }) {
  const businesses = await getBusinessesAction()
  const businessesData = businesses?.data?.businesses

  //TODO: handle error
  if (!businessesData || businessesData?.length < 1) {
    redirect(redirects.app.createBusiness)
  }

  const { businessId } = await params;
  const parsedBusinessId = parseInt(businessId);

  //TODO: can be improved when have large amount of projects
  const business = businessesData?.find(business => business.id === parsedBusinessId);

  if (!business) {
    return notFound();
  }

  const stripeAccount = (await getBusinessStripeAccountAction(business.id))?.data
  let alertComponent: ReactNode | undefined = undefined

  if (!stripeAccount) {
    //todo: fix css
    alertComponent = (
      <Alert className="max-w-lg flex items-center justify-center gap-2 self-center">
        <DollarSign className="size-4" />
        <div>
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription className="flex gap-2">
            Please finish setting up your Stripe account to fully use the platform.
          </AlertDescription>
        </div>
        <Link href={redirects.app.businessDashboard(business.id).stripe.settings} className={cn(buttonVariants(), "w-min")}>
          Finish
        </Link>
      </Alert>
    )
  }

  return (
    <BusinessProvider businesses={businessesData} defaultBusiness={business}>
      <SidebarProvider>
        <BusinessDashboardSidebar />
        <SidebarInset>
          {alertComponent}
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
    </BusinessProvider>
  );
}