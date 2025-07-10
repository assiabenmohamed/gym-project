import { NextRequest, NextResponse } from "next/server";

const protectedRoutes: { [key: string]: string[] } = {
  admin: [
    "/admin",
    "/dashboard",
    "/members",
    "/subscription-plans",
    "/payments",
    "/trainers",
  ],
  trainer: ["/dashboard", "/programs", "/exercises", "/body-tracking-coach"],
  member: ["/dashboard", "/sessions", "/exercises-list", "/body-tracking"],
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url)); // Not logged in
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      headers: {
        Cookie: `token=${token}`,
      },
    });

    if (!res.ok) throw new Error("Invalid token");

    const user = await res.json();
    const role = user.role;
    const pathname = request.nextUrl.pathname;

    const isAllowed = protectedRoutes[role]?.some((route) =>
      pathname.startsWith(route)
    );

    if (!isAllowed) {
      return NextResponse.redirect(new URL("/not-found", request.url)); // Or /unauthorized
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/members/:path*",
    "/subscription-plans/:path*",
    "/payments/:path*",
    "/trainers/:path*",
    "/programs/:path*",
    "/exercises/:path*",
    "/body-tracking-coach/:path*",
    "/sessions/:path*",
    "/exercises-list/:path*",
    "/body-tracking/:path*",
  ],
};
