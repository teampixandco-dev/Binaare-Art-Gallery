import { PRODUCTS } from "@/data/products";
import seed from "@/data/site-seed.json";
import { getDatabase } from "./database.mjs";
import type { PublicContent, SiteContent } from "./content-types";

export class ContentError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
export function getContent(): SiteContent {
  const db = getDatabase();
  const initial: SiteContent = {
    revision: 1,
    products: PRODUCTS.map(p => ({ ...p, id: p.slug, images: [p.src], published: true })),
    pages: seed.pages as SiteContent["pages"], posts: seed.posts, media: [],
  };
  db.prepare("INSERT OR IGNORE INTO content (id, document) VALUES (1, ?)").run(JSON.stringify(initial));
  const row = db.prepare("SELECT document FROM content WHERE id = 1").get() as { document: string };
  return JSON.parse(row.document);
}
export function getPublicContent(): PublicContent {
  const content = getContent();
  return { revision: content.revision, products: content.products.filter(p => p.published), pages: content.pages.filter(p => p.published), posts: content.posts.filter(p => p.published) };
}
export function updateContent(revision: number | null, change: (content: SiteContent) => void): SiteContent {
  const db = getDatabase();
  db.exec("BEGIN IMMEDIATE");
  try {
    const content = getContent();
    if (revision !== null && content.revision !== revision) throw new ContentError("Content changed in another tab. Reload the latest content before saving again.", 409);
    change(content);
    content.revision++;
    db.prepare("UPDATE content SET document = ? WHERE id = 1").run(JSON.stringify(content));
    db.exec("COMMIT");
    return content;
  } catch (error) { db.exec("ROLLBACK"); throw error; }
}
