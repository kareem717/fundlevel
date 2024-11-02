"use client"

import { ComponentPropsWithoutRef, FC } from "react"
import { cn } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { dashboardBreadcrumbConfig } from "@/lib/config/dashboard"

export interface DashboardBreadcrumbProps extends ComponentPropsWithoutRef<"div"> {
  
};

export const DashboardBreadcrumb: FC<DashboardBreadcrumbProps> = ({ className, ...props }) => {
  const pathname = usePathname()

  const key = Object.keys(dashboardBreadcrumbConfig).find((key) => pathname.startsWith(key))

  if (!key) {
    throw new Error(`No title found for pathname: ${pathname}`)
  }

  //TODO: make this into links
  return (
    <div className={cn("flex items-center gap-2 px-4", className)} {...props}>
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            Business Dashboard
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          {dashboardBreadcrumbConfig[key].slice(0, -1).map((item, index) => (  // Ensure correct variable name
            <BreadcrumbItem key={index} className="hidden md:block">
              {item}
            </BreadcrumbItem>
          ))}

          <BreadcrumbItem key={dashboardBreadcrumbConfig[key].length - 1} >
            {dashboardBreadcrumbConfig[key][dashboardBreadcrumbConfig[key].length - 1]}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
