import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { creerItem, ErreurSection } from "@/features/cv/api/section.service";
import { schemaCreationItem } from "@/features/cv/validators/section.schema";

export async function POST(
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
    const resultat = schemaCreationItem.safeParse(corps);

    if (!resultat.success) {
      return NextResponse.json(
        { erreur: "Données invalides", details: resultat.error.flatten() },
        { status: 400 }
      );
    }

    const item = await creerItem(sectionId, session.user.id, resultat.data);
    return NextResponse.json({ item }, { status: 201 });
  } catch (erreur) {
    if (erreur instanceof ErreurSection) {
      return NextResponse.json({ erreur: erreur.message }, { status: 403 });
    }

    console.error("Erreur lors de la création de l'élément :", erreur);
    return NextResponse.json(
      { erreur: "Une erreur interne est survenue" },
      { status: 500 }
    );
  }
}