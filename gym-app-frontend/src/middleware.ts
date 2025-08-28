// 🔍 PROBLÈME IDENTIFIÉ: Le cookie existe mais n'est pas lu correctement par le middleware

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
  const pathname = request.nextUrl.pathname;

  // ✅ MÉTHODES MULTIPLES pour récupérer le token
  console.log("🍪 === DEBUG COOKIES DÉTAILLÉ ===");
  console.log("1. Tous les cookies:", request.cookies.getAll());
  console.log("2. Cookie token direct:", request.cookies.get("token"));
  console.log("3. Headers Cookie brut:", request.headers.get("cookie"));

  // ✅ Méthode 1: Via Next.js cookies
  const tokenFromNextCookies = request.cookies.get("token")?.value;

  // ✅ Méthode 2: Parse manuel des headers cookies
  const cookieHeader = request.headers.get("cookie") || "";
  const tokenFromHeader = cookieHeader
    .split(";")
    .find((cookie) => cookie.trim().startsWith("token="))
    ?.split("=")[1];

  // ✅ Méthode 3: Regex pour extraire le token
  const tokenRegex = /token=([^;]+)/;
  const tokenMatch = cookieHeader.match(tokenRegex);
  const tokenFromRegex = tokenMatch ? tokenMatch[1] : undefined;

  console.log("🔑 Tokens extraits:");
  console.log("  - Next.js cookies:", tokenFromNextCookies);
  console.log("  - Parse manuel:", tokenFromHeader);
  console.log("  - Regex:", tokenFromRegex);

  // ✅ Utiliser le premier token valide trouvé
  const token = tokenFromNextCookies || tokenFromHeader || tokenFromRegex;

  console.log("🎯 Token final sélectionné:", token);
  console.log("📍 Pathname:", pathname);

  if (!token) {
    console.log("🚨 Aucun token trouvé → redirection login");
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // ✅ Appel API avec plusieurs formats de headers
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    console.log("🌐 API URL:", apiUrl);

    const response = await fetch(`${apiUrl}/users/me`, {
      method: "GET",
      headers: {
        // ✅ Envoyer le token dans plusieurs formats
        Authorization: `Bearer ${token}`,
        Cookie: `token=${token}`,
        "Content-Type": "application/json",
        "User-Agent": "NextJS-Middleware",
      },
      // ✅ Pour cross-domain (Render + Vercel)
      credentials: "include",
    });

    console.log("📡 API Response:");
    console.log("  - Status:", response.status);
    console.log("  - Headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      console.log("❌ Réponse API non OK:");
      const errorText = await response.text();
      console.log("  - Error body:", errorText);
      throw new Error(`API Error: ${response.status} ${errorText}`);
    }

    const user = await response.json();
    console.log("👤 Utilisateur récupéré:", user);

    const role = user.role;
    if (!role) {
      console.log("❌ Pas de rôle dans la réponse utilisateur");
      throw new Error("No role found in user data");
    }

    // ✅ Vérification des permissions
    const allowedRoutes = protectedRoutes[role] || [];
    const isAllowed = allowedRoutes.some((route) => pathname.startsWith(route));

    console.log("🔐 Vérification permissions:");
    console.log("  - Rôle utilisateur:", role);
    console.log("  - Routes autorisées:", allowedRoutes);
    console.log("  - Route demandée:", pathname);
    console.log("  - Accès autorisé:", isAllowed);

    if (!isAllowed) {
      console.log("⛔ Accès refusé → redirection 404");
      return NextResponse.redirect(new URL("/not-found", request.url));
    }

    console.log("✅ Accès autorisé, continuation...");
    return NextResponse.next();
  } catch (error) {
    console.error("❌ Erreur dans le middleware:", error);
    console.error(
      "❌ Stack trace:",
      error instanceof Error ? error.stack : "No stack"
    );

    // ✅ Nettoyer les cookies invalides et rediriger
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("token");
    console.log("🧹 Cookie token supprimé, redirection vers login");

    return response;
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

// ✅ SOLUTION ALTERNATIVE: Middleware simplifié pour debug
export async function middlewareSimple(request: NextRequest) {
  console.log("🚀 Middleware simple démarré");

  // Laisser passer temporairement pour debug
  return NextResponse.next();
}
