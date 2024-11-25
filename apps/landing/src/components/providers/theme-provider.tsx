"use client";

import { FC, ComponentPropsWithoutRef } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export type ThemeProviderProps = ComponentPropsWithoutRef<typeof NextThemesProvider>

export const ThemeProvider: FC<ThemeProviderProps> = ({ children, ...props }) => {
  return (
    <NextThemesProvider
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
};
