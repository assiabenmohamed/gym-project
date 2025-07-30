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
console.log("token",token);
  // 🔒 Rediriger si non connecté
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      method: "GET",
      headers: {
        Cookie: `token=${token}`,
      },
      credentials: "include", // ✅ pour s'assurer que le cookie est bien envoyé
    });

    if (!res.ok) throw new Error("Invalid token");

    const user = await res.json();
    const role = user.role;
    const pathname = request.nextUrl.pathname;

    const allowedRoutes = protectedRoutes[role] || [];

    const isAllowed = allowedRoutes.some((route) => pathname.startsWith(route));

    // 🔒 Rediriger si la route n'est pas autorisée pour ce rôle
    if (!isAllowed) {
      return NextResponse.redirect(new URL("/not-found", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware auth error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    "/dashboard",
    "/admin",
    "/members",
    "/subscription-plans",
    "/payments",
    "/trainers",
    "/programs",
    "/exercises",
    "/body-tracking-coach",
    "/sessions",
    "/exercises-list",
    "/body-tracking",
  ],
};
