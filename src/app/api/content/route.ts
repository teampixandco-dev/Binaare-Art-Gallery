import { getPublicContent } from "@/lib/content-store";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";
export function GET() {
  return Response.json(getPublicContent(), {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}
