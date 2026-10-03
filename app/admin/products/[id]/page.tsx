import { notFound } from "next/navigation";
import { listProductsForAdmin } from "@/lib/productStore";
import ProductForm from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProduct({ params, searchParams }: { params: { id: string }; searchParams: { error?: string } }) {
  const product = (await listProductsForAdmin()).find((p) => p.id === params.id);
  if (!product) notFound();
  return <ProductForm product={product} error={searchParams.error} />;
}
