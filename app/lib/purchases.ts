import "server-only";

import { cookies } from "next/headers";

const API_URL = process.env.API_URL || "http://localhost";
const API_PORT = process.env.API_PORT || "3000";

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value;
}

export async function getPurchases() {
  const token = await getToken();

  const response = await fetch(`${API_URL}:${API_PORT}/purchases`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) return [];

  const { data } = await response.json();
  return data;
}

export async function getPurchase(purchaseId: number) {
  const token = await getToken();

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
