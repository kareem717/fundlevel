"use client"

import { ComponentPropsWithoutRef, FC, useEffect } from "react"
import { Business } from "@/lib/api"
import { ChevronsUpDown, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import redirects from "@/lib/config/redirects"
import { create } from "zustand";

export const useBusiness = create<{
  business: Business | null;
  businesses: Business[];
  setBusiness: (business: Business | null) => void;
  setBusinesses: (businesses: Business[]) => void;
}>((set) => ({
  business: null,
  businesses: [],
  setBusiness: (business) => set({ business }),
  setBusinesses: (businesses) => set({ businesses }),
}));

export interface BusinessSwitcherProps extends ComponentPropsWithoutRef<typeof SidebarMenu> {
  businesses: Business[];
}

export const BusinessSwitcher: FC<BusinessSwitcherProps> = ({ businesses: businessData, ...props }) => {
  const { isMobile } = useSidebar()
  const { business, setBusiness, businesses, setBusinesses } = useBusiness()

  useEffect(() => {
    setBusinesses(businessData)
    if (!business) {
      setBusiness(businessData[0])
    }
  }, [business, businessData, setBusiness, setBusinesses])

  return (
    <SidebarMenu {...props}>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <span className="text-lg uppercase">
                  {business?.name[0]}
                </span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {business?.name}
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
              Businesses
            </DropdownMenuLabel>
            {businesses.map((business) => (
              <DropdownMenuItem
                key={business.name}
                onClick={() => setBusiness(business)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  {business?.name[0]}
                </div>
                {business.name}
                {/* <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut> */}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <Link
                href={redirects.app.myBusinesses.create}
                className="font-medium text-muted-foreground"
              >
                Add business
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu >
  )
}
