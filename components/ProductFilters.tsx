"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import type { ProductCategoryType } from "@/types/ProductType";
import { IoSearchOutline } from "react-icons/io5";

interface ProductFiltersProps {
  categories: ProductCategoryType[];
}

export default function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeCategory = searchParams.get("category") ?? "";
  const activeSearch = searchParams.get("search") ?? "";

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      startTransition(() => {
        router.push(`/?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams],
  );

  const handleSearchSubmit = useCallback(
    (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();
      const value = (
        e.currentTarget.elements.namedItem("search") as HTMLInputElement
      ).value;
      updateParams({ search: value });
    },
    [updateParams],
  );

  const handleCategory = useCallback(
    (categoryId: string) => {
      updateParams({ category: categoryId });
    },
    [updateParams],
  );

  return (
    <section
      className={`py-6 transition-opacity ${isPending ? "opacity-50" : ""}`}
    >
      <div className="container mx-auto flex flex-col gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-sm flex">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            key={activeSearch}
            name="search"
            type="text"
            placeholder="Search products..."
            defaultValue={activeSearch}
            className="w-full border pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
          >
            Search
          </button>
        </form>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategory("")}
            className={`px-4 py-1.5 text-sm border transition-colors cursor-pointer capitalize ${
              activeCategory === ""
                ? "bg-primary text-white border-primary"
                : "border-gray-300 text-gray-600 hover:border-primary hover:text-primary"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategory(String(cat.id))}
              className={`px-4 py-1.5 text-sm border transition-colors cursor-pointer capitalize ${
                activeCategory === String(cat.id)
                  ? "bg-primary text-white border-primary"
                  : "border-gray-300 text-gray-600 hover:border-primary hover:text-primary"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
