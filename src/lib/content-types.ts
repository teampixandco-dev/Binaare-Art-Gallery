import type { Product } from "@/data/products";

export type ShopProduct = Product & { id: string; images: string[]; published: boolean };
export type SectionItem = { id: string; title: string; description: string; category: string; src: string };
export type PageSection = { id: string; title: string; kind: "single" | "grid"; builtin: boolean; items: SectionItem[] };
export type SitePage = {
  id: string; slug: string; title: string; subtitle: string; hero: string; body: string;
  builtin: boolean; published: boolean; showInNav: boolean; sections: PageSection[];
};
export type BlogPost = {
  id: string; slug: string; title: string; excerpt: string; body: string;
  cover: string; images: string[]; published: boolean; date: string;
};
export type MediaAsset = { id: string; src: string; name: string; width: number; height: number; createdAt: string };
export type SiteContent = { revision: number; products: ShopProduct[]; pages: SitePage[]; posts: BlogPost[]; media: MediaAsset[] };
export type PublicContent = Omit<SiteContent, "media">;
export const pageHref = (page: SitePage) => page.builtin ? (page.slug === "home" ? "/" : `/${page.slug}`) : `/pages/${page.slug}`;
