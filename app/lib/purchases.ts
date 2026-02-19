import "server-only";

import { cookies } from "next/headers";

const API_URL = process.env.API_URL || "http://localhost";
const API_PORT = process.env.API_PORT || "3000";

export async function getPurchase(purchaseId: number) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const response = await fetch(
    `${API_URL}:${API_PORT}/purchases/${purchaseId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  if (!response.ok) return null;

  const { data } = await response.json();
  return data;
}
