"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";

const BindingsContext = createContext<CloudflareEnv | null>(null);

export function useBindings() {
	const context = useContext(BindingsContext);
	if (!context) {
		throw new Error("useBindings must be used within a BindingsProvider");
	}

	return context;
}

export function BindingsProvider({
	children,
	bindings,
}: {
	children: ReactNode;
	bindings: CloudflareEnv;
}) {
	return (
		<BindingsContext.Provider value={bindings}>
			{children}
		</BindingsContext.Provider>
	);
}
