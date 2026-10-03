// Makes small WebP copies of every product photo, in three widths, so
// phones download a small file and desktops a sharp one.
//
// Runs by itself before `npm run dev` and `npm run build` (so also on every
// Vercel deploy). Just drop a JPG/PNG into public/images/products.
// Output: public/images/products/opt/<name>-<width>.webp (generated, not
// committed). Widths must match lib/imageLoader.js.
import { readdirSync, mkdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const WIDTHS = [320, 640, 1280];
const dir = "public/images/products";
const out = path.join(dir, "opt");
mkdirSync(out, { recursive: true });

let made = 0;
for (const file of readdirSync(dir).filter((f) => /\.(jpe?g|png)$/i.test(f))) {
  const src = path.join(dir, file);
  const name = file.replace(/\.[a-z0-9]+$/i, "");
  for (const w of WIDTHS) {
    const dest = path.join(out, `${name}-${w}.webp`);
    if (existsSync(dest) && statSync(dest).mtimeMs >= statSync(src).mtimeMs) continue;
    await sharp(src).resize({ width: w, withoutEnlargement: true }).webp({ quality: 78 }).toFile(dest);
    made++;
  }
}
console.log(`images: ${made} WebP file(s) written to ${out}`);
