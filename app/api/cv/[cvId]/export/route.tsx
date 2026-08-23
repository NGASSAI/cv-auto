import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { obtenirParametresSite } from "@/features/admin/api/parametres.service";
import { recupererCVComplet, ErreurCV } from "@/features/cv/api/cv.service";
import { genererTokenImpression } from "@/features/cv/lib/token-impression";

const URL_PDFSHIFT = "https://api.pdfshift.io/v3/convert/pdf";

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

    const cleApi = process.env.PDFSHIFT_API_KEY;
    if (!cleApi) {
      console.error("PDFSHIFT_API_KEY n'est pas définie dans les variables d'environnement.");
      return NextResponse.json({ erreur: "Une erreur interne est survenue" }, { status: 500 });
    }

    // Mode sandbox : les PDF générés ont un filigrane et NE comptent PAS
    // dans le quota du compte PDFShift. Utile en dev/preview pour ne
    // pas gaspiller le quota gratuit pendant les tests. À retirer (ou
    // mettre PDFSHIFT_SANDBOX=false) sur la vraie production.
    const modeSandbox = process.env.PDFSHIFT_SANDBOX === "true";

    // Même page d'impression et même token que la version Puppeteer :
    // PDFShift va simplement ouvrir cette URL lui-même et la convertir.
    const token = genererTokenImpression(cvId, session.user.id);
    const urlImpression = new URL(`/imprimer/cv/${cvId}`, request.nextUrl.origin);
    urlImpression.searchParams.set("token", token);

    const reponsePdfShift = await fetch(URL_PDFSHIFT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${cleApi}:`).toString("base64")}`,
      },
      body: JSON.stringify({
        source: urlImpression.toString(),
        format: "A4",
        margin: "0",
        use_print: true,
        sandbox: modeSandbox,
      }),
    });

    if (!reponsePdfShift.ok) {
      const detailErreur = await reponsePdfShift.text();
      console.error("Erreur PDFShift :", reponsePdfShift.status, detailErreur);
      return NextResponse.json(
        { erreur: "La génération du PDF a échoué" },
        { status: 502 }
      );
    }

    const buffer = await reponsePdfShift.arrayBuffer();
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