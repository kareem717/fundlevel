import type { FC, ReactNode } from "react";
import { ThemeProvider, type ThemeProviderProps } from "./theme-provider";
import { WrapBalancer } from "./wrap-balancer";
import { Toaster } from "sonner";

export interface ProvidersProps {
  children: ReactNode;
  themeProps?: ThemeProviderProps;
}

export const Providers: FC<ProvidersProps> = ({ children, themeProps }) => {
  return (
    <ThemeProvider {...themeProps}>
      <WrapBalancer>
        {children}
        <Toaster />
      </WrapBalancer>
    </ThemeProvider>
  );
};
