"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { updateCart } from "./cart";
import logger from "../lib/logger";

const API_URL = process.env.API_URL || "http://localhost";
const API_PORT = process.env.API_PORT || "3000";

export type CheckoutState =
  | { error: string; fields?: Record<string, string> }
  | undefined;

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value;
}

export async function checkoutFormAction(
  _prevState: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const cart = formData.get("cart") as string;

  if (!cart) {
    return { error: "Your cart is empty" };
  }

  const token = await getToken();

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
    logger.warn({ status: response.status }, "Checkout failed");
    return { error: errorData.error || "Checkout failed. Please try again." };
  }

  const { data: purchase } = await response.json();
  logger.info({ purchaseId: purchase.id }, "Purchase created");
  await updateCart([]);
  redirect(`/checkout/payment/${purchase.id}`);
}

export async function paymentAction(
  _prevState: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const purchaseId = parseInt(formData.get("purchaseId") as string, 10);

  if (!purchaseId) {
    return { error: "Invalid purchase." };
  }

  const token = await getToken();

  const response = await fetch(`${API_URL}:${API_PORT}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ purchaseId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    logger.warn({ purchaseId, status: response.status }, "Payment failed");
    return { error: errorData.error || "Payment failed. Please try again." };
  }

  logger.info({ purchaseId }, "Payment completed");
  redirect(`/order-confirmation/${purchaseId}`);
}
