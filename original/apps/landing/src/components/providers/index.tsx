import type { FC, ReactNode } from "react";
import { ThemeProvider, type ThemeProviderProps } from "./theme-provider";

export interface ProvidersProps {
  children: ReactNode;
  themeProps?: ThemeProviderProps;
}

export const Providers: FC<ProvidersProps> = ({ children, themeProps }) => {
  return (
    <ThemeProvider {...themeProps}>
      {children}
    </ThemeProvider>
  );
};
