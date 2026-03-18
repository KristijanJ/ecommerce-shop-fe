import "server-only";

import { cookies } from "next/headers";
import type { ProductType } from "@/types/ProductType";
import logger from "./logger";

const API_URL = process.env.API_URL || "http://localhost";
const API_PORT = process.env.API_PORT || "3000";

export async function getProducts(filters?: {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
}): Promise<{ products: ProductType[]; total: number }> {
  try {
    const params = new URLSearchParams();
    if (filters?.categoryId) params.set("category", filters.categoryId);
    if (filters?.search) params.set("search", filters.search);
    if (filters?.page) params.set("page", filters.page.toString());
    if (filters?.limit) params.set("limit", filters.limit.toString());

    const query = params.toString();
    const response = await fetch(
      `${API_URL}:${API_PORT}/products${query ? `?${query}` : ""}`,
      { next: { tags: ["products"] } },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    logger.error({ err: error }, "Error fetching products");
    return { products: [], total: 0 };
  }
}

export async function getMyProducts(filters?: {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
}): Promise<{ products: ProductType[]; total: number }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return { products: [], total: 0 };

    const params = new URLSearchParams();
    if (filters?.categoryId) params.set("category", filters.categoryId);
    if (filters?.search) params.set("search", filters.search);
    if (filters?.page) params.set("page", filters.page.toString());
    if (filters?.limit) params.set("limit", filters.limit.toString());

    const query = params.toString();

    const response = await fetch(
      `${API_URL}:${API_PORT}/products/mine${query ? `?${query}` : ""}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { tags: ["products"] },
      },
    );

    if (!response.ok) return { products: [], total: 0 };

    const data = await response.json();
    return data;
  } catch (error) {
    logger.error({ err: error }, "Error fetching my products");
    return { products: [], total: 0 };
  }
}

export async function getProduct(id: string): Promise<ProductType | null> {
  try {
    const response = await fetch(`${API_URL}:${API_PORT}/products/${id}`, {
      next: { tags: ["products"] },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    logger.error({ err: error }, "Error fetching product");
    return null;
  }
}
