"use client";

import { type ReactNode, createContext, useContext } from "react";

import type { Account } from "@fundlevel/db/types";

export interface AuthProviderProps {
  account?: Account | null; 
  authToken?: string | null;
}

const AuthContext = createContext<AuthProviderProps>({
  account: null,
  authToken: null,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export interface AuthProviderComponentProps extends AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
  account,
  authToken,
}: AuthProviderComponentProps) {
  return (  
    <AuthContext.Provider value={{ account, authToken }}>
      {children}
    </AuthContext.Provider>
  );
}
