import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";
import type { Metadata } from "next";
import { getAllProducts, getProductBySlug, getRelatedProducts } from "@/lib/getProducts";
import ProductPurchasePanel from "@/components/ProductPurchasePanel";
import ProductSection from "@/components/ProductSection";
import Link from "next/link";
import { formatPrice } from "@/lib/currency";
import { pairingFor } from "@/lib/pairing";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  const title = `${product.name} | ${formatPrice(product.price)}`;
  const description = `${product.description} Free delivery across Pakistan. Cash on Delivery.`;
  return { title, description, openGraph: { title, description } };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const pairing = pairingFor(product);

  return (
    <div>
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-12 md:grid-cols-2 md:px-8 md:py-16">
        <ProductGallery images={product.images} name={product.name} />
        <ProductPurchasePanel product={product} />
      </div>

      <div className="mx-auto max-w-7xl px-5 pb-16 md:px-8">
        <div className="hairline-solid mb-10" />
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl text-graphite">The Story</h2>
            <p className="mt-4 max-w-prose2 text-balance leading-relaxed text-graphite/65">
              {product.story}
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-graphite">Materials & Care</h2>
            <ul className="mt-4 space-y-2 text-graphite/65">
              {product.materials.map((m) => (
                <li key={m} className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-champagne" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {pairing && (
        <div className="mx-auto max-w-7xl px-5 pb-16 md:px-8">
          <div className="hairline-solid mb-10" />
          <h2 className="font-display text-2xl text-graphite">Wear it with</h2>
          <dl className="mt-6 grid gap-8 text-graphite/70 md:grid-cols-4">
            <div>
              <dt className="text-sm font-medium text-graphite">Shirts</dt>
              <dd className="mt-2 leading-relaxed">{pairing.shirts}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-graphite">Shalwar kameez</dt>
              <dd className="mt-2 leading-relaxed">{pairing.kameez}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-graphite">Avoid</dt>
              <dd className="mt-2 leading-relaxed">{pairing.avoid}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-graphite">Best for</dt>
              <dd className="mt-2 leading-relaxed">{pairing.bestFor}</dd>
            </div>
          </dl>
          <p className="mt-6 text-sm">
            <Link href="/journal/matching-cufflinks-to-shirts-and-shalwar-kameez" className="text-champagne underline-offset-4 hover:underline">
              Read the full matching guide
            </Link>
          </p>
        </div>
      )}

      {related.length > 0 && (
        <ProductSection
          title="More from the collection"
          products={related}
          viewAllHref={`/shop?category=${product.category}`}
        />
      )}
    </div>
  );
}
