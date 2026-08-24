import { NextRequest, NextResponse } from "next/server";
import { schemaReinitialisation } from "@/features/auth/validators/auth.schema";
import {
  supprimerTokenReinitialisation,
  verifierTokenReinitialisation,
} from "@/features/auth/lib/token";
import { reinitialiserMotDePasseUtilisateur } from "@/features/auth/api/utilisateur.service";

export async function POST(request: NextRequest) {
  try {
    const corps = await request.json();

    const resultat = schemaReinitialisation.safeParse(corps);

    if (!resultat.success) {
      return NextResponse.json(
        { erreur: "Données de réinitialisation invalides." },
        { status: 400 }
      );
    }

    const { token, nouveauMotDePasse } = resultat.data;

    const email = await verifierTokenReinitialisation(token);

    if (!email) {
      return NextResponse.json(
        { erreur: "Ce lien est invalide ou a expiré." },
        { status: 400 }
      );
    }

    await reinitialiserMotDePasseUtilisateur(
      email,
      nouveauMotDePasse
    );

    await supprimerTokenReinitialisation(token);

    return NextResponse.json(
      {
        message: "Mot de passe réinitialisé avec succès.",
      },
      { status: 200 }
    );
  } catch (erreur) {
    console.error(
      "Erreur lors de la réinitialisation du mot de passe :",
      erreur
    );

    return NextResponse.json(
      { erreur: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}