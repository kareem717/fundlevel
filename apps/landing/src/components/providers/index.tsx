import { FC, ReactNode } from "react";
import { NuqsProvider, NuqsProviderProps } from "./nuqs-provider";
import { ThemeProvider, ThemeProviderProps } from "./theme-provider";
import { WrapBalancer } from "./wrap-balancer";
import { LivePreviewListener } from "../payload/LivePreviewListener";
import { Toaster } from "sonner";

export interface ProvidersProps {
  children: ReactNode;
  nuqsProps?: NuqsProviderProps;
  themeProps?: ThemeProviderProps;
}

export const Providers: FC<ProvidersProps> = ({
  children,
  nuqsProps,
  themeProps,
}) => {
  return (
    <NuqsProvider {...nuqsProps}>
      <ThemeProvider {...themeProps}>
        <WrapBalancer>
          {children}
          <Toaster />
          <LivePreviewListener />
        </WrapBalancer>
      </ThemeProvider>
    </NuqsProvider>
  );
};
