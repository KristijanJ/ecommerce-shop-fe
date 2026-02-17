import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/account", "/checkout"];
const publicOnlyRoutes = ["/login", "/register"];

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get("auth_token")?.value;

  const isProtected = protectedRoutes.some((r) => path.startsWith(r));
  const isPublicOnly = publicOnlyRoutes.includes(path);

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicOnly && token) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
