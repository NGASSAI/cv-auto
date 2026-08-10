import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { reordonnerItems, ErreurSection } from "@/features/cv/api/section.service";
import { schemaReordonnerItems } from "@/features/cv/validators/section.schema";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sectionId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  const { sectionId } = await params;

  try {
    const corps = await request.json();
    const resultat = schemaReordonnerItems.safeParse({ ...corps, sectionId });

    if (!resultat.success) {
      return NextResponse.json({ erreur: "Données invalides" }, { status: 400 });
    }

    await reordonnerItems(sectionId, session.user.id, resultat.data.ordreIds);
    return NextResponse.json({ message: "Ordre mis à jour" }, { status: 200 });
  } catch (erreur) {
    if (erreur instanceof ErreurSection) {
      return NextResponse.json({ erreur: erreur.message }, { status: 403 });
    }

    console.error("Erreur lors de la réorganisation des items :", erreur);
    return NextResponse.json(
      { erreur: "Une erreur interne est survenue" },
      { status: 500 }
    );
  }
}