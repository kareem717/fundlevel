import { FC, ComponentPropsWithoutRef } from "react";
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export type NuqsProviderProps = ComponentPropsWithoutRef<typeof NuqsAdapter>

export const NuqsProvider: FC<NuqsProviderProps> = ({ children, ...props }) => {
  return <NuqsAdapter {...props}>{children}</NuqsAdapter>
}
