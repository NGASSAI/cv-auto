import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { creerSection, ErreurSection } from "@/features/cv/api/section.service";
import { schemaCreationSection } from "@/features/cv/validators/section.schema";

export async function POST(
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
    const resultat = schemaCreationSection.safeParse(corps);

    if (!resultat.success) {
      return NextResponse.json(
        { erreur: "Données invalides", details: resultat.error.flatten() },
        { status: 400 }
      );
    }

    const section = await creerSection(cvId, session.user.id, resultat.data);
    return NextResponse.json({ section }, { status: 201 });
  } catch (erreur) {
    if (erreur instanceof ErreurSection) {
      return NextResponse.json({ erreur: erreur.message }, { status: 403 });
    }

    console.error("Erreur lors de la création de la section :", erreur);
    return NextResponse.json(
      { erreur: "Une erreur interne est survenue" },
      { status: 500 }
    );
  }
}