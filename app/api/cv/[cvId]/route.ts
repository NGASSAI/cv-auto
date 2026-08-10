import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import {
  recupererCVComplet,
  mettreAJourCV,
  supprimerCV,
  ErreurCV,
} from "@/features/cv/api/cv.service";
import { schemaMiseAJourCV } from "@/features/cv/validators/cv.schema";

/**
 * GET /api/cv/[cvId] — récupère un CV complet avec toutes ses relations.
 */
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
    return NextResponse.json({ cv }, { status: 200 });
  } catch (erreur) {
    if (erreur instanceof ErreurCV) {
      return NextResponse.json({ erreur: erreur.message }, { status: 403 });
    }

    console.error("Erreur lors de la récupération du CV :", erreur);
    return NextResponse.json(
      { erreur: "Une erreur interne est survenue" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/cv/[cvId] — met à jour les champs généraux du CV
 * (titre, template, couleur d'accent).
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ cvId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  const { cvId } = await params;

  try {
    const corps = await request.json();
    const resultat = schemaMiseAJourCV.safeParse(corps);

    if (!resultat.success) {
      return NextResponse.json(
        { erreur: "Données invalides", details: resultat.error.flatten() },
        { status: 400 }
      );
    }

    const cv = await mettreAJourCV(cvId, session.user.id, resultat.data);
    return NextResponse.json({ cv }, { status: 200 });
  } catch (erreur) {
    if (erreur instanceof ErreurCV) {
      return NextResponse.json({ erreur: erreur.message }, { status: 403 });
    }

    console.error("Erreur lors de la mise à jour du CV :", erreur);
    return NextResponse.json(
      { erreur: "Une erreur interne est survenue" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cv/[cvId] — supprime un CV appartenant à l'utilisateur connecté.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ cvId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  const { cvId } = await params;

  try {
    await supprimerCV(cvId, session.user.id);
    return NextResponse.json({ message: "CV supprimé" }, { status: 200 });
  } catch (erreur) {
    if (erreur instanceof ErreurCV) {
      return NextResponse.json({ erreur: erreur.message }, { status: 403 });
    }

    console.error("Erreur lors de la suppression du CV :", erreur);
    return NextResponse.json(
      { erreur: "Une erreur interne est survenue" },
      { status: 500 }
    );
  }
}