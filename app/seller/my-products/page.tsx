import { getMyProducts } from "@/app/lib/products";
import ProductList from "@/components/ProductList";
import Link from "next/link";

export default async function MyProducts() {
  const products = await getMyProducts();

  return (
    <section className="py-24">
      <div className="container mx-auto">
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
      </div>
    </section>
  );
}
