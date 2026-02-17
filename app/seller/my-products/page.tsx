import { getProducts } from "@/app/lib/products";
import ProductList from "@/components/ProductList";
import Link from "next/link";

export default async function MyProducts() {
  const products = await getProducts();

  return (
    <section className="h-screen flex justify-center items-center">
      <div className="text-center">
        <div className="flex justify-end">
          <Link
            href="/seller/my-products/new"
            className="bg-primary flex p-3 justify-center items-center text-white font-medium"
          >
            Add product
          </Link>
        </div>
        <ProductList title="My Products" products={products} edit={true} />
      </div>
    </section>
  );
}
