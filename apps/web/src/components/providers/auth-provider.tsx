"use client";

import { FC, ReactNode } from "react";
import { User } from "@supabase/supabase-js";
import { createContext, useContext } from "react";
import { Account } from "@fundlevel/sdk";

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

export const AuthProvider: FC<AuthProviderProps & { children: ReactNode }> = ({
  children,
  user,
  account,
}) => {
  return (
    <AuthContext.Provider value={{ user, account }}>
      {children}
    </AuthContext.Provider>
  );
};
