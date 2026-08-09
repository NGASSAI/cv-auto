import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { schemaCreationCV } from "@/features/cv/validators/cv.schema";
import { listerCVUtilisateur, creerCV } from "@/features/cv/api/cv.service";

/**
 * GET /api/cv — liste tous les CV de l'utilisateur connecté.
 */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  const cvs = await listerCVUtilisateur(session.user.id);

  return NextResponse.json({ cvs }, { status: 200 });
}

/**
 * POST /api/cv — crée un nouveau CV pour l'utilisateur connecté.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  try {
    const corps = await request.json();
    const resultat = schemaCreationCV.safeParse(corps);

    if (!resultat.success) {
      return NextResponse.json(
        { erreur: "Données invalides", details: resultat.error.flatten() },
        { status: 400 }
      );
    }

    const cv = await creerCV(session.user.id, resultat.data.titre);

    return NextResponse.json({ cv }, { status: 201 });
  } catch (erreur) {
    console.error("Erreur lors de la création du CV :", erreur);
    return NextResponse.json(
      { erreur: "Une erreur interne est survenue" },
      { status: 500 }
    );
  }
}