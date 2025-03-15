import "@workspace/ui/globals.css";

import { Providers } from "@/components/providers";

import { navigationConfig } from "@/lib/config/navigation";
import { Header } from "../components/header";
import { Geist, Geist_Mono } from "next/font/google";
import { meta } from "@/lib/config";
import { Footer } from "../components/footer";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = meta.root;

//TODO: refactor
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans scroll-smooth antialiased focus:scroll-auto max-w-screen-xl mx-auto pb-8`}
      >
        <Providers
          themeProps={{
            attribute: "class",
            defaultTheme: "system",
            disableTransitionOnChange: true,
          }}
        >
          <Header
            config={navigationConfig}
            currentPath={"/"}
            className="w-[calc(100%-16px)] max-w-screen-xl"
          />
          <main className="px-4">{children}</main>
          <Footer className="mt-20 md:mt-28 w-[calc(100%-16px)] mx-auto" />
        </Providers>
      </body>
    </html>
  );
}
