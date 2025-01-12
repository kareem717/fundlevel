"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenu as SidebarMenuComponent,
} from "@repo/ui/components/sidebar"
import { ComponentPropsWithoutRef } from "react"
import { sidebar } from "@/lib/config/sidebar"
import { ChevronsUpDown, Plus } from "lucide-react"
import { redirects } from "@/lib/config/redirects"
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@repo/ui/components/dropdown-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@repo/ui/components/dropdown-menu"
import { useBusiness } from "@/components/providers/business-provider";
import { useIsMobile } from "@/hooks/use-mobile"
import { SidebarUser } from "@/components/sidebar-user"
import Link from "next/link"
import { SidebarMenu } from "@/components/sidebar-menu"

export function BusinessDashboardSidebar({ ...props }: ComponentPropsWithoutRef<typeof Sidebar>) {
  const { selectedBusiness, businesses, setSelectedBusiness } = useBusiness();
  const isMobile = useIsMobile();

  const sidebarConfig = sidebar.businessDashboard(selectedBusiness.id)

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenuComponent>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <span className="text-lg uppercase">
                      {selectedBusiness.displayName[0]}
                    </span>
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {selectedBusiness.displayName}
                    </span>
                    {/* <span className="truncate text-xs">{business.plan}</span> */}
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                side={isMobile ? "bottom" : "right"}
                sideOffset={4}
              >
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Linked Accounts
                </DropdownMenuLabel>
                {businesses.map((business) => (
                  <DropdownMenuItem
                    key={business.id}
                    onClick={() => setSelectedBusiness(business)}
                    className="gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      {business.displayName[0]}
                    </div>
                    {business.displayName}
                    {/* <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut> */}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <Plus className="size-4" />
                  </div>
                  <Link
                    href={redirects.app.createBusiness}
                    className="font-medium text-muted-foreground"
                    prefetch={true}
                  >
                    Add Business
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenuComponent>
      </SidebarHeader>
      <SidebarContent>
        {sidebarConfig.map((menu) => (
          <SidebarMenu key={menu.name} config={menu} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser />
      </SidebarFooter>
    </Sidebar>
  )
}
