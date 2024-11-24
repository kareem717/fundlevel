"use client";

import { FC, ComponentPropsWithoutRef } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export const ThemeProvider: FC<ComponentPropsWithoutRef<typeof NextThemesProvider>> = ({ children, ...props }) => {
  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  );
};