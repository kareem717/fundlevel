import { FC, ReactNode } from "react";
import { NuqsProvider, NuqsProviderProps } from "./nuqs-provider";
import { ThemeProvider, ThemeProviderProps } from "./theme-provider";
import { Toaster, ToasterProps } from "sonner";
import { AuthProvider, AuthProviderProps } from "./auth-provider";

export interface ProvidersProps {
  children: ReactNode;
  nuqsProps?: NuqsProviderProps;
  themeProps?: ThemeProviderProps;
  toasterProps?: ToasterProps;
  authProps?: AuthProviderProps;
}

export const Providers: FC<ProvidersProps> = ({
  children,
  nuqsProps,
  themeProps,
  toasterProps,
  authProps,
}) => {
  return (
    <NuqsProvider {...nuqsProps}>
      <ThemeProvider {...themeProps}>
        {authProps ? (
          <AuthProvider {...authProps}>
            {children}
          </AuthProvider>
        ) : children}
        <Toaster {...toasterProps} />
      </ThemeProvider>
    </NuqsProvider>
  );
};
