"use client"

import { ComponentPropsWithoutRef, FC, useEffect } from "react"
import { Business } from "@repo/sdk"
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
import { parseAsInteger, useQueryState } from 'nuqs'
import { createContext, useContext, useState, ReactNode } from "react";

export interface BusinessContext {
  currentBusiness: Business;
  setCurrentBusinessId: (businessId: number) => void;
  businesses: Business[];
}

const BusinessContext = createContext<BusinessContext | undefined>(undefined);

export const useBusinessContext = () => {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error("useBusiness must be used within a BusinessProvider");
  }
  return context;
};

export const BusinessContextProvider: FC<{
  children: ReactNode,
  businesses: Business[],
}> = ({ children, businesses: businessData }) => {
  if (businessData.length === 0) {
    throw new Error("BusinessContextProvider must be used with at least one business")
  }

  const [businesses] = useState<Business[]>(businessData);
  const [currentBusiness, setCurrentBusiness] = useState<Business>(businessData[0]);

  // TODO: bring to server side
  const [currentBusinessId, setCurrentBusinessId] = useState<number>(businessData[0].id);

  //TODO: i'd assume there's a better way to do this
  useEffect(() => {
    //? Should we throw an error if the business isn't found instead of defaulting to the first one?
    setCurrentBusiness(businesses.find(business => business.id === currentBusinessId) || businesses[0])
  }, [currentBusinessId, businesses])

  return (
    <BusinessContext.Provider value={{ currentBusiness, setCurrentBusinessId, businesses }}>
      {children}
    </BusinessContext.Provider>
  );
};


export interface BusinessContextSelectorProps extends ComponentPropsWithoutRef<typeof SidebarMenu> {
}

export const BusinessContextSelector: FC<BusinessContextSelectorProps> = ({ ...props }) => {
  const { isMobile } = useSidebar()
  const { setCurrentBusinessId, currentBusiness, businesses } = useBusinessContext()
  console.log(currentBusiness)

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
                  {currentBusiness.displayName[0]}
                </span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {currentBusiness.displayName}
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
                key={business.id}
                onClick={() => setCurrentBusinessId(business.id)}
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
                href={redirects.app.dashboard.business.create}
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
