"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import logger from "../lib/logger";

const API_URL = process.env.API_URL || "http://localhost";
const API_PORT = process.env.API_PORT || "3000";

export type SettingsState =
  | { error?: string; success?: string; fields?: Record<string, string> }
  | undefined;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export async function updateProfileAction(
  _prevState: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmNewPassword = formData.get("confirmNewPassword") as string;

  const fields = { firstName, lastName, email };

  if (!firstName || !lastName || !email) {
    return { error: "First name, last name, and email are required.", fields };
  }

  if (newPassword || currentPassword) {
    if (!currentPassword) {
      return { error: "Current password is required to set a new password.", fields };
    }
    if (!newPassword) {
      return { error: "Please enter a new password.", fields };
    }
    if (newPassword.length < 8) {
      return { error: "New password must be at least 8 characters.", fields };
    }
    if (newPassword !== confirmNewPassword) {
      return { error: "New passwords do not match.", fields };
    }
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const body: Record<string, string> = { firstName, lastName, email };
  if (newPassword) {
    body.currentPassword = currentPassword;
    body.newPassword = newPassword;
  }

  try {
    const response = await fetch(`${API_URL}:${API_PORT}/auth/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        return { error: "Current password is incorrect.", fields };
      }
      return { error: data.message ?? "Failed to update profile.", fields };
    }

    cookieStore.set("auth_token", data.token, cookieOptions);
  } catch (err) {
    logger.error({ err }, "Update profile network error");
    return { error: "Network error. Please check your connection.", fields };
  }

  revalidatePath("/account");
  return { success: "Profile updated successfully." };
}
