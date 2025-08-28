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
  const pathname = request.nextUrl.pathname;
  console.log("🔑 Token dans middleware:", token);

  // ✅ Si aucun token → rediriger vers page login
  if (!token) {
    console.log("🚨 Utilisateur non connecté → redirection");
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // ✅ Vérifie le token auprès de l'API
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      method: "GET",
      headers: {
        Cookie: `token=${token}`,
      },
      credentials: "include",
    });

    if (!res.ok) throw new Error("Invalid token");

    const user = await res.json();
    const role = user.role;

    // Vérifie les routes autorisées
    const allowedRoutes = protectedRoutes[role] || [];
    const isAllowed = allowedRoutes.some((route) => pathname.startsWith(route));

    if (!isAllowed) {
      console.log("⛔ Accès refusé → route protégée");
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
