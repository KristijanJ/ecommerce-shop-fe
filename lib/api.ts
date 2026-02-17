import type { ProductType } from "@/types/ProductType";

const API_URL = process.env.API_URL || "http://localhost";
const API_PORT = process.env.API_PORT || "3000";

export async function getProducts(): Promise<ProductType[]> {
  try {
    const response = await fetch(`${API_URL}:${API_PORT}/products`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProduct(id: string): Promise<ProductType | null> {
  try {
    const response = await fetch(`${API_URL}:${API_PORT}/products/${id}`, {
      next: { revalidate: 30 }, // Cache for 30 seconds
    });

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}
