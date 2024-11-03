"use client"

import { BusinessSwitcher } from "./business-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { SidebarMenu } from "@/components/ui/sidebar-menu"
import { ComponentPropsWithoutRef } from "react"
import { Business } from "@/lib/api"
import NavConfig from "@/lib/config/navigation"
import { SidebarUser } from "@/components/ui/sidebar-user"
import { useAuth } from "@/components/providers/auth-provider"

export interface AppSidebarProps extends ComponentPropsWithoutRef<typeof Sidebar> {
  businesses: Business[]
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ businesses, ...props }: AppSidebarProps) => {
  const { businessDashboard } = NavConfig
  const { user, account } = useAuth()

  if (!user || !account) {
    throw new Error("Sidebar must be used within an AuthProvider with a user and account")
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <BusinessSwitcher businesses={businesses} />
      </SidebarHeader>
      <SidebarContent>
        {businessDashboard.map((menu) => (
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
