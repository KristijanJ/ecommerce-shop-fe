"use client";

import { useContext } from "react";
import { CartContext } from "@/contexts/CartContext";
import type { ProductType } from "@/types/ProductType";

const ProductDetailView = ({ product }: { product: ProductType }) => {
  const { addToCart } = useContext(CartContext);
  const { title, price, description, image, stock } = product;

  return (
    <section className="pt-112.5 md:pt-32 pb-100 md:pb-12 lg:py-32 h-screen flex items-center">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="flex flex-1 justify-center items-center mb-8 lg:mb-0">
            <img className="max-w-50 lg:max-w-xs" src={image} alt="" />
          </div>

          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-[26px] font-medium mb-2 max-w-112.5 mx-auto lg:mx-0">
              {title}
            </h1>
            <p className="mb-2">{description}</p>
            <p className="mb-8">In Stock: {stock}</p>
            <button
              onClick={() => addToCart(product, product.id)}
              className="bg-primary py-4 px-8 text-white"
            >
              Add to cart - ${price}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailView;
