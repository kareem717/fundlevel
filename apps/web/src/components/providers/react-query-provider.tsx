"use client";

import { queryClient } from "@fundlevel/web/lib/orpc/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { lazy, type ReactNode, Suspense } from "react";

const ReactQueryDevtoolsProduction = lazy(() =>
	import("@tanstack/react-query-devtools/production").then((d) => ({
		default: d.ReactQueryDevtools,
	})),
);

export function ReactQueryProvider({ children }: { children: ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<Suspense fallback={null}>
				<ReactQueryDevtoolsProduction />
			</Suspense>
		</QueryClientProvider>
	);
}
