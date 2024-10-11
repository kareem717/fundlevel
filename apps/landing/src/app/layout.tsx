import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { GeistSans } from 'geist/font/sans';
import { meta } from "@/lib/config/meta";
import Head from "next/head";

export const metadata = meta.root;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.className}>
      <Head>
        <link rel="icon" type="image/png" href="/assets/favicon/favicon-48x48.png" sizes="48x48" />
        <link rel="icon" type="image/svg+xml" href="/assets/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/assets/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/assets/favicon/site.webmanifest" />
      </Head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
