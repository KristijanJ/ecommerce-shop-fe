"use client";

import { useContext, useState } from "react";
import { BsPlus, BsPencil, BsTrash3 } from "react-icons/bs";
import { CartContext } from "@/contexts/CartContext";
import type { ProductType } from "@/types/ProductType";
import Link from "next/link";
import Modal from "./Modal";
import { deleteProduct } from "@/app/actions/products";

const Product = ({
  product,
  edit = false,
}: {
  product: ProductType;
  edit?: boolean;
}) => {
  const { addToCart } = useContext(CartContext);
  const [isProductDeleteModalOpen, setIsProductDeleteModalOpen] =
    useState(false);

  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteProduct(id.toString());
    } catch (error) {
      console.error("Error deleting product:", error);
    }
    setIsProductDeleteModalOpen(false);
  };

  const { id, image, category, title, price, stock } = product;
  return (
    <div className="border border-[#e4e4e4] flex flex-col">
      <div className="h-48 flex justify-center items-center p-4">
        <img className="max-h-40 object-contain" src={image} alt="" />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="text-sm capitalize text-gray-500 mb-1">
          {category.name}
        </div>
        <Link href={`/product/${id}`}>
          <h2 className="font-semibold mb-1">{title}</h2>
        </Link>
        <div className="font-semibold mb-1">$ {price}</div>
        {stock === 0 ? (
          <div className="text-red-500 text-sm mb-3">Out of stock</div>
        ) : (
          <div className="text-sm mb-3">In Stock: {stock}</div>
        )}

        <div className="flex items-center gap-2 mt-auto">
          {!edit ? (
            <button
              onClick={() => addToCart(product, id)}
              className="flex-1 bg-teal-500 text-white py-2 px-4 text-sm font-medium cursor-pointer"
            >
              Add to Cart
            </button>
          ) : (
            <>
              <Link
                href={`/seller/my-products/edit/${id}`}
                className="flex-1 bg-teal-500 text-white py-2 px-4 text-sm font-medium text-center"
              >
                Edit
              </Link>
              <button
                onClick={() => setIsProductDeleteModalOpen(true)}
                className="py-2 px-2 flex justify-center items-center text-red-500 border border-red-200 cursor-pointer"
              >
                <BsTrash3 />
              </button>
            </>
          )}
        </div>
      </div>

      <Modal
        title="Delete Product"
        content={
          <div className="flex flex-col gap-2 mb-6">
            <p>Are you sure you want to delete the product?</p>
            <p className="font-semibold">{product.title}</p>
          </div>
        }
        open={isProductDeleteModalOpen}
        onClose={() => setIsProductDeleteModalOpen(false)}
        onConfirm={() => handleDeleteProduct(id)}
      />
    </div>
  );
};

export default Product;
