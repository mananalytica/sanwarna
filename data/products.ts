import { Product } from "@/types";

// Static catalog. In production, replace this module's export with a fetch
// to a free-tier headless CMS or database — see /lib/getProducts.ts and
// .env.example for the swap-in points. Keeping it static means the whole
// storefront is pre-rendered at build time: no database round-trip, no
// cold start, instant page loads on Vercel's edge network.
//
// All prices are in PKR (Pakistani Rupees) — see lib/currency.ts for
// formatting. There are no `rating` / `reviewCount` fields: SANWARNA
// doesn't have real customer reviews yet, so no review data is shown
// anywhere on the site (see components/SocialProof.tsx for the note on
// re-enabling that section once real reviews exist).

export const PRODUCTS: Product[] = [
  {
    id: "p9",
    slug: "aurora-star-crystal-cufflinks",
    name: "Aurora Crystal Cufflinks",
    category: "cufflinks",
    price: 3500,
    compareAtPrice: 6000,
    description:
      "A large princess-cut crystal held by four stone-set claws in polished silver-tone metal. Cut to throw light across the room and a rainbow across your cuff.",
    story:
      "Aurora is built around one stone. A square, princess-cut crystal sits high in an open frame, so light gets in from the sides as well as the top and comes back out as white fire and flashes of colour. Four curved claws hold it at the middle of each edge, and every claw is set with its own cluster of small stones, so the piece sparkles even where the crystal stops. The frame is open at the sides and polished all the way round, and the back is a swivel toggle that slips through a double cuff and locks flat. It is a statement pair, made for the barat, the valima and the dinner where you want your sleeve noticed. Each pair arrives in a black velvet presentation box, ready to gift.",
    materials: [
      "Princess-cut clear crystal centre stone",
      "Polished silver-tone metal frame, open at the sides",
      "Four claws, each set with small accent stones",
      "Swivel toggle back for double (French) cuffs",
      "Sold as a pair in a black velvet presentation box",
      "Care: wipe with a soft dry cloth and keep away from perfume and water",
    ],
    images: [
      "/images/products/aurora-1.jpg",
      "/images/products/aurora-2.jpg",
      "/images/products/aurora-3.jpg",
      "/images/products/aurora-4.jpg",
    ],
    heroImages: [
      "/images/products/aurora-wide-1.jpg",
      "/images/products/aurora-wide-2.jpg",
      "/images/products/aurora-wide-3.jpg",
      "/images/products/aurora-wide-4.jpg",
    ],
    // Used by the admin Video Studio, which needs a transparent cutout.
    // A drawn stand-in until a background-removed photo exists.
    overlayImage: "/images/products/cufflink-classic.svg",
    variants: [
      { id: "v1", label: "Silver / Clear Crystal", swatch: "#D9D9D9", inStock: true },
    ],
    tags: ["bestseller", "wedding", "statement", "barat", "gift"],
    bestSeller: true,
    featured: true,
    newArrival: true,
    tryOnAnchor: "wrist",
  },
  {
    id: "p10",
    slug: "rouge-crystal-cufflinks",
    name: "Rouge Crystal Cufflinks",
    category: "cufflinks",
    price: 3500,
    compareAtPrice: 6000,
    description:
      "A deep red princess-cut crystal held by four stone-set claws in polished silver-tone metal. Dark as wine in the shade, bright as an ember under the lights.",
    story:
      "Rouge is the same bold setting as our Aurora, built around a deep red stone. The square, princess-cut crystal sits high in an open frame, so light enters from the sides as well as the top. In low light it reads almost black-red; under a chandelier or in sunlight it glows from inside and throws red across the cuff. Four curved claws hold the stone at the middle of each edge, each set with its own cluster of small clear stones, so there is a white sparkle around the red. The back is a swivel toggle that slips through a double cuff and locks flat. Red against a white cuff and a dark suit is a classic for the barat, the walima and formal dinners. Each pair arrives in a black velvet presentation box, ready to gift.",
    materials: [
      "Princess-cut deep red crystal centre stone",
      "Polished silver-tone metal frame, open at the sides",
      "Four claws, each set with small clear accent stones",
      "Swivel toggle back for double (French) cuffs",
      "Sold as a pair in a black velvet presentation box",
      "Care: wipe with a soft dry cloth and keep away from perfume and water",
    ],
    images: [
      "/images/products/rouge-1.jpg",
      "/images/products/rouge-2.jpg",
      "/images/products/rouge-3.jpg",
      "/images/products/rouge-4.jpg",
    ],
    heroImages: [
      "/images/products/rouge-wide-1.jpg",
      "/images/products/rouge-wide-2.jpg",
      "/images/products/rouge-wide-3.jpg",
      "/images/products/rouge-wide-4.jpg",
    ],
    // Used by the admin Video Studio; a drawn stand-in until a cutout exists.
    overlayImage: "/images/products/cufflink-classic.svg",
    variants: [{ id: "v1", label: "Silver / Red Crystal", swatch: "#8E1B1B", inStock: true }],
    tags: ["wedding", "statement", "barat", "gift", "red"],
    featured: true,
    newArrival: true,
    tryOnAnchor: "wrist",
  },
];

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}

export function getBestSellers(): Product[] {
  return PRODUCTS.filter((p) => p.bestSeller);
}

export function getNewArrivals(): Product[] {
  return PRODUCTS.filter((p) => p.newArrival);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category
  ).slice(0, limit);
}
