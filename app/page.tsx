import Hero from "@/components/Hero";
import ProductList from "@/components/ProductList";
import ProductFilters from "@/components/ProductFilters";
import { getProducts } from "@/app/lib/products";
import { getCategories } from "@/app/lib/categories";

const shopName = process.env.SHOP_NAME || "My Shop";
const shopDescription = process.env.SHOP_DESCRIPTION || "Welcome to our shop!";

interface HomeProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { category, search } = await searchParams;

  const [productData, categories] = await Promise.all([
    getProducts({ categoryId: category, search, limit: 10, page: 1 }),
    getCategories(),
  ]);

  return (
    <div>
      <Hero shopName={shopName} shopDescription={shopDescription} />
      <ProductFilters categories={categories} />
      <ProductList
        products={productData.products}
        total={productData.total}
        page={1}
        perPage={10}
      />
    </div>
  );
}
