import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import {
  mettreAJourSection,
  supprimerSection,
  ErreurSection,
} from "@/features/cv/api/section.service";
import { schemaMiseAJourSection } from "@/features/cv/validators/section.schema";

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
    const resultat = schemaMiseAJourSection.safeParse(corps);

    if (!resultat.success) {
      return NextResponse.json({ erreur: "Données invalides" }, { status: 400 });
    }

    const section = await mettreAJourSection(sectionId, session.user.id, resultat.data);
    return NextResponse.json({ section }, { status: 200 });
  } catch (erreur) {
    if (erreur instanceof ErreurSection) {
      return NextResponse.json({ erreur: erreur.message }, { status: 403 });
    }

    console.error("Erreur lors de la mise à jour de la section :", erreur);
    return NextResponse.json(
      { erreur: "Une erreur interne est survenue" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sectionId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  const { sectionId } = await params;

  try {
    await supprimerSection(sectionId, session.user.id);
    return NextResponse.json({ message: "Section supprimée" }, { status: 200 });
  } catch (erreur) {
    if (erreur instanceof ErreurSection) {
      return NextResponse.json({ erreur: erreur.message }, { status: 403 });
    }

    console.error("Erreur lors de la suppression de la section :", erreur);
    return NextResponse.json(
      { erreur: "Une erreur interne est survenue" },
      { status: 500 }
    );
  }
}