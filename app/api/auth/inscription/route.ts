import { NextRequest, NextResponse } from "next/server";
import { schemaInscription } from "@/features/auth/validators/auth.schema";
import { creerUtilisateur, ErreurAuth } from "@/features/auth/api/utilisateur.service";

export async function POST(request: NextRequest) {
  try {
    const corps = await request.json();
    const resultat = schemaInscription.safeParse(corps);

    if (!resultat.success) {
      return NextResponse.json(
        { erreur: "Données invalides", details: resultat.error.flatten() },
        { status: 400 }
      );
    }

    const { nom, email, motDePasse } = resultat.data;
    const utilisateur = await creerUtilisateur(nom, email, motDePasse);

    return NextResponse.json(
      { message: "Compte créé avec succès", utilisateur },
      { status: 201 }
    );
  } catch (erreur) {
    if (erreur instanceof ErreurAuth) {
      return NextResponse.json({ erreur: erreur.message }, { status: 409 });
    }

    console.error("Erreur lors de l'inscription :", erreur);
    return NextResponse.json(
      { erreur: "Une erreur interne est survenue" },
      { status: 500 }
    );
  }
}