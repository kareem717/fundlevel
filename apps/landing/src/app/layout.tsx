import "@repo/ui/styles/globals.css";

import { Providers } from "@/components/providers";

import { navigationConfig } from "@/lib/config/navigation";
import { Header } from "@/app/components/layout/header";
import { Geist, Geist_Mono } from "next/font/google"
import { copy } from "@/lib/config";
import { Footer } from "./components/footer";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

//TODO: refactor
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
        className={`${fontSans.variable} ${fontMono.variable} font-sans scroll-smooth antialiased focus:scroll-auto max-w-screen-2xl mx-auto`}
      >
        <Providers
          themeProps={{
            attribute: "class",
            defaultTheme: "system",
            disableTransitionOnChange: true,
          }}
        >
          <Header config={navigationConfig} currentPath={"/"} className="max-w-screen-2xl mx-auto" />
          <div className="px-4">
            {children}
          </div>
          <Footer className="mt-6" footerLinks={copy.landing.footer} />
        </Providers>
      </body>
    </html >
  );
}
