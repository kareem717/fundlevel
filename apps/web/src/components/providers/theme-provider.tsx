"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { useEffect, useState } from "react";

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  //! WARNING: This is a hack to prevent the theme provider from rendering on the server, but it stops SSR.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
