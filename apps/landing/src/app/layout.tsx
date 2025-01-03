import "@repo/ui/styles/globals.css";

import { Providers } from "@/components/providers";

import { navigationConfig } from "@/lib/config/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Geist, Geist_Mono } from "next/font/google"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans scroll-smooth antialiased focus:scroll-auto`}
      >
        <Providers
          themeProps={{
            attribute: "class",
            defaultTheme: "system",
            disableTransitionOnChange: true,
          }}
        >
          <Header config={navigationConfig} currentPath={"/"} />
          {children}
          <Footer className="mt-6" />
        </Providers>
      </body>
    </html>
  );
}
