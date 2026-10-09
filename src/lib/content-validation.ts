import { z } from "zod";
import type { SiteContent } from "./content-types";
import { ContentError } from "./content-store";

const id = z.string().min(1).max(100).regex(/^[a-zA-Z0-9_-]+$/);
const slug = z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and single hyphens for the URL.");
const title = z.string().trim().min(1).max(200);
const text = z.string().max(20000);
const image = z.string().max(2000).refine(src => {
  if (/^\/media\/[a-f0-9-]+\.webp$/.test(src) || /^\/[a-zA-Z0-9_-]+\.(?:webp|jpg|jpeg|png|mp4)$/.test(src)) return true;
  try { const url = new URL(src); return url.protocol === "https:" && url.hostname === "images.unsplash.com" && !url.username && !url.password; } catch { return false; }
}, "Choose an uploaded image from the media library.");
const section = z.object({
  id, title, kind: z.enum(["single", "grid"]), builtin: z.boolean(),
  items: z.array(z.object({ id, title: z.string().max(200), description: z.string().max(2000), category: z.string().max(100), src: image })).max(200),
}).refine(s => s.kind !== "single" || s.items.length === 1, "This image section needs exactly one image.");
export const productSchema = z.object({ id, slug, title, medium: title, size: title, price: z.number().finite().min(0).max(100000000), description: text, src: image, images: z.array(image).min(1).max(20), published: z.boolean() });
export const pageSchema = z.object({ id, slug, title, subtitle: z.string().max(500), hero: image, body: text, builtin: z.boolean(), published: z.boolean(), showInNav: z.boolean(), sections: z.array(section).max(30) });
export const postSchema = z.object({ id, slug, title, excerpt: z.string().trim().min(1).max(1000), body: z.string().trim().min(1).max(100000), cover: image, images: z.array(image).max(30), published: z.boolean(), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(s => !Number.isNaN(Date.parse(s))) });
export const saveSchema = z.object({ revision: z.number().int().positive(), resource: z.enum(["products", "pages", "posts"]), value: z.unknown() });
export const deleteSchema = z.object({ revision: z.number().int().positive(), resource: z.enum(["products", "pages", "posts", "media"]), id });
export function referencedImages(content: SiteContent): string[] {
  return [...content.products.flatMap(p => [p.src, ...p.images]), ...content.posts.flatMap(p => [p.cover, ...p.images]), ...content.pages.flatMap(p => [p.hero, ...p.sections.flatMap(s => s.items.map(i => i.src))])];
}
export function validateContent(content: SiteContent) {
  for (const entries of [content.products, content.pages, content.posts]) {
    if (new Set(entries.map(p => p.slug)).size !== entries.length) throw new ContentError("This URL is already used. Choose a different URL.");
    if (new Set(entries.map(p => p.id)).size !== entries.length) throw new ContentError("Duplicate content identifier.");
  }
  for (const page of content.pages) {
    if (new Set(page.sections.map(s => s.id)).size !== page.sections.length) throw new ContentError("Duplicate section identifier.");
    for (const section of page.sections) if (new Set(section.items.map(i => i.id)).size !== section.items.length) throw new ContentError("Duplicate image identifier.");
  }
  const available = new Set(content.media.map(m => m.src));
  if (referencedImages(content).some(src => src.startsWith("/media/") && !available.has(src))) throw new ContentError("An image is no longer in the media library. Please upload it again.");
}
