"use client";

import { Toaster } from "@fundlevel/ui/components/sonner";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
	return (
		<NextThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			{children}
			<Toaster richColors />
		</NextThemeProvider>
	);
}
