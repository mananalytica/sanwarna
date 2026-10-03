import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/adminAuth";

// Receives one photo from the admin product form, already compressed in
// the browser (components/admin/ImageField.tsx) into a JPG plus three WebP
// sizes, and stores them in Vercel Blob. Returns the JPG's public link;
// lib/imageLoader.js finds the WebP sizes from that link.

const MAX_BYTES = 3 * 1024 * 1024;
const PARTS = { jpg: "image/jpeg", w320: "image/webp", w640: "image/webp", w1280: "image/webp" } as const;

export async function POST(req: Request) {
  if (!(await verifyAdminSessionToken(cookies().get(ADMIN_COOKIE_NAME)?.value))) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Photo storage isn't set up yet. In Vercel, open Storage, create a Blob store, connect it to this project and redeploy." },
      { status: 503 }
    );
  }

  const form = await req.formData();
  const id = randomUUID().slice(0, 12);
  let url = "";
  try {
    for (const [part, type] of Object.entries(PARTS)) {
      const file = form.get(part);
      if (!(file instanceof Blob) || file.size === 0) {
        return NextResponse.json({ error: "The photo didn't arrive complete. Please try again." }, { status: 400 });
      }
      if (file.size > MAX_BYTES || file.type !== type) {
        return NextResponse.json({ error: "That file isn't a photo this site can use." }, { status: 400 });
      }
      const name = part === "jpg" ? `products/${id}.jpg` : `products/${id}-${part.slice(1)}.webp`;
      const saved = await put(name, file, {
        access: "public",
        addRandomSuffix: false,
        contentType: type,
        cacheControlMaxAge: 60 * 60 * 24 * 365,
      });
      if (part === "jpg") url = saved.url;
    }
  } catch (err) {
    console.error("[upload] failed", err);
    return NextResponse.json({ error: "The photo could not be stored. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ url });
}
