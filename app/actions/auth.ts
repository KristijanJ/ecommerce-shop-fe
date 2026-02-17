"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.API_URL || "http://localhost";
const API_PORT = process.env.API_PORT || "3000";

type AuthState = { error: string; fields?: Record<string, string> } | undefined;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function loginAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please fill in all fields", fields: { email } };
  }

  try {
    const response = await fetch(`${API_URL}:${API_PORT}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 404) {
        return { error: "Invalid email or password", fields: { email } };
      }
      return { error: data.error ?? "Login failed. Please try again.", fields: { email } };
    }

    const cookieStore = await cookies();
    cookieStore.set("auth_token", data.token, cookieOptions);
  } catch {
    return { error: "Network error. Please check your connection.", fields: { email } };
  }

  redirect("/");
}

export async function registerAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const confirmEmail = formData.get("confirmEmail") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;

  const fields = { email, confirmEmail, firstName, lastName };

  if (!email || !confirmEmail || !password || !firstName || !lastName) {
    return { error: "Please fill in all fields", fields };
  }

  if (email !== confirmEmail) {
    return { error: "Emails must match", fields };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters", fields };
  }

  try {
    const response = await fetch(`${API_URL}:${API_PORT}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        confirmEmail,
        password,
        firstName,
        lastName,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error ?? "Registration failed. Please try again.", fields };
    }

    const cookieStore = await cookies();
    cookieStore.set("auth_token", data.token, cookieOptions);
  } catch {
    return { error: "Network error. Please check your connection.", fields };
  }

  redirect("/");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  redirect("/login");
}
