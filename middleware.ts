import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/shared/lib/prisma";

export const runtime = "nodejs";

let cacheMaintenance: { actif: boolean; expireLe: number } | null = null;
const DUREE_CACHE_MS = 5000;

async function siteEnMaintenance(): Promise<boolean> {
  if (cacheMaintenance && cacheMaintenance.expireLe > Date.now()) {
    return cacheMaintenance.actif;
  }

  try {
    const parametres = await prisma.parametresSite.findUnique({
      where: { id: "parametres" },
    });

    const actif = parametres?.modeMaintenance ?? false;
    cacheMaintenance = { actif, expireLe: Date.now() + DUREE_CACHE_MS };
    return actif;
  } catch {
    // En cas d'erreur DB (ex: Neon en veille), on NE bloque JAMAIS le site.
    // Mieux vaut un site accessible qu'un site verrouillé par accident.
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const cheminActuel = request.nextUrl.pathname;

  const cheminsToujoursAutorises = ["/connexion", "/maintenance", "/apres-connexion"];
  if (cheminsToujoursAutorises.includes(cheminActuel)) {
    return NextResponse.next();
  }

  // Détection automatique du protocole pour les cookies sécurisés
  const estHttps = request.nextUrl.protocol === "https:" || 
                   request.headers.get("x-forwarded-proto") === "https";

  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: estHttps,
  });

  if (token?.role !== "ADMIN") {
    const maintenance = await siteEnMaintenance();
    if (maintenance) {
      return NextResponse.redirect(new URL("/maintenance", request.url));
    }
  }

  const zonesProtegees = ["/dashboard", "/admin", "/editor"];
  const estZoneProtegee = zonesProtegees.some((zone) => cheminActuel.startsWith(zone));

  if (estZoneProtegee) {
    if (!token) {
      return NextResponse.redirect(new URL("/connexion", request.url));
    }

    if (cheminActuel.startsWith("/admin") && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};