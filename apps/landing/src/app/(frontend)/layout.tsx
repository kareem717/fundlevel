import "./globals.css";
import { Providers } from "@/components/providers";

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { LivePreviewListener } from "@/components/payload/LivePreviewListener";
import getPayload from "@/lib/utils/getPayload";
import { Metadata } from "next/types";
import { mergeOpenGraph } from "@/lib/utils/mergeOpenGraph";
import { cn } from "@/lib/utils";
import { navigationConfig } from "@/lib/config/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

// export const metadata = meta.root;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(GeistSans.variable, GeistMono.variable)}
      suppressHydrationWarning
    >
      <body className="w-full">
        <Providers>
          <LivePreviewListener />
          <Header
            config={navigationConfig}
            currentPath={"/"}
            className="sticky top-0 z-50 border-b w-full"
          />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload();

  const initData = await payload.findGlobal({
    slug: "site-settings",
  });

  return {
    title: initData?.general?.appName as string,
    description: initData?.general?.appDescription as string,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SERVER_URL || "https://fundlevel.app"
    ),
    openGraph: mergeOpenGraph(),
    twitter: {
      card: "summary_large_image",
      creator: "Fundlevel",
    },
  };
}
