"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { PublicContent } from "@/lib/content-types";

const ContentContext = createContext<PublicContent | null>(null);
export function ContentProvider({ initial, children }: { initial: PublicContent; children: React.ReactNode }) {
  const [content, setContent] = useState(initial);
  const pathname = usePathname();
  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    const controller = new AbortController();
    const refresh = () => {
      if (document.visibilityState === "hidden") return;
      fetch("/api/content", { cache: "no-store", signal: controller.signal })
        .then(async response => { if (response.ok) { const data: PublicContent = await response.json(); setContent(current => current.revision === data.revision ? current : data); } })
        .catch(() => { /* Keep the last server-rendered content when offline. */ });
    };
    refresh();
    window.addEventListener("focus", refresh);
    const timer = window.setInterval(refresh, 30000);
    return () => { controller.abort(); window.removeEventListener("focus", refresh); window.clearInterval(timer); };
  }, [pathname]);
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}
export function useContent() {
  const content = useContext(ContentContext);
  if (!content) throw new Error("ContentProvider is required.");
  return content;
}
export function usePageContent(slug: string) { return useContent().pages.find(page => page.slug === slug); }
