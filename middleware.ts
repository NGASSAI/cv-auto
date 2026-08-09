import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(request) {
    const token = request.nextauth.token;
    const cheminActuel = request.nextUrl.pathname;

    // Zone admin : réservée au rôle ADMIN
    if (cheminActuel.startsWith("/admin")) {
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Vérifie simplement qu'un token existe (utilisateur connecté)
      // La logique de rôle plus fine est gérée dans middleware() ci-dessus
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/connexion",
    },
  }
);

export const config = {
  // Le middleware s'applique uniquement à ces routes —
  // tout le reste (marketing, auth, api publique) n'est pas concerné
  matcher: ["/dashboard/:path*", "/admin/:path*", "/editor/:path*"],
};