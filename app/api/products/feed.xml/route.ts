import { getAllProducts } from "@/lib/getProducts";
import { BRAND, SITE_URL } from "@/lib/site";
import { Product } from "@/types";
import { GOOGLE_CATEGORY, PRODUCT_TYPE } from "@/lib/feed";

// Google Merchant Center / Meta catalogue feed (RSS 2.0 + g: namespace).
// Submit  <site>/api/products/feed.xml  as the feed URL.
//
// Only products with real photos are listed: Google rejects drawn/SVG
// placeholder images, so placeholder products are left out automatically.

export const dynamic = "force-dynamic"; // always reflects the latest admin edits

const UTM = "utm_source=google&utm_medium=shopping&utm_campaign=product_catalog";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const abs = (src: string) => (src.startsWith("http") ? src : `${SITE_URL}${src}`);
const money = (n: number) => `${n.toFixed(1)} PKR`;

function item(p: Product): string {
  const variant = p.variants.find((v) => v.inStock) ?? p.variants[0];
  const price = p.price + (variant?.priceModifier ?? 0);
  const onSale = p.compareAtPrice && p.compareAtPrice > price;
  const [first, ...rest] = p.images;
  const tags = [
    `<g:id>${esc(p.sku || `SNW-${p.slug.toUpperCase()}`)}</g:id>`,
    `<title>${esc(p.name)}</title>`,
    `<description>${esc(`${p.description} ${p.story}`)}</description>`,
    `<link>${esc(`${SITE_URL}/shop/${p.slug}?${UTM}`)}</link>`,
    `<g:image_link>${esc(abs(first))}</g:image_link>`,
    ...rest.slice(0, 10).map((src) => `<g:additional_image_link>${esc(abs(src))}</g:additional_image_link>`),
    `<g:availability>${p.variants.some((v) => v.inStock) ? "in stock" : "out of stock"}</g:availability>`,
    `<g:price>${money(onSale ? p.compareAtPrice! : price)}</g:price>`,
    ...(onSale ? [`<g:sale_price>${money(price)}</g:sale_price>`] : []),
    `<g:brand>${BRAND}</g:brand>`,
    `<g:condition>new</g:condition>`,
    `<g:google_product_category>${esc(p.googleCategory || GOOGLE_CATEGORY[p.category])}</g:google_product_category>`,
    `<g:product_type>${esc(p.productType || PRODUCT_TYPE[p.category])}</g:product_type>`,
    ...(variant ? [`<g:color>${esc(variant.label)}</g:color>`] : []),
    `<g:gender>${p.gender || "male"}</g:gender>`,
    `<g:age_group>${p.ageGroup || "adult"}</g:age_group>`,
    `<g:shipping><g:country>PK</g:country><g:price>0.0 PKR</g:price></g:shipping>`,
  ];
  return `    <item>\n      ${tags.join("\n      ")}\n    </item>`;
}

export async function GET() {
  const products = (await getAllProducts()).filter((p) => p.images[0] && !p.images[0].endsWith(".svg"));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${BRAND} — Product Feed</title>
    <link>${SITE_URL}</link>
    <description>Beauty in every detail. Statement jewellery and accessories, delivered free across Pakistan.</description>
${products.map(item).join("\n")}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
