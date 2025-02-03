"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu as SidebarMenuComponent,
  SidebarMenuButton,
} from "@repo/ui/components/sidebar"
import { SidebarMenu } from "@/components/sidebar/sidebar-menu"
import { ComponentPropsWithoutRef } from "react"
import { sidebar } from "@/lib/config/sidebar"
import { SidebarUser } from "@/components/sidebar/sidebar-user"
import { SidebarNotification } from "@/components/sidebar/sidebar-notification"
import { redirects } from "@/lib/config/redirects"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { SidebarLogo } from "@/components/sidebar/sidebar-logo"

//TODO: this doesn't have to be a client component
export function PortfolioSidebar({ ...props }: ComponentPropsWithoutRef<typeof Sidebar>) {
  const { portfolio } = sidebar
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        {portfolio.map((menu) => (
          <SidebarMenu key={menu.name} config={menu} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarNotification notificationId="identity-not-verified" />
        <SidebarUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
