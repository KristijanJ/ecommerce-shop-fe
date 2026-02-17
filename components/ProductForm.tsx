"use client";

import { useActionState } from "react";
import { productFormAction } from "@/app/actions/products";
import { ProductCategoryType, ProductType } from "@/types/ProductType";

interface ProductFormProps {
  categories: ProductCategoryType[];
  product?: ProductType;
}

function ProductForm({ categories, product }: ProductFormProps) {
  const [state, action, pending] = useActionState(productFormAction, undefined);

  const val = (field: string, fallback?: string | number) =>
    state?.fields?.[field] ?? String(fallback ?? "");

  return (
    <form
      action={action}
      className="w-full max-w-xl bg-white rounded-xl shadow-md p-8 space-y-5"
    >
      <h2 className="text-2xl font-bold text-gray-900">
        {product ? "Edit Product" : "Add New Product"}
      </h2>

      {product && <input type="hidden" name="productId" value={product.id} />}

      {state?.error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
          {state.error}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={val("title", product?.title)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          placeholder="e.g. Classic White T-Shirt"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              $
            </span>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0.01"
              required
              defaultValue={val("price", product?.price)}
              className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="stock"
            className="block text-sm font-medium text-gray-700"
          >
            Stock <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1">
            <input
              id="stock"
              name="stock"
              type="number"
              step="0.01"
              min="0.01"
              required
              defaultValue={val("stock", product?.stock)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="productCategoryId"
          className="block text-sm font-medium text-gray-700"
        >
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="productCategoryId"
          name="productCategoryId"
          required
          defaultValue={val("productCategoryId", product?.category?.id)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white"
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          required
          defaultValue={val("description", product?.description)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary resize-none"
          placeholder="Describe the product..."
        />
      </div>

      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700"
        >
          Image URL <span className="text-red-500">*</span>
        </label>
        <input
          id="image"
          name="image"
          type="url"
          required
          defaultValue={val("image", product?.image)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="ratingRate"
            className="block text-sm font-medium text-gray-700"
          >
            Rating{" "}
            <span className="text-gray-400 font-normal">(0–5, optional)</span>
          </label>
          <input
            id="ratingRate"
            name="ratingRate"
            type="number"
            step="0.1"
            min="0"
            max="5"
            defaultValue={val("ratingRate", product?.ratingRate)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="4.5"
          />
        </div>

        <div>
          <label
            htmlFor="ratingCount"
            className="block text-sm font-medium text-gray-700"
          >
            Rating Count{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="ratingCount"
            name="ratingCount"
            type="number"
            min="0"
            step="1"
            defaultValue={val("ratingCount", product?.ratingCount)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="120"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full py-3 px-4 bg-primary text-white font-medium rounded-md shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        {pending
          ? product
            ? "Saving changes..."
            : "Adding product..."
          : product
            ? "Save changes"
            : "Add product"}
      </button>
    </form>
  );
}

export default ProductForm;
