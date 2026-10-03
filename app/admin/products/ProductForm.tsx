import Link from "next/link";
import { Product } from "@/types";
import { GOOGLE_CATEGORY, PRODUCT_TYPE } from "@/lib/feed";
import ImageField from "@/components/admin/ImageField";
import { deleteProductAction, saveProductAction } from "../actions";

// One form for adding and editing. Field names follow the product feed
// (title, description, image_link, price, sale_price, availability…).

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-graphite">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-steel">{hint}</span>}
    </label>
  );
}

export default function ProductForm({ product, error }: { product?: Product; error?: string }) {
  const p = product;
  const regular = p ? p.compareAtPrice ?? p.price : "";
  const sale = p?.compareAtPrice ? p.price : "";
  const category = p?.category ?? "cufflinks";

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 md:px-8">
      <Link href="/admin/products" className="text-sm text-steel hover:text-graphite">Back to products</Link>
      <h1 className="mt-3 font-display text-3xl text-graphite">{p ? `Edit ${p.name}` : "Add product"}</h1>
      {error && <p role="alert" className="mt-4 rounded-lg border border-rust/40 bg-rust/5 px-4 py-3 text-sm text-rust">{error}</p>}

      <form action={saveProductAction} className="mt-8 space-y-6">
        <input type="hidden" name="id" value={p?.id ?? ""} />

        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Title">
            <input name="title" required defaultValue={p?.name} className="input-field" />
          </Field>
          <Field label="ID (SKU)" hint="Shown as g:id in the feed. Leave blank to use one made from the title.">
            <input name="sku" defaultValue={p?.sku} placeholder="SNW-AURORA" className="input-field" />
          </Field>
        </div>

        <Field label="Description" hint="Short text under the price on the product page.">
          <textarea name="description" required rows={3} defaultValue={p?.description} className="input-field" />
        </Field>
        <Field label="Story" hint="Longer text lower on the product page. Added to the description in the feed.">
          <textarea name="story" rows={5} defaultValue={p?.story} className="input-field" />
        </Field>

        <Field label="Image link" hint="Main photo, ideally square. Upload one, or paste a link.">
          <ImageField name="image_link" required defaultValue={p?.images[0]} />
        </Field>
        <Field label="Additional image links" hint="Upload more photos, or paste links one per line.">
          <ImageField name="additional_image_link" multiple defaultValue={p?.images.slice(1).join("\n")} />
        </Field>
        <Field label="Homepage gallery images" hint="Optional wide photos for the homepage gallery, one per line. If blank, the images above are used.">
          <ImageField name="hero_images" multiple rows={2} defaultValue={p?.heroImages?.join("\n")} />
        </Field>

        <div className="grid gap-6 md:grid-cols-3">
          <Field label="Price (PKR)" hint="The regular price.">
            <input name="price" required type="number" min="1" step="1" defaultValue={regular} className="input-field" />
          </Field>
          <Field label="Sale price (PKR)" hint="Optional. What the customer pays; the price is shown crossed out.">
            <input name="sale_price" type="number" min="1" step="1" defaultValue={sale} className="input-field" />
          </Field>
          <Field label="Availability">
            <select name="availability" defaultValue={p && !p.variants.some((v) => v.inStock) ? "out of stock" : "in stock"} className="input-field">
              <option>in stock</option>
              <option>out of stock</option>
            </select>
          </Field>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Field label="Category">
            <select name="category" defaultValue={category} className="input-field">
              <option value="cufflinks">Cufflinks</option>
              <option value="tie-pens">Tie pens</option>
              <option value="tie-clips">Tie clips</option>
              <option value="sets">Gift sets</option>
            </select>
          </Field>
          <Field label="Color">
            <input name="color" defaultValue={p?.variants[0]?.label} placeholder="Silver / Clear Crystal" className="input-field" />
          </Field>
          <Field label="Tags" hint="Separated by commas.">
            <input name="tags" defaultValue={p?.tags.join(", ")} className="input-field" />
          </Field>
        </div>

        <Field label="Materials and care" hint="One per line.">
          <textarea name="materials" rows={4} defaultValue={p?.materials.join("\n")} className="input-field" />
        </Field>

        <fieldset className="flex flex-wrap gap-6 text-sm text-graphite">
          <legend className="mb-2 text-sm font-medium">Show on the homepage as</legend>
          {([["featured", "Featured"], ["bestSeller", "Best seller"], ["newArrival", "New arrival"]] as const).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2">
              <input type="checkbox" name={key} defaultChecked={Boolean(p?.[key])} className="accent-champagne" />
              {label}
            </label>
          ))}
        </fieldset>

        <details className="rounded-xl border border-hairline p-4">
          <summary className="cursor-pointer text-sm font-medium text-graphite">Product feed details</summary>
          <p className="mt-2 text-xs text-steel">Brand is always SANWARNA and condition is always new. Blank fields use the default for the category.</p>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <Field label="Google product category" hint={`Default: ${GOOGLE_CATEGORY[category]}`}>
              <input name="google_product_category" defaultValue={p?.googleCategory} className="input-field" />
            </Field>
            <Field label="Product type" hint={`Default: ${PRODUCT_TYPE[category]}`}>
              <input name="product_type" defaultValue={p?.productType} className="input-field" />
            </Field>
            <Field label="Gender">
              <select name="gender" defaultValue={p?.gender ?? "male"} className="input-field">
                <option>male</option>
                <option>female</option>
                <option>unisex</option>
              </select>
            </Field>
            <Field label="Age group">
              <select name="age_group" defaultValue={p?.ageGroup ?? "adult"} className="input-field">
                <option>adult</option>
                <option>kids</option>
              </select>
            </Field>
          </div>
        </details>

        <button type="submit" className="rounded-full bg-graphite px-8 py-3 text-sm font-medium text-paper hover:bg-champagne">
          {p ? "Save changes" : "Add product"}
        </button>
      </form>

      {p && (
        <form action={deleteProductAction} className="mt-12 border-t border-hairline pt-6">
          <input type="hidden" name="id" value={p.id} />
          <details>
            <summary className="cursor-pointer text-sm text-rust">Delete this product</summary>
            <p className="mt-3 text-sm text-steel">This removes {p.name} from the shop. It can&apos;t be undone.</p>
            <button type="submit" className="mt-3 rounded-full border border-rust px-6 py-2.5 text-sm text-rust hover:bg-rust hover:text-paper">
              Delete {p.name}
            </button>
          </details>
        </form>
      )}
    </div>
  );
}
