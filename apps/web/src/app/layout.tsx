import "@fundlevel/ui/globals.css";

import { Geist, Geist_Mono } from "next/font/google";

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
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans scroll-smooth antialiased focus:scroll-auto max-w-screen-xl mx-auto pb-8`}
      >
        {children}
      </body>
    </html>
  );
}
