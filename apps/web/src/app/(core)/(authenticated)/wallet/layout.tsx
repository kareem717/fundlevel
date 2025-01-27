import { WalletSidebar } from "./components/wallet-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@repo/ui/components/sidebar"
import { Metadata } from "next"
import { Separator } from "@repo/ui/components/separator";

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
      <WalletSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2:">
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
    </SidebarProvider>
  )
}
