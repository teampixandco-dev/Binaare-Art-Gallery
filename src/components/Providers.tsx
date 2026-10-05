"use client";

import { CartProvider } from "@/context/CartContext";
import { ContentProvider } from "@/context/ContentContext";
import type { PublicContent } from "@/lib/content-types";
import { usePathname } from "next/navigation";
import Preloader from "./Preloader";
import SmoothScroll from "./SmoothScroll";
import ScrollToTop from "./ScrollToTop";

export default function Providers({ children, initial }: { children: React.ReactNode; initial: PublicContent }) {
  const pathname = usePathname();
  return <ContentProvider initial={initial}><CartProvider>{pathname.startsWith("/admin") ? children : <><Preloader /><div className="noise-overlay" /><SmoothScroll>{children}<ScrollToTop /></SmoothScroll></>}</CartProvider></ContentProvider>;
}
