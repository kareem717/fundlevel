import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@fundlevel/ui/styles/globals.css";
import { Toaster } from "@fundlevel/ui/components/sonner";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { BindingsProvider } from "@/components/providers/bindings-provider";
import { ReactQueryProvider } from "@/components/providers/react-query";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "nextjs",
	description: "nextjs",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const { env } = await getCloudflareContext({ async: true });

	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<BindingsProvider bindings={env}>
						<ReactQueryProvider>{children}</ReactQueryProvider>
					</BindingsProvider>
					<Toaster richColors />
				</ThemeProvider>
			</body>
		</html>
	);
}
