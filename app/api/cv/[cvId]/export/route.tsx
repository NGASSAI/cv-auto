import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { renderToBuffer } from "@react-pdf/renderer";
import { authOptions } from "@/shared/lib/auth";
import { recupererCVComplet, ErreurCV } from "@/features/cv/api/cv.service";
import { obtenirComposantPdf } from "@/features/cv/components/pdf/registre-pdf";

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
    const cv = await recupererCVComplet(cvId, session.user.id);

    const ComposantPdf = obtenirComposantPdf(cv.templateId);
    
    const sectionsFormatees = cv.sections.map(section => ({
      ...section,
      items: section.items.map(item => ({
        ...item,
        dateDebut: item.dateDebut ? item.dateDebut.toISOString().split('T')[0] : null,
        dateFin: item.dateFin ? item.dateFin.toISOString().split('T')[0] : null,
      })),
    }));
    
 const buffer = await renderToBuffer(
  <ComposantPdf
    informations={cv.informations ?? {
      prenom: null, nom: null, titrePoste: null, email: null,
      telephone: null, adresse: null, photoUrl: null, resume: null,
    }}
    sections={sectionsFormatees}
    couleurAccent={cv.couleurAccent}
    police={cv.police}
  />
);
 
    const nomFichier = `${cv.titre.replace(/[^a-z0-9]/gi, "_")}.pdf`;

    return new NextResponse(new Uint8Array(buffer), {
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