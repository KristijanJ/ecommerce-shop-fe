import "server-only";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { UserType } from "@/types/UserType";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function getSession(): Promise<UserType | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);

    if (!payload.id || !payload.email) return null;

    return {
      id: payload.id as number,
      email: payload.email as string,
      firstName: payload.firstName as string,
      lastName: payload.lastName as string,
      roles: payload.roles as string[],
    };
  } catch {
    return null;
  }
}
