"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@repo/ui/components/sidebar"
import { SidebarMenu } from "@/components/sidebar-menu"
import { ComponentPropsWithoutRef } from "react"
import SidebarConfig from "@/lib/config/sidebar"
import { SidebarUser } from "@/components/sidebar-user"
import { useAuth } from "@/components/providers/auth-provider"

export interface PortfolioSidebarProps extends ComponentPropsWithoutRef<typeof Sidebar> {
}

export const PortfolioSidebar: React.FC<PortfolioSidebarProps> = ({ ...props }: PortfolioSidebarProps) => {
  const { wallet } = SidebarConfig
  const { user, account } = useAuth()

  if (!user || !account) {
    throw new Error("Sidebar must be used within an AuthProvider with a user and account")
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        {wallet.map((menu) => (
          <SidebarMenu key={menu.name} config={menu} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser firstName={account.firstName} lastName={account.lastName} email={user.email} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
