import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import {
  mettreAJourItem,
  supprimerItem,
  ErreurSection,
} from "@/features/cv/api/section.service";
import { schemaMiseAJourItem } from "@/features/cv/validators/section.schema";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  const { itemId } = await params;

  try {
    const corps = await request.json();
    const resultat = schemaMiseAJourItem.safeParse(corps);

    if (!resultat.success) {
      return NextResponse.json({ erreur: "Données invalides" }, { status: 400 });
    }

    const item = await mettreAJourItem(itemId, session.user.id, resultat.data);
    return NextResponse.json({ item }, { status: 200 });
  } catch (erreur) {
    if (erreur instanceof ErreurSection) {
      return NextResponse.json({ erreur: erreur.message }, { status: 403 });
    }

    console.error("Erreur lors de la mise à jour de l'élément :", erreur);
    return NextResponse.json(
      { erreur: "Une erreur interne est survenue" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  const { itemId } = await params;

  try {
    await supprimerItem(itemId, session.user.id);
    return NextResponse.json({ message: "Élément supprimé" }, { status: 200 });
  } catch (erreur) {
    if (erreur instanceof ErreurSection) {
      return NextResponse.json({ erreur: erreur.message }, { status: 403 });
    }

    console.error("Erreur lors de la suppression de l'élément :", erreur);
    return NextResponse.json(
      { erreur: "Une erreur interne est survenue" },
      { status: 500 }
    );
  }
}