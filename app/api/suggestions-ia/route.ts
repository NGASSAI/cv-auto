import { NextRequest, NextResponse } from "next/server";
import { obtenirSuggestionsIA, genererResumeIA, obtenirSuggestionsCompetences, obtenirDomainesDisponibles } from "@/features/cv/lib/suggestions-ia";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, titrePoste, domaine, informations } = body;

    switch (action) {
      case "competences":
        const competences = obtenirSuggestionsCompetences(titrePoste, domaine);
        return NextResponse.json({ competences }, { status: 200 });

      case "resume":
        const resume = genererResumeIA(informations);
        return NextResponse.json({ resume }, { status: 200 });

      case "domaines":
        const domaines = obtenirDomainesDisponibles(titrePoste);
        return NextResponse.json({ domaines }, { status: 200 });

      default:
        return NextResponse.json({ erreur: "Action non reconnue" }, { status: 400 });
    }
  } catch (erreur) {
    console.error("Erreur API suggestions IA:", erreur);
    return NextResponse.json({ erreur: "Erreur serveur" }, { status: 500 });
  }
}
