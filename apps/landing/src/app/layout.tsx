import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@fundlevel/ui/styles/globals.css";
import { Providers } from "@/components/providers";

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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} container mx-auto scroll-smooth font-sans antialiased focus:scroll-auto`}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
