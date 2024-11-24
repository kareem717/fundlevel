import React from "react";
import { Toaster } from "sonner";
import { NuqsProvider } from "./Nuqs";
import { ThemeProvider } from "./Theme";

export const Providers: React.FC<{
  children: React.ReactNode;
}> = async ({ children }) => {
  return (
    <ThemeProvider>
      <NuqsProvider>
        {children}
        <Toaster />
      </NuqsProvider>
    </ThemeProvider>
  );
};
