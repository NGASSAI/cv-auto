import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import {
  mettreAJourInformations,
  ErreurCV,
} from "@/features/cv/api/cv.service";

/**
 * PATCH /api/cv/[cvId]/informations — met à jour les informations
 * personnelles (nom, titre du poste, contact, résumé...) d'un CV.
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
    const informations = await mettreAJourInformations(
      cvId,
      session.user.id,
      corps
    );

    return NextResponse.json({ informations }, { status: 200 });
  } catch (erreur) {
    if (erreur instanceof ErreurCV) {
      return NextResponse.json({ erreur: erreur.message }, { status: 403 });
    }

    console.error("Erreur lors de la mise à jour des informations :", erreur);
    return NextResponse.json(
      { erreur: "Une erreur interne est survenue" },
      { status: 500 }
    );
  }
}