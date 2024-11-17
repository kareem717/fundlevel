import React, { ReactNode } from "react";
import NuqsProvider from "./nuqs-provider";
import ThemeProvider from "./theme-provider";
import { Toaster } from "sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NuqsProvider>
      <ThemeProvider>
        {children}
        <Toaster />
      </ThemeProvider>
    </NuqsProvider>
  );
}
