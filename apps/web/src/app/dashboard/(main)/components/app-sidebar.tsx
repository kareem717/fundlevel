"use client"

import { BusinessSelector } from "./business-context"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { SidebarMenu } from "@/components/ui/sidebar-menu"
import { ComponentPropsWithoutRef } from "react"
import NavConfig from "@/lib/config/navigation"
import { SidebarUser } from "@/components/ui/sidebar-user"
import { useAuth } from "@/components/providers/auth-provider"

export interface AppSidebarProps extends ComponentPropsWithoutRef<typeof Sidebar> {
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ ...props }: AppSidebarProps) => {
  const { dashboard } = NavConfig
  const { user, account } = useAuth()

  if (!user || !account) {
    throw new Error("Sidebar must be used within an AuthProvider with a user and account")
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <BusinessSelector />
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
