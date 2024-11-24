"use client";

import { FC, ComponentPropsWithoutRef } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export const ThemeProvider: FC<
  ComponentPropsWithoutRef<typeof NextThemesProvider>
> = ({ children, ...props }) => {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
};
