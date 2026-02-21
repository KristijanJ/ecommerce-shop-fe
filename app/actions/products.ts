"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";

const API_URL = process.env.API_URL || "http://localhost";
const API_PORT = process.env.API_PORT || "3000";

export type ProductFormState =
  | { error: string; fields?: Record<string, string> }
  | undefined;

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value;
}

export async function productFormAction(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const productId = formData.get("productId") as string | null;
  const title = formData.get("title") as string;
  const price = formData.get("price") as string;
  const description = formData.get("description") as string;
  const image = formData.get("image") as string;
  const productCategoryId = formData.get("productCategoryId") as string;
  const ratingRate = formData.get("ratingRate") as string;
  const ratingCount = formData.get("ratingCount") as string;
  const stock = formData.get("stock") as string;

  const fields = {
    title,
    price,
    description,
    image,
    productCategoryId,
    ratingRate,
    ratingCount,
    stock,
  };

  if (
    !title ||
    !price ||
    !description ||
    !image ||
    !productCategoryId ||
    !stock
  ) {
    return { error: "Please fill in all required fields", fields };
  }

  const priceNum = parseFloat(price);
  if (isNaN(priceNum) || priceNum <= 0) {
    return { error: "Price must be a positive number", fields };
  }

  const stockNum = parseInt(stock);
  if (isNaN(stockNum) || stockNum <= 0) {
    return { error: "Stock must be a positive number", fields };
  }

  try {
    new URL(image);
  } catch {
    return { error: "Image must be a valid URL", fields };
  }

  const token = await getToken();

  if (!token) {
    return { error: "You must be logged in to manage products", fields };
  }

  const body: Record<string, unknown> = {
    title,
    price: priceNum,
    stock: stockNum,
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

    console.log(body);

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

export async function deleteProduct(id: string) {
  try {
    const token = await getToken();

    if (!token) {
      throw new Error("You must be logged in to manage products");
    }

    const response = await fetch(`${API_URL}:${API_PORT}/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      next: { tags: ["products"] },
    });

    if (!response.ok) {
      throw new Error("Failed to delete product");
    }

    revalidateTag("products", "max");
  } catch (error) {
    console.error("Error deleting product:", error);
    return null;
  }
}
