"use client";

import Product from "@/components/Product";
import type { ProductType } from "@/types/ProductType";

const ProductList = ({
  products,
  title = "Explore Our Products",
}: {
  products: ProductType[];
  title?: string;
}) => {
  return (
    <section className="py-20">
      <div className="container mx-auto">
        <h1 className="text-3xl font-semibold mb-10 text-center">{title}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 lg:mx-8 gap-7.5 max-w-sm mx-auto md:max-w-none md:mx-0">
          {products.map((product) => {
            return <Product product={product} key={product.id} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
