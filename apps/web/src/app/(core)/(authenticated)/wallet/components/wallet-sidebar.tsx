"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@repo/ui/components/sidebar"
import { SidebarMenu } from "@/components/sidebar/sidebar-menu"
import { ComponentPropsWithoutRef } from "react"
import { sidebar } from "@/lib/config/sidebar"
import { SidebarUser } from "@/components/sidebar/sidebar-user"
import { useAuth } from "@/components/providers/auth-provider"

export function WalletSidebar({ ...props }: ComponentPropsWithoutRef<typeof Sidebar>) {
  const { wallet } = sidebar
  const { user, account } = useAuth()

  if (!user || !account) {
    throw new Error("Sidebar must be used within an AuthProvider with a user and account")
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarContent>
        {wallet.map((menu) => (
          <SidebarMenu key={menu.name} config={menu} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
