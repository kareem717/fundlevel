"use client";

import { ComponentPropsWithoutRef, type ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export interface ThemeProviderProps
  extends ComponentPropsWithoutRef<typeof NextThemesProvider> {
  children: ReactNode;
  }

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
