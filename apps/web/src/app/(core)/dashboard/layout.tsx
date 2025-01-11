import { redirect } from "next/navigation";
import { redirects } from "@/lib/config/redirects";
import { ReactNode } from "react";
import { BusinessProvider } from "../../../components/providers/business-provider";
import { getBusinessesAction } from "@/actions/busineses";

export default async function MainDashboardLayout({ children }: { children: ReactNode }) {
  const businesses = await getBusinessesAction()

  const businessesData = businesses?.data?.businesses

  //TODO: handle error
  if (!businessesData || businessesData?.length < 1) {
    redirect(redirects.app.createBusiness)
  }

  return (
    <BusinessProvider businesses={businessesData}>
      {children}
    </BusinessProvider>
  );
}
