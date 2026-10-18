import { getPublicContent } from "@/lib/content-store";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export function GET() { return Response.json(getPublicContent(), { headers: { "Cache-Control": "no-store" } }); }
