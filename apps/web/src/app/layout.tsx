import "./globals.css";

import React from "react";
import { env } from "@/env";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
