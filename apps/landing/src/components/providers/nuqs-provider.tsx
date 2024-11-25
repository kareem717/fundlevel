import { FC, ReactNode, ComponentPropsWithoutRef } from "react";
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export interface NuqsProviderProps extends ComponentPropsWithoutRef<typeof NuqsAdapter> {
  children: ReactNode
}

export const NuqsProvider: FC<NuqsProviderProps> = ({ children, ...props }) => {
  return <NuqsAdapter {...props}>{children}</NuqsAdapter>
}
