"use server";

import ProductList from "@/components/ProductList";
import ProductFilters from "@/components/ProductFilters";
import { getProducts } from "@/app/lib/products";
import { getCategories } from "@/app/lib/categories";

interface HomeProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { category, search, page, limit } = await searchParams;

  let pageInt = parseInt(page ?? "0");
  if (isNaN(pageInt)) pageInt = 0;

  let limitInt = parseInt(limit ?? "10");
  if (isNaN(limitInt) || limitInt < 0) limitInt = 10;

  const [productData, categories] = await Promise.all([
    getProducts({
      categoryId: category,
      search,
      page: pageInt,
      limit: limitInt,
    }),
    getCategories(),
  ]);

  return (
    <div className="pt-20">
      <ProductFilters categories={categories} />
      <ProductList
        products={productData.products}
        total={productData.total}
        page={pageInt}
        perPage={limitInt}
      />
    </div>
  );
}
