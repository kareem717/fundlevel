"use client"

import { ComponentPropsWithoutRef, FC, useEffect } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons";
import { Business, useBusinessContext } from "./use-business-context";
import Link from "next/link";

export interface BusinessContextBreadcrumbProps extends ComponentPropsWithoutRef<"div"> {
  businesses: Business[]
};

export const BusinessContextBreadcrumb: FC<BusinessContextBreadcrumbProps> = ({ className, businesses, ...props }) => {
  const { selectedBusiness, setSelectedBusiness, isSelectedBusiness } = useBusinessContext();

  if (!selectedBusiness) return null;

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1">
                {selectedBusiness.name}
                <Icons.chevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {businesses.map((business) => (
                  <DropdownMenuItem key={business.id} disabled={isSelectedBusiness(business)} onClick={() => setSelectedBusiness(business)}>
                    {isSelectedBusiness(business) && <Icons.check className="h-4 w-4 mr-2" />}
                    {business.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem>
                  <Link href="#" className="flex items-center gap-2">
                    <Icons.add className="h-4 w-4" />
                    Create
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};