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
  console.log("token ", token);
  // ✅ Redirection si pas connecté
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // ✅ Appel vers le backend avec le token dans l'en-tête Cookie
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      method: "GET",
      headers: {
        Cookie: `token=${token}`, // important pour authentifier côté serveur
      },
    });

    if (!res.ok) throw new Error("Invalid token");

    const user = await res.json();
    const role = user.role;
    const pathname = request.nextUrl.pathname;

    // ✅ Vérifie si l'utilisateur a accès à la route
    const isAllowed = protectedRoutes[role]?.some((route) =>
      pathname.startsWith(route)
    );

    if (!isAllowed) {
      return NextResponse.redirect(new URL("/not-found", request.url));
    }

    return NextResponse.next();
  } catch (err) {
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
