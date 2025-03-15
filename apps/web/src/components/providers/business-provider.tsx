"use client";

import { ReactNode, useState } from "react";
import { createContext, useContext } from "react";
import { Business } from "@fundlevel/sdk";

export interface BusinessProviderProps {
  selectedBusiness: Business;
  setSelectedBusiness: (business: Business) => void;
  businesses: Business[];
}

const BusinessContext = createContext<BusinessProviderProps | undefined>(
  undefined,
);

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error("useBusiness must be used within a BusinessProvider");
  }

  return context;
};

export function BusinessProvider({
  children,
  businesses,
  defaultBusiness,
}: { children: ReactNode; businesses: Business[]; defaultBusiness: Business }) {
  if (businesses.length === 0) {
    throw new Error("BusinessProvider must be used with at least one business");
  }

  const [selectedBusiness, setSelectedBusiness] =
    useState<Business>(defaultBusiness);

  return (
    <BusinessContext.Provider
      value={{ selectedBusiness, businesses, setSelectedBusiness }}
    >
      {children}
    </BusinessContext.Provider>
  );
}
