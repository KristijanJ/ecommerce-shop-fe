"use client";

import { useContext, useState } from "react";
import { BsPlus, BsEyeFill, BsPencil, BsTrash3 } from "react-icons/bs";
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
    <div>
      <div className="border border-[#e4e4e4] h-75 mb-4 relative overflow-hidden group transition">
        <div className="w-full h-full flex justify-center items-center">
          <div className="w-50 mx-auto flex justify-center items-center">
            <img
              className="max-h-40 group-hover:scale-110 transition duration-300"
              src={image}
              alt=""
            />
          </div>
        </div>

        <div className="absolute top-6 -right-11 group-hover:right-5 p-2 flex flex-col justify-center items-center gap-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          {!edit ? (
            <button
              onClick={() => addToCart(product, id)}
              className="cursor-pointer"
            >
              <div className="flex justify-center items-center text-white w-12 h-12 bg-teal-500">
                <BsPlus className="text-3xl" />
              </div>
            </button>
          ) : (
            <>
              <Link
                href={`/seller/my-products/edit/${id}`}
                className="w-12 h-12 bg-teal-500 flex justify-center items-center text-white drop-shadow-xl"
              >
                <BsPencil />
              </Link>
              <button
                onClick={() => setIsProductDeleteModalOpen(true)}
                className="cursor-pointer"
              >
                <div className="flex justify-center items-center text-white w-12 h-12 bg-red-500">
                  <BsTrash3 className="text-3xl" />
                </div>
              </button>
            </>
          )}
          <Link
            href={`/product/${id}`}
            className="w-12 h-12 bg-white flex justify-center items-center text-primary drop-shadow-xl"
          >
            <BsEyeFill />
          </Link>
        </div>
      </div>

      <div>
        <div className="tex-sm capitalize text-gray-500 mb-1">
          {category.name}
        </div>
        <Link href={`/product/${id}`}>
          <h2 className="font-semibold mb-1">{title}</h2>
        </Link>

        <div className="font-semibold">$ {price}</div>
        {stock === 0 ? (
          <div className="text-red-500">Out of stock</div>
        ) : (
          <div>In Stock: {stock}</div>
        )}
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
