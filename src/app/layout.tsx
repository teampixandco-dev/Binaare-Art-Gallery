import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollToTop from "@/components/ScrollToTop";
import Preloader from "@/components/Preloader";
import Providers from "@/components/Providers";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

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
      className={`${dmSans.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="font-sans min-h-full flex flex-col">
        <Preloader />
        <div className="noise-overlay" />
        <SmoothScroll>
          <Providers>
            {children}
            <ScrollToTop />
          </Providers>
        </SmoothScroll>
      </body>
    </html>
  );
}
