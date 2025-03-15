import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation";
import { getBusinessesAction, getBusinessStripeAccountAction } from "@/actions/business"
import { Separator } from "@workspace/ui/components/separator";
import { BusinessSidebar } from "./components/business-sidebar";
import { BusinessProvider } from "@/components/providers/business-provider";
import { redirects } from "@/lib/config/redirects";
import { ReactNode } from "react";
import { StripeOnboardRedirector } from "./funding/components/stripe-onboarding-redirector";
import { BusinessBreadcrumb } from "./components/business-breadcrumb";
import { DismissableAlert } from "@/components/dismissable-alert";

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

  const stripeAccount = (await getBusinessStripeAccountAction(business.id))?.data?.stripeAccount
  let alertComponent: ReactNode | undefined = undefined

  if (!stripeAccount || stripeAccount.stripe_disabled_reason) {
    //todo: fix css
    alertComponent = (
      <DismissableAlert
        title="Heads up!"
        className="max-w-lg fixed bottom-2 left-1/2 -translate-x-1/2 sm:top-4 sm:bottom-auto w-[calc(100%-16px)]"
      >
        <div className="flex gap-2 mt-2">
          Please finish setting up your Stripe account to fully use the platform.
          <StripeOnboardRedirector
            businessId={business.id}
            text="Finish"
          />
        </div>
      </DismissableAlert>
    )
  }

  return (
    <BusinessProvider businesses={businessesData} defaultBusiness={business}>
      <SidebarProvider>
        <BusinessSidebar businessId={business.id} />
        <SidebarInset>
          {alertComponent}
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <BusinessBreadcrumb />
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