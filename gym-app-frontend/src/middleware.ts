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
  // Debug: Afficher tous les cookies disponibles
  console.log("=== MIDDLEWARE DEBUG ===");
  console.log("URL:", request.url);
  console.log("Tous les cookies:", request.cookies.getAll());
  console.log(
    "Noms des cookies:",
    request.cookies.getAll().map((c) => c.name)
  );

  const token = request.cookies.get("token")?.value;
  console.log("Token récupéré:", token);
  console.log("========================");

  if (!token) {
    console.log("Pas de token trouvé, redirection vers /");
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // Construire l'URL correcte pour Vercel
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? `https://${request.headers.get("host")}`
        : process.env.NEXT_PUBLIC_API_URL;

    console.log("Base URL utilisée:", baseUrl);

    const apiUrl = baseUrl?.startsWith("http")
      ? `${baseUrl}/api/users/me`
      : `${process.env.NEXT_PUBLIC_API_URL}/users/me`;

    console.log("URL API finale:", apiUrl);

    const res = await fetch(apiUrl, {
      headers: {
        Cookie: `token=${token}`,
        "User-Agent": "NextJS-Middleware",
        "Content-Type": "application/json",
      },
    });

    console.log("Statut de la réponse API:", res.status);

    if (!res.ok) {
      console.log("Token invalide ou API erreur");
      throw new Error("Invalid token");
    }

    const user = await res.json();
    console.log("Utilisateur récupéré:", { id: user.id, role: user.role });

    const role = user.role;
    const pathname = request.nextUrl.pathname;

    const isAllowed = protectedRoutes[role]?.some((route) =>
      pathname.startsWith(route)
    );

    console.log("Route demandée:", pathname);
    console.log("Rôle utilisateur:", role);
    console.log("Accès autorisé:", isAllowed);

    if (!isAllowed) {
      console.log("Accès refusé, redirection vers /not-found");
      return NextResponse.redirect(new URL("/not-found", request.url));
    }

    console.log("Accès autorisé, continuation");
    return NextResponse.next();
  } catch (err) {
    console.log("Erreur dans le middleware:", err);
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
