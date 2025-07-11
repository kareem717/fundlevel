"use client";

import { queryClient } from "@fundlevel/web/lib/orpc/client";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

export function ReactQueryProvider({ children }: { children: ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
