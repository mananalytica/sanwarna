// Tells next/image (and the hero gallery) which file to load for a photo
// at a given width. Local product photos map to the WebP copies made by
// scripts/optimize-images.mjs; drawings (SVG) and remote URLs (e.g.
// Cloudinary) are used as they are.
const WIDTHS = [320, 640, 1280];
const LOCAL_PHOTO = /^\/images\/products\/([^/]+)\.(jpe?g|png)$/i;

function imageLoader({ src, width }) {
  const m = src.match(LOCAL_PHOTO);
  if (!m) return src;
  const w = WIDTHS.find((x) => x >= width) || WIDTHS[WIDTHS.length - 1];
  return `/images/products/opt/${m[1]}-${w}.webp`;
}

/** srcset string for a plain <img>. Empty for images that aren't resized. */
imageLoader.srcSet = (src) =>
  LOCAL_PHOTO.test(src) ? WIDTHS.map((w) => `${imageLoader({ src, width: w })} ${w}w`).join(", ") : undefined;

module.exports = imageLoader;
module.exports.default = imageLoader;
