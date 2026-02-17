"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";

const API_URL = process.env.API_URL || "http://localhost";
const API_PORT = process.env.API_PORT || "3000";

export type ProductFormState =
  | { error: string; fields?: Record<string, string> }
  | undefined;

export async function productFormAction(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const productId = formData.get("productId") as string | null;
  const title = formData.get("title") as string;
  const price = formData.get("price") as string;
  const description = formData.get("description") as string;
  const image = formData.get("image") as string;
  const productCategoryId = formData.get("productCategoryId") as string;
  const ratingRate = formData.get("ratingRate") as string;
  const ratingCount = formData.get("ratingCount") as string;

  const fields = {
    title,
    price,
    description,
    image,
    productCategoryId,
    ratingRate,
    ratingCount,
  };

  if (!title || !price || !description || !image || !productCategoryId) {
    return { error: "Please fill in all required fields", fields };
  }

  const priceNum = parseFloat(price);
  if (isNaN(priceNum) || priceNum <= 0) {
    return { error: "Price must be a positive number", fields };
  }

  try {
    new URL(image);
  } catch {
    return { error: "Image must be a valid URL", fields };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return { error: "You must be logged in to manage products", fields };
  }

  const body: Record<string, unknown> = {
    title,
    price: priceNum,
    description,
    image,
    productCategoryId: parseInt(productCategoryId),
    ...(ratingRate ? { ratingRate: parseFloat(ratingRate) } : {}),
    ...(ratingCount ? { ratingCount: parseInt(ratingCount) } : {}),
  };

  try {
    const isEdit = !!productId;
    const url = isEdit
      ? `${API_URL}:${API_PORT}/products/${productId}`
      : `${API_URL}:${API_PORT}/products`;

    const response = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error ?? "Failed to save product. Please try again.",
        fields,
      };
    }
  } catch {
    return { error: "Network error. Please check your connection.", fields };
  }

  revalidateTag("products", "max");
  redirect("/seller/my-products");
}
