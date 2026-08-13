import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import {
  togglerPremium,
  togglerSuspension,
  supprimerUtilisateur,
  ErreurAdmin,
} from "@/features/admin/api/admin.service";

/**
 * PATCH /api/admin/utilisateurs/[utilisateurId]
 * Active ou désactive le Premium d'un utilisateur.
 * Body attendu : { activerPremium: boolean, formule?: string } ou { desactiverPremium: boolean } ou { suspendre: boolean }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ utilisateurId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ erreur: "Accès refusé" }, { status: 403 });
  }

  const { utilisateurId } = await params;

  try {
    const corps = await request.json();
    const { activerPremium, desactiverPremium, suspendre, formule } = corps;

    if (typeof desactiverPremium === "boolean" && desactiverPremium) {
      await togglerPremium(utilisateurId, false);
      return NextResponse.json({ message: "Premium désactivé" }, { status: 200 });
    }

    if (typeof activerPremium === "boolean" && activerPremium) {
      await togglerPremium(utilisateurId, true, formule);
      return NextResponse.json({ message: "Premium activé" }, { status: 200 });
    }

    if (typeof suspendre === "boolean") {
      await togglerSuspension(utilisateurId, suspendre);
      return NextResponse.json(
        { message: suspendre ? "Compte suspendu" : "Compte réactivé" },
        { status: 200 }
      );
    }

    return NextResponse.json({ erreur: "Paramètre invalide" }, { status: 400 });
  } catch (erreur) {
    if (erreur instanceof ErreurAdmin) {
      return NextResponse.json({ erreur: erreur.message }, { status: 409 });
    }

    console.error("Erreur lors de la mise à jour du Premium :", erreur);
    return NextResponse.json(
      { erreur: "Une erreur interne est survenue" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/utilisateurs/[utilisateurId]
 * Supprime définitivement un compte utilisateur et toutes ses données.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ utilisateurId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ erreur: "Accès refusé" }, { status: 403 });
  }

  const { utilisateurId } = await params;

  try {
    await supprimerUtilisateur(utilisateurId, session.user.id);
    return NextResponse.json({ message: "Compte supprimé" }, { status: 200 });
  } catch (erreur) {
    if (erreur instanceof ErreurAdmin) {
      return NextResponse.json({ erreur: erreur.message }, { status: 409 });
    }

    console.error("Erreur lors de la suppression du compte :", erreur);
    return NextResponse.json(
      { erreur: "Une erreur interne est survenue" },
      { status: 500 }
    );
  }
}