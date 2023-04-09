import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const req = request;
  const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });

  console.log(token, "middleware");

  if (!token) {
    return NextResponse.rewrite(new URL("/login", request.url));
  }

  if (!token && pathname !== "/login") {
    return NextResponse.rewrite(new URL("/login", request.url));
  }

  if (token) return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|login|register|_next/static|_next/image|favicon.ico).*)",
  ],
};
