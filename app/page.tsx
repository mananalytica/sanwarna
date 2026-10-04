import Link from "next/link";
import Image from "next/image";
import HeroGallery from "@/components/HeroGallery";
import ProductSection from "@/components/ProductSection";
import CTASection from "@/components/CTASection";
import { getAllProducts } from "@/lib/getProducts";
import { pairingFor } from "@/lib/pairing";

const WHY = [
  { title: "Cut to catch the light", text: "A large square-cut crystal in an open frame, so light gets in from every side." },
  { title: "Boxed and ready to gift", text: "Every pair arrives in a black velvet presentation box." },
  { title: "Pay when it arrives", text: "Free delivery across Pakistan, with Cash on Delivery." },
];

export default async function HomePage() {
  const products = await getAllProducts();
  // "Wear it for": one tile per product that has a real photo and styling advice.
  const occasions = products
    .map((p) => ({ product: p, pairing: pairingFor(p) }))
    .filter((x) => x.pairing && !x.product.images[0].endsWith(".svg"))
    .slice(0, 4);

  return (
    <>
      <HeroGallery products={products} />

      <ProductSection
        title="The Crystal Collection"
        subtitle="One bold setting in several colours. Each pair arrives in a velvet box."
        products={products}
        viewAllHref="/shop"
      />

      <section className="border-y border-hairline bg-mist">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3 md:px-8 md:py-16">
          {WHY.map((w) => (
            <div key={w.title}>
              <h2 className="font-display text-xl text-graphite">{w.title}</h2>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-steel">{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      {occasions.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
          <h2 className="font-display text-3xl text-graphite">Wear it for</h2>
          <p className="mt-2 max-w-md text-sm text-steel">Each colour has its occasion.</p>
          <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-8">
            {occasions.map(({ product, pairing }) => (
              <Link key={product.id} href={`/shop/${product.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-hairline bg-cloud">
                  <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <p className="mt-3 font-display text-lg text-graphite group-hover:text-champagne">{pairing!.bestFor.replace(/\.$/, "")}</p>
                <p className="text-sm text-steel">{pairing!.colour}</p>
              </Link>
            ))}
          </div>
          <p className="mt-8 text-sm">
            <Link href="/journal/matching-cufflinks-to-shirts-and-shalwar-kameez" className="text-champagne underline-offset-4 hover:underline">
              Which colour with which shirt or shalwar kameez
            </Link>
          </p>
        </section>
      )}

      <section className="mx-auto max-w-3xl px-5 pb-16 text-center md:pb-20">
        <h2 className="font-display text-3xl text-graphite">Sanwarna means to adorn.</h2>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-steel">
          We make the small details that finish a look, starting with the one place a man can wear a jewel: his cuff.
        </p>
        <p className="mt-5 text-sm">
          <Link href="/about" className="text-champagne underline-offset-4 hover:underline">About SANWARNA</Link>
        </p>
      </section>

      <CTASection />
    </>
  );
}
