import { readFile } from "node:fs/promises";
import path from "node:path";
import { uploadDirectory, publicMediaDirectory } from "@/lib/database.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  if (!/^[a-zA-Z0-9_\-.]{1,100}\.(webp|png|jpg|jpeg|avif)$/i.test(filename) || filename.includes("..")) return new Response("Not found", { status: 404 });
  try {
    let bytes;
    try {
      bytes = await readFile(path.join(publicMediaDirectory, filename));
    } catch {
      bytes = await readFile(path.join(uploadDirectory, filename));
    }
    const ext = path.extname(filename).toLowerCase();
    const contentType = ext === ".png" ? "image/png" : ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : ext === ".avif" ? "image/avif" : "image/webp";
    return new Response(bytes, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
