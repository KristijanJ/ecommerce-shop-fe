import ProductForm from "@/components/ProductForm";
import { getCategories } from "@/app/lib/categories";

export default async function NewProduct() {
  const categories = await getCategories();

  return (
    <section className="min-h-screen flex justify-center items-center py-12 px-4">
      <ProductForm categories={categories} />
    </section>
  );
}
