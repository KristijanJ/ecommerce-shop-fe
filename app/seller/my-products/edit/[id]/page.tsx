import ProductForm from "@/components/ProductForm";
import { getCategories } from "@/app/lib/categories";
import { getProduct } from "@/app/lib/products";
import { getSession } from "@/app/lib/session";
import { notFound } from "next/navigation";

export default async function EditProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories, session] = await Promise.all([
    getProduct(id),
    getCategories(),
    getSession(),
  ]);

  if (!product) {
    notFound();
  }

  const isOwner = product.owner.id === session?.id;
  const isAdmin = session?.roles.includes("admin") ?? false;

  if (!isOwner && !isAdmin) {
    notFound();
  }

  return (
    <section className="min-h-screen flex justify-center items-center py-12 px-4">
      <ProductForm categories={categories} product={product} />
    </section>
  );
}
