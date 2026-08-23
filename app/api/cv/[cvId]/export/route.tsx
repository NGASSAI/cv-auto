import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { obtenirParametresSite } from "@/features/admin/api/parametres.service";
import { recupererCVComplet, ErreurCV } from "@/features/cv/api/cv.service";
import { genererTokenImpression } from "@/features/cv/lib/token-impression";

/**
 * L'URL de base Browserless dépend de la région assignée à ton compte
 * (visible dans ton dashboard Browserless). Configurable via variable
 * d'environnement pour ne pas la coder en dur.
 */
const URL_BASE_BROWSERLESS = process.env.BROWSERLESS_BASE_URL ?? "https://production-sfo.browserless.io";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cvId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  const { cvId } = await params;

  try {
    const parametres = await obtenirParametresSite();
    if (!parametres.exportPdfActif) {
      return NextResponse.json(
        { erreur: "L'export PDF est temporairement désactivé" },
        { status: 403 }
      );
    }

    // Vérifie que le CV existe et appartient bien à l'utilisateur avant
    // d'appeler l'API externe (échec rapide, pas d'appel payant inutile).
    const cv = await recupererCVComplet(cvId, session.user.id);

    const tokenBrowserless = process.env.BROWSERLESS_API_TOKEN;
    if (!tokenBrowserless) {
      console.error("BROWSERLESS_API_TOKEN n'est pas définie dans les variables d'environnement.");
      return NextResponse.json({ erreur: "Une erreur interne est survenue" }, { status: 500 });
    }

    // Même page d'impression et même token interne que la tentative
    // Puppeteer précédente : Browserless va simplement ouvrir cette URL
    // lui-même (avec un vrai Chromium hébergé) et la convertir.
    const tokenImpression = genererTokenImpression(cvId, session.user.id);
    const urlImpression = new URL(`/imprimer/cv/${cvId}`, request.nextUrl.origin);
    urlImpression.searchParams.set("token", tokenImpression);

    // Contourne le mur "Log in to Vercel" sur les déploiements Preview
    // (Deployment Protection), pour que Browserless puisse atteindre la
    // page d'impression sans être bloqué. Sans effet en production si
    // la protection y est désactivée — le paramètre est juste ignoré.
    const secretBypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
    if (secretBypass) {
      urlImpression.searchParams.set("x-vercel-protection-bypass", secretBypass);
      urlImpression.searchParams.set("x-vercel-set-bypass-cookie", "true");
    }

    const urlBrowserless = new URL("/pdf", URL_BASE_BROWSERLESS);
    urlBrowserless.searchParams.set("token", tokenBrowserless);

    const reponseBrowserless = await fetch(urlBrowserless.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: urlImpression.toString(),
        options: {
          format: "A4",
          printBackground: true,
          preferCSSPageSize: true,
        },
      }),
    });

    if (!reponseBrowserless.ok) {
      const detailErreur = await reponseBrowserless.text();
      console.error("Erreur Browserless :", reponseBrowserless.status, detailErreur);
      return NextResponse.json(
        { erreur: "La génération du PDF a échoué" },
        { status: 502 }
      );
    }

    const buffer = await reponseBrowserless.arrayBuffer();
    const nomFichier = `${cv.titre.replace(/[^a-z0-9]/gi, "_")}.pdf`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${nomFichier}"`,
      },
    });
  } catch (erreur) {
    if (erreur instanceof ErreurCV) {
      return NextResponse.json({ erreur: erreur.message }, { status: 403 });
    }

    console.error("Erreur lors de la génération du PDF :", erreur);
    return NextResponse.json(
      { erreur: "Une erreur interne est survenue" },
      { status: 500 }
    );
  }
}