import type { Metadata } from "next";
import "./fonts.css";
import "./globals.css";
import Providers from "@/components/Providers";
import { getPublicContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";


export const metadata: Metadata = {
  title: "Binaare Art Gallery | Colors of Love",
  description:
    "Binaare Art Gallery is a contemplative creative space where emotion finds form and colour becomes a language of the soul. Explore acrylic, watercolour, texture, and mixed media artworks by Binari Gamage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <head>
        <link rel="preload" href="/fonts/dm-sans-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/cormorant-garamond-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="font-sans min-h-full flex flex-col" suppressHydrationWarning>
        <Providers initial={getPublicContent()}>{children}</Providers>
      </body>
    </html>
  );
}
