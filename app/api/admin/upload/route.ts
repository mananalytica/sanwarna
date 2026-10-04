import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { list } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/adminAuth";

// Photo uploads from the admin product form (components/admin/ImageField.tsx).
// The browser sends the ORIGINAL file straight to Vercel Blob, untouched:
// no resizing, no re-compression. This route only checks that the person
// is the signed-in admin and hands the browser a one-time upload permit.
// Originals are stored under "originals/". (Older uploads under
// "products/" were compressed; lib/imageLoader.js still serves those.)

export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Photo storage isn't set up yet. In Vercel, open Storage, create a public Blob store, connect it to this project and redeploy." },
      { status: 503 }
    );
  }
  const body = (await req.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        // Runs for the browser's permit request: must be the signed-in admin.
        if (!(await verifyAdminSessionToken(cookies().get(ADMIN_COOKIE_NAME)?.value))) {
          throw new Error("Please sign in again.");
        }
        if (!pathname.startsWith("originals/")) throw new Error("Unexpected upload location.");
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
          maximumSizeInBytes: 30 * 1024 * 1024,
          addRandomSuffix: true,
          cacheControlMaxAge: 60 * 60 * 24 * 365,
        };
      },
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "The upload failed." }, { status: 400 });
  }
}

// The photo library: every photo already uploaded, newest first.
export async function GET() {
  if (!(await verifyAdminSessionToken(cookies().get(ADMIN_COOKIE_NAME)?.value))) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ photos: [] });
  try {
    const photos: { url: string; uploadedAt: string }[] = [];
    let cursor: string | undefined;
    do {
      const page = await list({ cursor, limit: 1000 });
      for (const b of page.blobs) {
        const original = b.pathname.startsWith("originals/");
        const oldUpload = b.pathname.startsWith("products/") && b.pathname.endsWith(".jpg");
        if (original || oldUpload) photos.push({ url: b.url, uploadedAt: new Date(b.uploadedAt).toISOString() });
      }
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    photos.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
    return NextResponse.json({ photos: photos.map((p) => p.url) });
  } catch (err) {
    console.error("[upload] list failed", err);
    return NextResponse.json({ error: "The photo library could not be loaded." }, { status: 500 });
  }
}
