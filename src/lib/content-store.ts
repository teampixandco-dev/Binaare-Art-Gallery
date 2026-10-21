import { PRODUCTS } from "@/data/products";
import seed from "@/data/site-seed.json";
import { getDatabase } from "./database.mjs";
import type { PublicContent, SiteContent } from "./content-types";

export class ContentError extends Error {
  public status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}
export function getContent(): SiteContent {
  const initial: SiteContent = {
    revision: 1,
    products: PRODUCTS.map((p) => ({
      ...p,
      id: p.slug,
      images: Array.isArray(p.images) && p.images.length ? p.images : [p.src],
      published: true,
    })),
    pages: seed.pages as SiteContent["pages"],
    posts: seed.posts as SiteContent["posts"],
    media: [],
  };

  try {
    const db = getDatabase();
    db.prepare("INSERT OR IGNORE INTO content (id, document) VALUES (1, ?)").run(JSON.stringify(initial));
    const row = db.prepare("SELECT document FROM content WHERE id = 1").get() as { document: string } | undefined;
    if (!row?.document) return initial;

    const content = JSON.parse(row.document) as SiteContent;

    let changed = false;
    const existingSlugs = new Set(content.products.map(p => p.slug || p.id));
    for (const p of PRODUCTS) {
      if (!existingSlugs.has(p.slug)) {
        content.products.push({
          ...p,
          id: p.slug,
          images: Array.isArray(p.images) && p.images.length ? p.images : [p.src],
          published: true,
        });
        changed = true;
      }
    }

    // Set prices of all products to null
    for (const p of content.products) {
      if (p.price !== null) {
        p.price = null;
        changed = true;
      }
    }

    if (!Array.isArray(content.pages)) {
      content.pages = seed.pages as SiteContent["pages"];
      changed = true;
    } else {
      const existingPageSlugs = new Set(content.pages.map(p => p.slug));
      for (const sp of seed.pages) {
        if (!existingPageSlugs.has(sp.slug)) {
          content.pages.push(sp as SiteContent["pages"][0]);
          changed = true;
        }
      }
    }

    if (!Array.isArray(content.media)) {
      content.media = [];
      changed = true;
    }

    // Auto-seed artwork assets into the media library so administrators can pick from all existing art
    const existingMediaSrcs = new Set(content.media.map(m => m.src));
    for (const p of PRODUCTS) {
      const allImages = [p.src, ...(Array.isArray(p.images) ? p.images : [])];
      for (const src of allImages) {
        if (src && !existingMediaSrcs.has(src)) {
          existingMediaSrcs.add(src);
          content.media.push({
            id: `artwork-${p.slug}`,
            src,
            name: `${p.title || p.slug}.webp`,
            width: 1440,
            height: 1440,
            createdAt: new Date().toISOString(),
          });
          changed = true;
        }
      }
    }

    const extraArtworks = [
      { src: "/artworks/beauty-beyond-colour-showcase.webp", name: "Beauty Beyond Colour (Showcase)" },
      { src: "/artworks/petals-of-serenity-showcase.webp", name: "Petals of Serenity (Showcase)" },
      { src: "/artworks/the-crimson-queen-showcase.webp", name: "The Crimson Queen (Showcase)" },
      { src: "/artworks/unfolding-in-gold-landscape.webp", name: "Unfolding in Gold (Landscape)" },
      { src: "/artworks/unfolding-in-gold.webp", name: "Unfolding in Gold" },
      { src: "/artworks/young-at-heart-showcase.webp", name: "Young at Heart (Showcase)" },
      { src: "/artist-home.webp", name: "Artist Studio Portrait" },
      { src: "/hero-poster.webp", name: "Hero Gallery Poster" },
    ];
    for (const item of extraArtworks) {
      if (!existingMediaSrcs.has(item.src)) {
        existingMediaSrcs.add(item.src);
        content.media.push({
          id: `site-asset-${content.media.length + 1}`,
          src: item.src,
          name: `${item.name}.webp`,
          width: 1440,
          height: 1440,
          createdAt: new Date().toISOString(),
        });
        changed = true;
      }
    }

    if (changed) {
      db.prepare("UPDATE content SET document = ? WHERE id = 1").run(JSON.stringify(content));
    }

    return content;
  } catch {
    return initial;
  }
}
export function getPublicContent(): PublicContent {
  try {
    const content = getContent();
    return {
      revision: content?.revision || 1,
      products: Array.isArray(content?.products) ? content.products.filter(p => p?.published) : [],
      pages: Array.isArray(content?.pages) ? content.pages.filter(p => p?.published) : [],
      posts: Array.isArray(content?.posts) ? content.posts.filter(p => p?.published) : [],
    };
  } catch (err) {
    console.error("[content-store] Error in getPublicContent:", err);
    return {
      revision: 1,
      products: PRODUCTS.map((p) => ({
        ...p,
        id: p.slug,
        images: Array.isArray(p.images) && p.images.length ? p.images : [p.src],
        published: true,
      })),
      pages: (seed.pages as SiteContent["pages"]).filter(p => p.published),
      posts: (seed.posts as SiteContent["posts"]).filter(p => p.published),
    };
  }
}
export function updateContent(revision: number | null, change: (content: SiteContent) => void): SiteContent {
  const db = getDatabase();
  db.exec("BEGIN IMMEDIATE");
  try {
    const content = getContent();
    if (revision !== null && content.revision !== revision) throw new ContentError("Content changed in another tab. Reload the latest content before saving again.", 409);
    change(content);
    for (const p of content.products) {
      p.price = null;
    }
    content.revision++;
    db.prepare("UPDATE content SET document = ? WHERE id = 1").run(JSON.stringify(content));
    db.exec("COMMIT");
    return content;
  } catch (error) { db.exec("ROLLBACK"); throw error; }
}
