// The site's public address, used for absolute links (product feed,
// sitemap, JazzCash return URL). Set NEXT_PUBLIC_SITE_URL once you have a
// custom domain; until then Vercel's own production URL is used.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

export const BRAND = "SANWARNA";
