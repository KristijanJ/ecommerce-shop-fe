"use server";

import ProductList from "@/components/ProductList";
import ProductFilters from "@/components/ProductFilters";
import { getProducts } from "@/app/lib/products";
import { getCategories } from "@/app/lib/categories";

interface HomeProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { category, search } = await searchParams;

  const [products, categories] = await Promise.all([
    getProducts({ categoryId: category, search }),
    getCategories(),
  ]);

  return (
    <div className="pt-20">
      <ProductFilters categories={categories} />
      <ProductList products={products} />
    </div>
  );
}
