"use client";

import { type ReactNode, createContext, useContext } from "react";

import type { User } from "@supabase/supabase-js";
import type { Account } from "@fundlevel/api/types";

export interface AuthProviderProps {
  user?: User | null;
  account?: Account | null;
}

const AuthContext = createContext<AuthProviderProps>({
  user: null,
  account: null,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export interface AuthProviderComponentProps extends AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
  user,
  account,
}: AuthProviderComponentProps) {
  return (
    <AuthContext.Provider value={{ user, account }}>
      {children}
    </AuthContext.Provider>
  );
}
