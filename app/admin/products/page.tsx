import Link from "next/link";
import { canEditProducts, listProductsForAdmin } from "@/lib/productStore";
import { formatPrice } from "@/lib/currency";
import { imageUrl } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export default async function AdminProducts({ searchParams }: { searchParams: { saved?: string; deleted?: string } }) {
  const editable = canEditProducts();
  let products: Awaited<ReturnType<typeof listProductsForAdmin>> = [];
  let failed = false;
  try {
    products = await listProductsForAdmin();
  } catch (err) {
    console.error("[admin] could not load products", err);
    failed = true;
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-graphite">Products</h1>
        {editable && !failed && (
          <Link href="/admin/products/new" className="rounded-full bg-graphite px-6 py-2.5 text-sm font-medium text-paper hover:bg-champagne">
            Add product
          </Link>
        )}
      </div>

      {searchParams.saved && <p role="status" className="mt-4 text-sm text-graphite">Product saved. It is live on the site now.</p>}
      {searchParams.deleted && <p role="status" className="mt-4 text-sm text-graphite">Product deleted.</p>}
      {!editable && (
        <p className="mt-4 text-sm text-rust">
          No database is connected, so products can&apos;t be edited here. Set MOTHERDUCK_TOKEN in Vercel and redeploy.
        </p>
      )}
      {failed && (
        <p className="mt-4 text-sm text-rust">
          Products could not be loaded from MotherDuck. Check that the sanwarna.main.products table exists and try again.
        </p>
      )}

      <div className="mt-8 overflow-x-auto rounded-xl border border-hairline">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-mist text-steel">
            <tr>
              {["Image", "Title", "ID", "Price", "Sale price", "Availability", ""].map((h, i) => (
                <th key={i} scope="col" className="px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const inStock = p.variants.some((v) => v.inStock);
              return (
                <tr key={p.id} className="border-t border-hairline align-middle text-graphite">
                  <td className="px-4 py-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl(p.images[0])} alt="" className="h-12 w-12 rounded-lg border border-hairline bg-cloud object-cover" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-steel">{p.category}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-steel">{p.sku || `SNW-${p.slug.toUpperCase()}`}</td>
                  <td className="whitespace-nowrap px-4 py-3">{formatPrice(p.compareAtPrice ?? p.price)}</td>
                  <td className="whitespace-nowrap px-4 py-3">{p.compareAtPrice ? formatPrice(p.price) : ""}</td>
                  <td className="px-4 py-3">{inStock ? "in stock" : "out of stock"}</td>
                  <td className="px-4 py-3 text-right">
                    {editable && (
                      <Link href={`/admin/products/${p.id}`} className="text-champagne underline-offset-4 hover:underline">
                        Edit
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
