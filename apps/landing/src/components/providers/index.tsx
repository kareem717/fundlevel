import { FC, ReactNode } from "react";
import { NuqsProvider, NuqsProviderProps } from "./nuqs-provider";
import { ThemeProvider, ThemeProviderProps } from "./theme-provider";

export interface ProvidersProps {
  children: ReactNode
  nuqsProps?: NuqsProviderProps
  themeProps?: ThemeProviderProps
}

export const Providers: FC<ProvidersProps> = ({ children, nuqsProps, themeProps }) => {
  return (
    <NuqsProvider {...nuqsProps}>
      <ThemeProvider {...themeProps}>
        {children}
      </ThemeProvider>
    </NuqsProvider>
  );
};
