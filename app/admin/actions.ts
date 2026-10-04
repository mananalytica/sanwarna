"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/adminAuth";
import { deleteProduct, listProductsForAdmin, saveProduct } from "@/lib/productStore";
import { FULFILMENT, Fulfilment, setFulfilment, setPaymentStatus } from "@/lib/orders";
import { Product, ProductCategory } from "@/types";
import { deleteArticle, listArticlesForAdmin, saveArticle } from "@/lib/journalStore";
import { Article, textToBody } from "@/lib/journal";

// Every action re-checks the admin session itself; never rely only on
// the middleware for anything that changes data.
async function requireAdmin() {
  if (!(await verifyAdminSessionToken(cookies().get(ADMIN_COOKIE_NAME)?.value))) redirect("/admin/login");
}

const CATEGORIES: ProductCategory[] = ["cufflinks", "tie-pens", "tie-clips", "sets"];
const text = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const lines = (f: FormData, k: string) => text(f, k).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

function fail(id: string, message: string): never {
  redirect(`/admin/products/${id || "new"}?error=${encodeURIComponent(message)}`);
}

export async function saveProductAction(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  const existing = id ? (await listProductsForAdmin()).find((p) => p.id === id) : undefined;

  const name = text(form, "title");
  const regular = Math.round(Number(text(form, "price")));
  const saleRaw = text(form, "sale_price");
  const sale = saleRaw ? Math.round(Number(saleRaw)) : null;
  const image = text(form, "image_link");
  const category = text(form, "category") as ProductCategory;

  if (!name) fail(id, "Title is required.");
  if (!(regular > 0)) fail(id, "Price must be a number greater than 0.");
  if (sale !== null && !(sale > 0 && sale < regular)) fail(id, "Sale price must be lower than the price.");
  if (!image) fail(id, "Main image link is required.");
  if (!CATEGORIES.includes(category)) fail(id, "Choose a category.");

  const inStock = text(form, "availability") !== "out of stock";
  const color = text(form, "color") || "Standard";
  // Each product is one colour: one finish, with the circle colour chosen in the form.
  const swatchRaw = text(form, "swatch");
  const swatch = /^#[0-9a-fA-F]{6}$/.test(swatchRaw) ? swatchRaw : "#D9D9D9";
  const variants = [{ id: existing?.variants[0]?.id ?? "v1", label: color, swatch, inStock }];

  const gender = text(form, "gender");
  const ageGroup = text(form, "age_group");
  const product: Product = {
    ...(existing ?? {}),
    id: existing?.id ?? `p${Date.now().toString(36)}`,
    slug: existing?.slug ?? slugify(text(form, "slug") || name),
    name,
    category,
    // Feed style: "price" is the regular price, "sale price" what is charged.
    price: sale ?? regular,
    compareAtPrice: sale !== null ? regular : undefined,
    description: text(form, "description"),
    story: text(form, "story"),
    materials: lines(form, "materials"),
    images: [image, ...lines(form, "additional_image_link")],
    heroImages: lines(form, "hero_images").length ? lines(form, "hero_images") : undefined,
    overlayImage: existing?.overlayImage ?? "/images/products/cufflink-classic.svg",
    variants,
    tags: text(form, "tags").split(",").map((t) => t.trim()).filter(Boolean),
    featured: form.get("featured") === "on",
    bestSeller: form.get("bestSeller") === "on",
    newArrival: form.get("newArrival") === "on",
    tryOnAnchor: existing?.tryOnAnchor ?? "wrist",
    swatch,
    sku: text(form, "sku") || undefined,
    googleCategory: text(form, "google_product_category") || undefined,
    productType: text(form, "product_type") || undefined,
    gender: gender === "female" || gender === "unisex" ? gender : "male",
    ageGroup: ageGroup === "kids" ? "kids" : "adult",
  };
  if (!product.slug) fail(id, "The title needs at least one letter or number.");

  try {
    await saveProduct(product);
  } catch (err) {
    console.error("[admin] save product failed", err);
    fail(id, err instanceof Error ? err.message : "The product could not be saved.");
  }
  revalidatePath("/", "layout"); // refresh every page that shows products
  redirect("/admin/products?saved=1");
}

export async function deleteProductAction(form: FormData) {
  await requireAdmin();
  await deleteProduct(text(form, "id"));
  revalidatePath("/", "layout");
  redirect("/admin/products?deleted=1");
}

export async function updateOrderAction(form: FormData) {
  await requireAdmin();
  const ref = text(form, "ref");
  const fulfilment = text(form, "fulfilment") as Fulfilment;
  if (ref && FULFILMENT.includes(fulfilment)) await setFulfilment(ref, fulfilment);
  // COD orders carry a "Cash collected" tick box.
  if (ref && text(form, "is_cod") === "1") {
    await setPaymentStatus(ref, text(form, "paid") === "yes" ? "paid" : "cod-pending");
  }
  revalidatePath("/admin/orders");
}

export async function saveArticleAction(form: FormData) {
  await requireAdmin();
  const previous = text(form, "previous_slug");
  const back = (msg: string): never => redirect(`/admin/journal/${previous || "new"}?error=${encodeURIComponent(msg)}`);
  const existing = previous ? (await listArticlesForAdmin()).find((a) => a.slug === previous) : undefined;

  const title = text(form, "title");
  const sections = textToBody(text(form, "body"));
  if (!title) back("Title is required.");
  if (sections.length === 0) back("The article needs some text.");
  const slug = existing?.slug ?? slugify(title);
  if (!slug) back("The title needs at least one letter or number.");

  const article: Article = {
    slug,
    title,
    summary: text(form, "summary"),
    date: existing?.date ?? new Date().toISOString().slice(0, 10),
    image: text(form, "image") || undefined,
    showPairingTable: form.get("showPairingTable") === "on" || undefined,
    sections,
  };
  try {
    await saveArticle(article, previous || undefined);
  } catch (err) {
    console.error("[admin] save article failed", err);
    back(err instanceof Error ? err.message : "The article could not be saved.");
  }
  revalidatePath("/", "layout");
  redirect("/admin/journal?saved=1");
}

export async function deleteArticleAction(form: FormData) {
  await requireAdmin();
  await deleteArticle(text(form, "slug"));
  revalidatePath("/", "layout");
  redirect("/admin/journal?deleted=1");
}

export async function logoutAction() {
  cookies().delete(ADMIN_COOKIE_NAME);
  redirect("/admin/login");
}
