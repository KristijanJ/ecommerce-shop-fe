import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./app/lib/session";

const protectedRoutes = ["/seller"];
const publicOnlyRoutes = ["/login", "/register"];

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const user = await getSession();

  const isProtected = protectedRoutes.some((r) => path.startsWith(r));
  const isPublicOnly = publicOnlyRoutes.includes(path);

  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicOnly && user) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
