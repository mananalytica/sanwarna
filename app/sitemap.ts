import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { ARTICLES } from "@/lib/journal";
import { PAGES } from "@/lib/pages";
import { getAllProducts } from "@/lib/getProducts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL;
  const staticRoutes = [
    "",
    "/shop",
    "/journal",
    ...ARTICLES.map((a) => `/journal/${a.slug}`),
    ...Object.keys(PAGES).map((p) => `/${p}`),
  ].map(
    (route) => ({
      url: `${base}${route}`,
      lastModified: new Date(),
    })
  );
  const products = await getAllProducts();
  const productRoutes = products.map((p) => ({
    url: `${base}/shop/${p.slug}`,
    lastModified: new Date(),
  }));
  return [...staticRoutes, ...productRoutes];
}
