import ProductForm from "../ProductForm";

export default function NewProduct({ searchParams }: { searchParams: { error?: string } }) {
  return <ProductForm error={searchParams.error} />;
}
