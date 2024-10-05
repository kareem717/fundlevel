import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { GeistSans } from 'geist/font/sans';
import { meta } from "@/lib/config/meta";

export const metadata = meta.root;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body
        className="h-screen w-screen"
      >
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
