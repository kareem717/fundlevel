import "@fundlevel/ui/globals.css";

import { Providers } from "@fundlevel/landing/components/providers";
import { Geist, Geist_Mono } from "next/font/google";
import { meta } from "@fundlevel/landing/lib/config";
import Head from "next/head";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = meta.root || null;

//TODO: refactor
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <Head>
        <script id="vtag-ai-js" async src="https://r2.leadsy.ai/tag.js" data-pid="qfD8hkAG1NlHjHdU" data-version="062024" />
      </Head>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans scroll-smooth antialiased focus:scroll-auto container mx-auto`}
      >
        <Providers
          themeProps={{
            attribute: "class",
            defaultTheme: "system",
            disableTransitionOnChange: true,
          }}
        >
          {children}
        </Providers>
      </body>
    </html>
  );
}
