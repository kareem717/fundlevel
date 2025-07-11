import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@fundlevel/ui/styles/globals.css";
import { Toaster } from "@fundlevel/ui/components/sonner";
import { ReactQueryProvider } from "@fundlevel/web/components/providers/react-query-provider";
import { ThemeProvider } from "@fundlevel/web/components/providers/theme-provider";
import type { ReactNode } from "react";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		template: "%s | Fundlevel",
		default: "Fundlevel",
	},
	description: "Fundlevel",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider>
					<ReactQueryProvider>{children}</ReactQueryProvider>
					<Toaster richColors />
				</ThemeProvider>
			</body>
		</html>
	);
}
