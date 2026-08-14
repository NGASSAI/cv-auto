import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import {
  traiterDemandePremium,
  ErreurAdmin,
} from "@/features/admin/api/admin.service";
import { prisma } from "@/shared/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ demandeId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ erreur: "Accès refusé" }, { status: 403 });
  }

  const { demandeId } = await params;

  try {
    const corps = await request.json();
    const { decision, noteAdmin } = corps;

    if (decision !== "APPROUVEE" && decision !== "REFUSEE") {
      return NextResponse.json(
        { erreur: "Décision invalide" },
        { status: 400 }
      );
    }

    await traiterDemandePremium(demandeId, decision, noteAdmin);

    return NextResponse.json({ message: "Demande traitée" }, { status: 200 });
  } catch (erreur) {
    if (erreur instanceof ErreurAdmin) {
      return NextResponse.json({ erreur: erreur.message }, { status: 409 });
    }

    console.error("Erreur lors du traitement de la demande :", erreur);
    return NextResponse.json(
      { erreur: "Une erreur interne est survenue" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ demandeId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ erreur: "Accès refusé" }, { status: 403 });
  }

  const { demandeId } = await params;

  try {
    // Vérifier que la demande existe
    const demande = await prisma.demandePremium.findUnique({
      where: { id: demandeId },
    });

    if (!demande) {
      return NextResponse.json({ erreur: "Demande introuvable" }, { status: 404 });
    }

    // Supprimer la demande
    await prisma.demandePremium.delete({
      where: { id: demandeId },
    });

    return NextResponse.json({ message: "Demande supprimée" }, { status: 200 });
  } catch (erreur) {
    console.error("Erreur lors de la suppression de la demande :", erreur);
    return NextResponse.json(
      { erreur: "Une erreur interne est survenue" },
      { status: 500 }
    );
  }
}