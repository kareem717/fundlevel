import "@fundlevel/ui/styles/globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "@fundlevel/web/components/providers/theme-provider";
import { Toaster } from "@fundlevel/ui/components/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClientProvider } from "@fundlevel/web/components/providers/query-client-provider";
import { env } from "../env";
import { ReactScan } from "@fundlevel/web/components/react-scan";
export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_WEB_URL),
  title: {
    default: "Fundlevel",
    template: "%s | Fundlevel",
  },
  description: "Building the future of finance.",
  keywords: [
    "fundlevel",
    "fundlevel.com",
    "finance",
    "investing",
    "investment",
    "investment management",
    "investment platform",
    "investment software",
    "investment technology",
    "investment tools",
    "investment services",
    "investment products",
    "investment management software",
    "investment management technology",
    "investment management tools",
    "investment management services",
    "investment management products",
  ],
  twitter: {
    card: "summary_large_image",
  },
};

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <QueryClientProvider>
        <html lang="en" suppressHydrationWarning>
          <body
            className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem={true}
              disableTransitionOnChange={true}
            >
              <NuqsAdapter>
                <ReactScan />
                {children}
                <Toaster />
              </NuqsAdapter>
            </ThemeProvider>
          </body>
        </html>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
