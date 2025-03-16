"use client";

import type { LinkedAccount } from "@fundlevel/api/types";
import { type ReactNode, useState } from "react";
import { createContext, useContext } from "react";

export interface LinkedAccountProviderProps {
  selectedAccount: LinkedAccount;
  setSelectedAccount: (account: LinkedAccount) => void;
  accounts: LinkedAccount[];
}

const LinkedAccountContext = createContext<
  LinkedAccountProviderProps | undefined
>(undefined);

export const useLinkedAccount = () => {
  const context = useContext(LinkedAccountContext);
  if (!context) {
    throw new Error(
      "useLinkedAccount must be used within a LinkedAccountProvider",
    );
  }

  return context;
};

export function LinkedAccountProvider({
  children,
  accounts,
  defaultAccount,
}: {
  children: ReactNode;
  accounts: LinkedAccount[];
  defaultAccount: LinkedAccount;
}) {
  if (accounts.length === 0) {
    throw new Error(
      "LinkedAccountProvider must be used with at least one account",
    );
  }

  const [selectedAccount, setSelectedAccount] =
    useState<LinkedAccount>(defaultAccount);

  return (
    <LinkedAccountContext.Provider
      value={{ selectedAccount, accounts, setSelectedAccount }}
    >
      {children}
    </LinkedAccountContext.Provider>
  );
}
