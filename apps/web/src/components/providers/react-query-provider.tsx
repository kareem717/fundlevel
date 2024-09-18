'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ComponentPropsWithoutRef, FC, useState } from "react";

export interface ReactQueryProviderProps
  extends Omit<ComponentPropsWithoutRef<typeof QueryClientProvider>, 'client'> {
}

export const ReactQueryProvider: FC<ReactQueryProviderProps> = ({
  children,
}) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
