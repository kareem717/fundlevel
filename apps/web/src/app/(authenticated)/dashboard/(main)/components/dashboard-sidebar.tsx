"use client"

import { BusinessContextSelector } from "./business-context"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { SidebarMenu } from "@/components/sidebar-menu"
import { ComponentPropsWithoutRef } from "react"
import SidebarConfig from "@/lib/config/sidebar"
import { SidebarUser } from "@/components/sidebar-user"
import { useAuth } from "@/components/providers/auth-provider"

export interface DashboardSidebarProps extends ComponentPropsWithoutRef<typeof Sidebar> {
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ ...props }: DashboardSidebarProps) => {
  const { dashboard } = SidebarConfig
  const { user, account } = useAuth()

  if (!user || !account) {
    throw new Error("Sidebar must be used within an AuthProvider with a user and account")
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <BusinessContextSelector />
      </SidebarHeader>
      <SidebarContent>
        {dashboard.map((menu) => (
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
