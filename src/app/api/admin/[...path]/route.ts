import { randomUUID } from "node:crypto";
import { writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { z } from "zod";
import { checkOrigin, login, logout, requireAdmin } from "@/lib/admin-auth";
import { getContent, updateContent, ContentError } from "@/lib/content-store";
import { productSchema, pageSchema, postSchema, saveSchema, deleteSchema, referencedImages, validateContent } from "@/lib/content-validation";
import { uploadDirectory } from "@/lib/database.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ path: string[] }> };
const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
function failure(error: unknown) {
  if (error instanceof ContentError) return json({ error: error.message }, error.status);
  if (error instanceof z.ZodError) return json({ error: error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join("; ") }, 400);
  if (error instanceof SyntaxError) return json({ error: "The request could not be read." }, 400);
  console.error("Admin request failed", error);
  return json({ error: "Something went wrong while saving. Please try again." }, 500);
}
async function boundedBody(request: Request, limit: number) {
  if (Number(request.headers.get("content-length")) > limit) throw new ContentError("The upload is too large.", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new ContentError("The request is empty.");
  const chunks: Uint8Array[] = []; let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > limit) { await reader.cancel(); throw new ContentError("The upload is too large.", 413); }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}
export async function GET(_request: Request, context: Context) {
  try {
    await requireAdmin();
    if ((await context.params).path.join("/") !== "content") return json({ error: "Not found" }, 404);
    return json(getContent());
  } catch (error) { return failure(error); }
}
export async function POST(request: Request, context: Context) {
  try {
    checkOrigin(request);
    const action = (await context.params).path.join("/");
    if (action === "login") {
      const data = z.object({ username: z.string().min(1).max(100), password: z.string().min(1).max(1024) }).parse(JSON.parse((await boundedBody(request, 4096)).toString()));
      await login(data.username, data.password);
      return json({ ok: true });
    }
    await requireAdmin();
    if (action === "logout") { await logout(); return json({ ok: true }); }
    if (action === "upload") {
      const raw = await boundedBody(request, 11 * 1024 * 1024);
      let form: FormData;
      try { form = await new Response(raw, { headers: { "Content-Type": request.headers.get("content-type") || "" } }).formData(); }
      catch { throw new ContentError("Choose an image to upload."); }
      const file = form.get("file");
      if (!(file instanceof File) || file.size === 0) throw new ContentError("Choose an image to upload.");
      if (file.size > 10 * 1024 * 1024) throw new ContentError("Images must be 10 MB or smaller.", 413);
      let result;
      try {
        const input = sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 40000000 });
        const metadata = await input.metadata();
        if (!["jpeg", "png", "webp", "avif", "heif"].includes(metadata.format || "") || (metadata.pages || 1) > 1) throw new Error("Unsupported format");
        result = await input.rotate().resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true }).webp({ quality: 86 }).toBuffer({ resolveWithObject: true });
      } catch { throw new ContentError("Upload a valid JPG, PNG, WebP or AVIF image, up to 40 megapixels."); }
      getContent();
      const id = randomUUID(); const filename = `${id}.webp`;
      const asset = { id, src: `/media/${filename}`, name: file.name.slice(0, 200), width: result.info.width, height: result.info.height, createdAt: new Date().toISOString() };
      await writeFile(path.join(uploadDirectory, filename), result.data, { flag: "wx", mode: 0o600 });
      try { const content = updateContent(null, content => { content.media.unshift(asset); }); return json({ asset, content }, 201); }
      catch (error) { await unlink(path.join(uploadDirectory, filename)); throw error; }
    }
    const body = JSON.parse((await boundedBody(request, 1024 * 1024)).toString());
    if (action === "save") {
      const { revision, resource, value } = saveSchema.parse(body);
      const entry = (resource === "products" ? productSchema : resource === "pages" ? pageSchema : postSchema).parse(value);
      const content = updateContent(revision, content => {
        if (resource === "pages") {
          const page = pageSchema.parse(entry);
          const old = content.pages.find(p => p.id === page.id);
          if (page.builtin && !old?.builtin || old?.builtin && (!page.builtin || page.slug !== old.slug || !page.published)) throw new ContentError("Built-in pages must retain their URL and remain published.");
          for (const section of old?.sections.filter(s => s.builtin) || []) {
            const next = page.sections.find(s => s.id === section.id);
            if (!next || !next.builtin || next.kind !== section.kind) throw new ContentError("Keep the existing image sections on this page.");
          }
          if (page.sections.some(s => s.builtin && !old?.sections.some(o => o.builtin && o.id === s.id))) throw new ContentError("New sections must be custom sections.");
          content.pages = content.pages.some(p => p.id === page.id) ? content.pages.map(p => p.id === page.id ? page : p) : [...content.pages, page];
        } else if (resource === "products") {
          const product = productSchema.parse(entry); product.src = product.images[0];
          content.products = content.products.some(p => p.id === product.id) ? content.products.map(p => p.id === product.id ? product : p) : [...content.products, product];
        } else {
          const post = postSchema.parse(entry);
          content.posts = content.posts.some(p => p.id === post.id) ? content.posts.map(p => p.id === post.id ? post : p) : [...content.posts, post];
        }
        validateContent(content);
      });
      return json(content);
    }
    if (action === "delete") {
      const { revision, resource, id } = deleteSchema.parse(body);
      let filename: string | undefined;
      const content = updateContent(revision, content => {
        if (!content[resource].some(p => p.id === id)) throw new ContentError("This item no longer exists.", 404);
        if (resource === "pages" && content.pages.find(p => p.id === id)?.builtin) throw new ContentError("Built-in pages cannot be deleted.");
        if (resource === "media") {
          const asset = content.media.find(m => m.id === id)!;
          if (referencedImages(content).includes(asset.src)) throw new ContentError("This image is used by a product, post or page. Replace it there before deleting it.", 409);
          filename = path.basename(asset.src);
        }
        if (resource === "products") content.products = content.products.filter(p => p.id !== id);
        if (resource === "pages") content.pages = content.pages.filter(p => p.id !== id);
        if (resource === "posts") content.posts = content.posts.filter(p => p.id !== id);
        if (resource === "media") content.media = content.media.filter(p => p.id !== id);
      });
      if (filename) await unlink(path.join(uploadDirectory, filename)).catch(error => console.error("Could not remove unreferenced image", error));
      return json(content);
    }
    return json({ error: "Not found" }, 404);
  } catch (error) { return failure(error); }
}
