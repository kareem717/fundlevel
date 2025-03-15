"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@fundlevel/ui/components/sidebar"
import type { ComponentPropsWithoutRef } from "react"
import { sidebar } from "@/lib/config/sidebar"
import { SidebarUser } from "@/components/sidebar/sidebar-user"
import { SidebarMenu } from "@/components/sidebar/sidebar-menu"
import { SidebarNotification } from "@/components/sidebar/sidebar-notification"
import { LinkedAccountSwitcher } from "./linked-account-switcher"

export interface LinkedAccountSidebarProps extends ComponentPropsWithoutRef<typeof Sidebar> {
  accountId: number;
}

//TODO: this doesn't have to be a client component
export function LinkedAccountSidebar({ accountId, ...props }: LinkedAccountSidebarProps) {
  const sidebarConfig = sidebar.linkedAccountDashboard(accountId)

  return (
    <Sidebar variant="inset" {...props}>
      <LinkedAccountSwitcher />
      <SidebarContent>
        {sidebarConfig.map((menu) => (
          <SidebarMenu key={menu.name} config={menu} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarNotification notificationId="identity-not-verified" />
        <SidebarUser />
      </SidebarFooter>
    </Sidebar>
  )
}