import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { supprimerCV, ErreurCV } from "@/features/cv/api/cv.service";

/**
 * DELETE /api/cv/[cvId] — supprime un CV appartenant à l'utilisateur connecté.
 */
export async function DELETE(
  request: Request,
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