import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { reordonnerSections, ErreurSection } from "@/features/cv/api/section.service";
import { schemaReordonnerSections } from "@/features/cv/validators/section.schema";

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
    const resultat = schemaReordonnerSections.safeParse(corps);

    if (!resultat.success) {
      return NextResponse.json({ erreur: "Données invalides" }, { status: 400 });
    }

    await reordonnerSections(cvId, session.user.id, resultat.data.ordreIds);
    return NextResponse.json({ message: "Ordre mis à jour" }, { status: 200 });
  } catch (erreur) {
    if (erreur instanceof ErreurSection) {
      return NextResponse.json({ erreur: erreur.message }, { status: 403 });
    }

    console.error("Erreur lors de la réorganisation :", erreur);
    return NextResponse.json(
      { erreur: "Une erreur interne est survenue" },
      { status: 500 }
    );
  }
}