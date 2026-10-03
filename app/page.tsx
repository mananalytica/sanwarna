import HeroGallery from "@/components/HeroGallery";
import ProductSection from "@/components/ProductSection";
import CTASection from "@/components/CTASection";
import { getAllProducts, getBestSellers, getFeaturedProducts, getNewArrivals } from "@/lib/getProducts";

export default async function HomePage() {
  const [allProducts, featured, bestSellers, newArrivals] = await Promise.all([
    getAllProducts(),
    getFeaturedProducts(),
    getBestSellers(),
    getNewArrivals(),
  ]);

  return (
    <>
      <HeroGallery products={allProducts} />

      <ProductSection
        title="Featured Pieces"
        subtitle="The silhouettes we build the collection around."
        products={featured}
        viewAllHref="/shop"
      />

      <div className="hairline-solid mx-auto max-w-7xl" />

      <ProductSection
        title="Best Sellers"
        subtitle="Worn, reordered, and gifted the most."
        products={bestSellers}
        viewAllHref="/shop"
      />

      {/* SocialProof (reviews/press) is intentionally not shown — SANWARNA
          doesn't have real customer reviews yet. See components/SocialProof.tsx
          for the note on re-enabling it once real reviews exist. */}

      <ProductSection
        title="New Arrivals"
        subtitle="Fresh off the bench this season."
        products={newArrivals}
        viewAllHref="/shop"
      />

      <CTASection />
    </>
  );
}
