// Product photos are served from Cloudinary when
// NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is set, and from /public otherwise.
//
// A photo listed in data/products.ts as "/images/products/aurora-1.jpg"
// is looked up on Cloudinary as "<folder>/aurora-1" — which is exactly
// where `npm run images:upload` puts it. You can also paste a full
// https://res.cloudinary.com/... URL straight into data/products.ts; full
// URLs are left untouched. SVG placeholders always stay local.

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_FOLDER = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "sanwarna/products";

export function imageUrl(src: string): string {
  if (!CLOUD || /^https?:\/\//.test(src) || src.endsWith(".svg")) return src;
  const name = src.split("/").pop()!.replace(/\.[a-z0-9]+$/i, "");
  // f_auto/q_auto: Cloudinary picks the best format and compression per browser.
  return `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,w_1600,c_limit/${CLOUDINARY_FOLDER}/${name}`;
}
