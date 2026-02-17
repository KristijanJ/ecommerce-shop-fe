import { ProductCategoryType } from "@/types/ProductType";

const API_URL = process.env.API_URL || "http://localhost";
const API_PORT = process.env.API_PORT || "3000";

export async function getCategories(): Promise<ProductCategoryType[]> {
  try {
    const res = await fetch(`${API_URL}:${API_PORT}/categories`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.data;
  } catch {
    return [];
  }
}
