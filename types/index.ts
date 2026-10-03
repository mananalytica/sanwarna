export type ProductCategory = "cufflinks" | "tie-pens" | "sets" | "tie-clips";

export type ProductVariant = {
  id: string;
  label: string; // e.g. "Onyx Black / Gold"
  swatch: string; // hex color for the variant swatch
  priceModifier?: number; // added to base price, defaults 0
  inStock: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  price: number; // in PKR, base price — see lib/currency.ts for formatting
  compareAtPrice?: number;
  description: string;
  story: string; // longer editorial copy for the PDP
  materials: string[];
  images: string[]; // ordered gallery, first is primary
  overlayImage: string; // transparent PNG/SVG of the piece, used by the admin Video Studio
  variants: ProductVariant[];
  tags: string[];
  bestSeller?: boolean;
  featured?: boolean;
  newArrival?: boolean;
  tryOnAnchor: "wrist" | "collar";
  // Real, angle-by-angle product photography for the 3D/spin viewer (see
  // components/Product3DShowcase.tsx). Optional — most products only have
  // a single studio shot in `images`. When present, the spin viewer swaps
  // between these frames as the user drags instead of showing the
  // procedural 3D model.
  spinFrames?: string[];
  // Wide (landscape) photos for the homepage hero gallery. Optional —
  // the gallery falls back to `images` when a product has none.
  heroImages?: string[];
  // Product-feed fields (see app/api/products/feed.xml). All optional —
  // sensible values are derived from the category when they are blank.
  sku?: string; // g:id
  googleCategory?: string; // g:google_product_category
  productType?: string; // g:product_type
  gender?: "male" | "female" | "unisex";
  ageGroup?: "adult" | "kids";
};

export type CartLine = {
  productId: string;
  variantId: string;
  quantity: number;
};

export type VideoTemplateId =
  | "hook-reveal"
  | "cinematic-macro"
  | "before-glow-up"
  | "unboxing-luxe";

export type VideoTemplate = {
  id: VideoTemplateId;
  name: string;
  platformFit: string; // e.g. "TikTok / Reels / Shorts — 9:16"
  description: string;
  durationSeconds: number;
  hookText: string;
  captionText: string;
  ctaText: string;
  mood: "bold" | "romantic" | "minimal" | "energetic";
};
