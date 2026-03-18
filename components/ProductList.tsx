"use client";

import Product from "@/components/Product";
import type { ProductType } from "@/types/ProductType";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const ProductList = ({
  products,
  total,
  page,
  perPage,
  title = "Explore Our Products",
  edit = false,
  baseRoute = "products",
}: {
  products: ProductType[];
  total: number;
  page: number;
  perPage: number;
  title?: string;
  edit?: boolean;
  baseRoute?: string;
}) => {
  const [pages, setPages] = useState(0);
  const searchParams = useSearchParams();

  useEffect(() => {
    setPages(Math.ceil(total / perPage));
  }, [total]);

  function buildHref(pageNum: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(pageNum));
    params.set("limit", String(perPage));
    return `/${baseRoute}?${params.toString()}`;
  }

  return (
    <section className="py-10">
      <div className="container mx-auto">
        <h1 className="text-3xl font-semibold mb-10 text-center">{title}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 lg:mx-8 gap-7.5 max-w-sm mx-auto md:max-w-none md:mx-0">
          {products.map((product) => {
            return <Product product={product} key={product.id} edit={edit} />;
          })}
        </div>
        <nav className="flex justify-center items-center gap-1 mt-10">
          {page > 1 && pages > 1 && (
            <Link
              href={buildHref(page - 1)}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              &larr; Prev
            </Link>
          )}
          {pages > 0 &&
            Array.from({ length: pages }, (_, index) => index + 1).map(
              (pageItem) => (
                <Link
                  href={buildHref(pageItem)}
                  key={pageItem}
                  className={`w-10 h-10 flex items-center justify-center text-sm font-medium border rounded-md transition-colors
                    ${
                      page === pageItem
                        ? "bg-primary text-white border-primary"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  {pageItem}
                </Link>
              ),
            )}
          {page < pages && pages > 1 && (
            <Link
              href={buildHref(page + 1)}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Next &rarr;
            </Link>
          )}
        </nav>
      </div>
    </section>
  );
};

export default ProductList;
