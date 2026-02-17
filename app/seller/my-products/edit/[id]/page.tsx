import ProductForm from "@/components/ProductForm";
import { getCategories } from "@/app/lib/categories";
import { getProduct } from "@/app/lib/products";
import { notFound } from "next/navigation";

export default async function EditProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  const categories = await getCategories();

  if (!product) {
    notFound();
  }

  return (
    <section className="min-h-screen flex justify-center items-center py-12 px-4">
      <ProductForm categories={categories} product={product} />
    </section>
  );
}
