import { PortfolioSidebar } from "./components/portfolio-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"
import { Metadata } from "next"
import { Separator } from "@workspace/ui/components/separator";
import { Suspense } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@workspace/ui/components/breadcrumb";
import { redirects } from "@/lib/config/redirects";

export const metadata: Metadata = {
  title: {
    default: "Portfolio",
    template: "%s | Portfolio",
  },
}

export default async function PortfolioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <PortfolioSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2:">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href={redirects.app.root}>
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  Portfolio
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
