import { getCategories } from "@/app/lib/categories";
import { getMyProducts } from "@/app/lib/products";
import ProductFilters from "@/components/ProductFilters";
import ProductList from "@/components/ProductList";
import Link from "next/link";

interface MyProductsProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function MyProducts({ searchParams }: MyProductsProps) {
  const { category, search, page, limit } = await searchParams;

  let pageInt = parseInt(page ?? "0");
  if (isNaN(pageInt)) pageInt = 0;

  let limitInt = parseInt(limit ?? "10");
  if (isNaN(limitInt) || limitInt < 0) limitInt = 10;

  const [productData, categories] = await Promise.all([
    getMyProducts({
      categoryId: category,
      search,
      page: pageInt,
      limit: limitInt,
    }),
    getCategories(),
  ]);

  return (
    <section className="py-24">
      <div className="container mx-auto">
        <div>
          <div className="flex justify-end">
            <Link
              href="/seller/my-products/new"
              className="bg-primary flex p-3 justify-center items-center text-white font-medium"
            >
              Add product
            </Link>
          </div>
          <ProductFilters categories={categories} baseRoute="seller/my-products" />
          <ProductList
            title="My Products"
            products={productData.products}
            edit={true}
            page={pageInt}
            total={productData.total}
            perPage={limitInt}
            baseRoute="seller/my-products"
          />
        </div>
      </div>
    </section>
  );
}
