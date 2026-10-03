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
    price: 32000,
    compareAtPrice: 38000,
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
    id: "p1",
    slug: "the-regent-cufflinks",
    name: "The Regent Cufflinks",
    category: "cufflinks",
    price: 24500,
    compareAtPrice: 29000,
    description: "Hand-finished round cufflinks in warm gold vermeil, engraved with the SANWARNA monogram.",
    story:
      "Named for the quiet authority of old money, The Regent is our best-selling silhouette — a full, sculpted dome that catches light from every angle. Each pair is hand-polished in small batches, then engraved with a single monogram letter so the piece is unmistakably yours.",
    materials: ["18k gold vermeil over sterling silver", "Hand-polished finish", "Solid brass fittings"],
    images: ["/images/products/cufflink-classic.svg"],
    overlayImage: "/images/products/cufflink-classic.svg",
    variants: [
      { id: "v1", label: "Champagne Gold", swatch: "#C9A56A", inStock: true },
      { id: "v2", label: "Aged Brass", swatch: "#8B7355", inStock: true },
      { id: "v3", label: "Ivory Enamel", swatch: "#F3EFE7", priceModifier: 2000, inStock: true },
    ],
    tags: ["bestseller", "monogram", "formal"],
    bestSeller: true,
    featured: true,
    tryOnAnchor: "wrist",
  },
  {
    id: "p2",
    slug: "obsidian-onyx-cufflinks",
    name: "Obsidian Onyx Cufflinks",
    category: "cufflinks",
    price: 27500,
    description: "Precision-cut black onyx set in a brushed gold frame — sharp, architectural, unmistakably modern.",
    story:
      "For the man who prefers his luxury quiet. A single slab of polished onyx, cut square and set flush into a hand-brushed gold frame. No shine for shine's sake — just weight, contrast, and a very clean line.",
    materials: ["Genuine black onyx", "14k gold-plated brass frame", "Bullet-back fittings"],
    images: ["/images/products/cufflink-onyx.svg"],
    overlayImage: "/images/products/cufflink-onyx.svg",
    variants: [
      { id: "v1", label: "Onyx / Gold", swatch: "#1B1A18", inStock: true },
      { id: "v2", label: "Onyx / Gunmetal", swatch: "#3A3A3A", inStock: true },
    ],
    tags: ["modern", "monochrome"],
    featured: true,
    newArrival: true,
    tryOnAnchor: "wrist",
  },
  {
    id: "p3",
    slug: "sovereign-signet-cufflinks",
    name: "Sovereign Signet Cufflinks",
    category: "cufflinks",
    price: 22000,
    description: "An oval signet face with a raised initial, cast in the tradition of family heirlooms.",
    story:
      "Long before wristwear, a signet meant something — a seal, a signature, a name that opened doors. We revived the form as a cufflink: oval, weighted, and finished dark so the engraved initial reads clean from across the room.",
    materials: ["Gold-plated brass", "Hand-engraved detail", "Whale-back fittings"],
    images: ["/images/products/cufflink-signet.svg"],
    overlayImage: "/images/products/cufflink-signet.svg",
    variants: [
      { id: "v1", label: "Gold / Onyx", swatch: "#241F1A", inStock: true },
      { id: "v2", label: "Gold / Ivory", swatch: "#F3EFE7", inStock: true },
    ],
    tags: ["signet", "heirloom"],
    bestSeller: true,
    tryOnAnchor: "wrist",
  },
  {
    id: "p4",
    slug: "the-ambassador-tie-bar",
    name: "The Ambassador Tie Bar",
    category: "tie-pens",
    price: 14500,
    description: "A slim, weighted gold tie bar with a mirror finish — the quiet finishing move of a sharp suit.",
    story:
      "Some details are for the room, and some are for the man wearing them. The Ambassador sits low and slim across the placket, just enough weight to keep everything in line without ever announcing itself.",
    materials: ["Gold-plated brass", "Mirror polish", "Spring clip closure"],
    images: ["/images/products/tie-pen-bar.svg"],
    overlayImage: "/images/products/tie-pen-bar.svg",
    variants: [
      { id: "v1", label: "Polished Gold", swatch: "#C9A56A", inStock: true },
      { id: "v2", label: "Brushed Brass", swatch: "#8B7355", inStock: true },
    ],
    tags: ["tie bar", "formal", "everyday"],
    featured: true,
    bestSeller: true,
    tryOnAnchor: "collar",
  },
  {
    id: "p5",
    slug: "the-pearl-sentinel-tie-pin",
    name: "The Pearl Sentinel Tie Pin",
    category: "tie-pens",
    price: 16500,
    compareAtPrice: 19500,
    description: "A tapered gold pin finished with a hand-set pearl — old-world elegance for black-tie evenings.",
    story:
      "Reserved for the nights that matter. The Sentinel tapers to a fine point and finishes in a single hand-set pearl — a detail borrowed from 1920s eveningwear, updated for a modern collar.",
    materials: ["Gold-plated brass", "Freshwater pearl", "Locking pin back"],
    images: ["/images/products/tie-pen-ornate.svg"],
    overlayImage: "/images/products/tie-pen-ornate.svg",
    variants: [
      { id: "v1", label: "Gold / Pearl", swatch: "#F3EFE7", inStock: true },
      { id: "v2", label: "Gunmetal / Pearl", swatch: "#3A3A3A", inStock: true },
    ],
    tags: ["black tie", "pearl", "evening"],
    newArrival: true,
    tryOnAnchor: "collar",
  },
  {
    id: "p6",
    slug: "heritage-presentation-set",
    name: "Heritage Presentation Set",
    category: "sets",
    price: 36000,
    compareAtPrice: 42000,
    description: "The Regent Cufflinks and Ambassador Tie Bar, boxed in signature obsidian and gold.",
    story:
      "Our most-gifted piece. Two signatures, one box — The Regent Cufflinks paired with The Ambassador Tie Bar, presented in a magnetic-close obsidian case lined in gold-stitched suede. A popular shaadi and Eid gift.",
    materials: ["18k gold vermeil", "Gold-plated brass", "Suede-lined presentation box"],
    images: ["/images/products/set-box.svg"],
    overlayImage: "/images/products/cufflink-classic.svg",
    variants: [
      { id: "v1", label: "Champagne Gold", swatch: "#C9A56A", inStock: true },
      { id: "v2", label: "Aged Brass", swatch: "#8B7355", inStock: true },
    ],
    tags: ["gift", "set", "bestseller"],
    bestSeller: true,
    featured: true,
    tryOnAnchor: "wrist",
  },
  {
    id: "p7",
    slug: "midnight-brass-tie-clip",
    name: "Midnight Brass Tie Clip",
    category: "tie-clips",
    price: 12000,
    description: "A gunmetal-finished tie clip with a hairline gold edge — understated, everyday polish.",
    story:
      "Not every day calls for gold. Midnight trades shine for depth — a matte gunmetal body with a single hairline of gold along the edge, built for the tie clip you actually wear Monday to Friday.",
    materials: ["Gunmetal-plated brass", "Hairline gold trim", "Spring clip closure"],
    images: ["/images/products/tie-pen-bar.svg"],
    overlayImage: "/images/products/tie-pen-bar.svg",
    variants: [
      { id: "v1", label: "Gunmetal / Gold Edge", swatch: "#3A3A3A", inStock: true },
    ],
    tags: ["everyday", "modern"],
    tryOnAnchor: "collar",
  },
  {
    id: "p8",
    slug: "the-diplomat-cufflinks",
    name: "The Diplomat Cufflinks",
    category: "cufflinks",
    price: 21000,
    description: "Rectangular bar cufflinks with a brushed champagne finish for boardroom-to-dinner versatility.",
    story:
      "Designed for the man whose day runs long — a board meeting at nine, dinner at eight. The Diplomat's clean rectangular bar reads sharp under fluorescent light and warm under candlelight.",
    materials: ["Gold-plated brass", "Brushed finish", "Bullet-back fittings"],
    images: ["/images/products/cufflink-onyx.svg"],
    overlayImage: "/images/products/cufflink-onyx.svg",
    variants: [
      { id: "v1", label: "Brushed Champagne", swatch: "#C9A56A", inStock: true },
      { id: "v2", label: "Brushed Silver", swatch: "#D9D9D9", inStock: false },
    ],
    tags: ["everyday", "office"],
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
