"use client"

import { ComponentPropsWithoutRef, FC } from "react"
import { Business, useBusinessContext } from "./use-business-context";
import { BusinessContextBreadcrumb } from "./breadcrumb";
import { BuisnessContextDialog } from "./dialog";

const businesses: Business[] = [
  {
    id: 1,
    name: "Yakubu LLC",
  },
  {
    id: 2,
    name: "Yakubu LLC 2",
  },
  {
    id: 3,
    name: "Yakubu LLC 3",
  },
]


export interface ContextProps extends ComponentPropsWithoutRef<"div"> {
};

export const Context: FC<ContextProps> = ({ className, ...props }) => {
  const { selectedBusiness } = useBusinessContext();

  if (!selectedBusiness) {
    return <BuisnessContextDialog businesses={businesses} />
  } else {
    return <BusinessContextBreadcrumb businesses={businesses} />
  }
};