// Uploads every photo in public/images/products to Cloudinary.
//   npm run images:upload
// Needs NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and
// CLOUDINARY_API_SECRET in .env.local (Cloudinary dashboard → API Keys).
// Safe to re-run: files are overwritten under the same name.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const key = process.env.CLOUDINARY_API_KEY;
const secret = process.env.CLOUDINARY_API_SECRET;
const folder = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "sanwarna/products";
if (!cloud || !key || !secret) {
  console.error("Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env.local first.");
  process.exit(1);
}

const dir = "public/images/products";
const files = readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
for (const file of files) {
  const public_id = `${folder}/${file.replace(/\.[a-z0-9]+$/i, "")}`;
  const timestamp = Math.floor(Date.now() / 1000);
  const toSign = `overwrite=true&public_id=${public_id}&timestamp=${timestamp}${secret}`;
  const form = new FormData();
  form.set("file", new Blob([readFileSync(path.join(dir, file))]), file);
  form.set("api_key", key);
  form.set("timestamp", String(timestamp));
  form.set("public_id", public_id);
  form.set("overwrite", "true");
  form.set("signature", createHash("sha1").update(toSign).digest("hex"));
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: "POST", body: form });
  const json = await res.json();
  console.log(res.ok ? `uploaded  ${file}  →  ${json.secure_url}` : `FAILED    ${file}: ${json.error?.message}`);
  if (!res.ok) process.exitCode = 1;
}
