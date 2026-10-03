import { Product } from "@/types";

// Default product-feed values per category. A product can override them
// (googleCategory / productType) from the admin product form.

export const GOOGLE_CATEGORY: Record<Product["category"], string> = {
  cufflinks: "Apparel & Accessories > Clothing Accessories > Cufflinks",
  "tie-pens": "Apparel & Accessories > Clothing Accessories > Tie Clips",
  "tie-clips": "Apparel & Accessories > Clothing Accessories > Tie Clips",
  sets: "Apparel & Accessories > Clothing Accessories",
};
export const PRODUCT_TYPE: Record<Product["category"], string> = {
  cufflinks: "Men > Accessories > Cufflinks",
  "tie-pens": "Men > Accessories > Tie Pins",
  "tie-clips": "Men > Accessories > Tie Clips",
  sets: "Men > Accessories > Gift Sets",
};
