"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";

const API_URL = process.env.API_URL || "http://localhost";
const API_PORT = process.env.API_PORT || "3000";

export type ProductFormState =
  | { error: string; fields?: Record<string, string> }
  | undefined;

export async function checkoutFormAction(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const cart = formData.get("cart") as string;

  if (!cart) {
    return { error: "Your cart is empty" };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  console.log("Checkout form submitted with cart:", cart);

  try {
    const response = await fetch(`${API_URL}:${API_PORT}/purchases`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: cart,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.message || "Checkout failed" };
    }

    revalidateTag("cart", "max");
    redirect("/order-confirmation");
  } catch (error) {
    return { error: "An unexpected error occurred. Please try again." };
  }
}
