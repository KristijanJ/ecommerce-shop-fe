import Hero from "@/components/Hero";
import ProductList from "@/components/ProductList";
import { getProducts } from "@/lib/api";

export default async function Home() {
  const products = await getProducts();

  return (
    <div>
      <Hero />
      <ProductList products={products} />
    </div>
  );
}
