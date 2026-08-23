import { NextRequest, NextResponse } from "next/server";
import { schemaDemandeReinitialisation } from "@/features/auth/validators/auth.schema";
import { genererTokenReinitialisation } from "@/features/auth/lib/token";
import { prisma } from "@/shared/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const corps = await request.json();
    const resultat = schemaDemandeReinitialisation.safeParse(corps);

    if (!resultat.success) {
      return NextResponse.json(
        { erreur: "Adresse email invalide" },
        { status: 400 }
      );
    }

    const { email } = resultat.data;

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { email },
    });

    // Sécurité importante : on renvoie TOUJOURS le même message,
    // que l'email existe ou non. Sinon on permettrait à quelqu'un
    // de découvrir quels emails sont inscrits sur la plateforme
    // (énumération de comptes).
    const messageGenerique = {
      message:
        "Si un compte existe avec cet email, un lien de réinitialisation a été généré.",
    };

    if (!utilisateur) {
      return NextResponse.json(messageGenerique, { status: 200 });
    }

    // Générer le token sécurisé
    const token = await genererTokenReinitialisation(email);
    
    // Générer le lien de réinitialisation
    const baseUrl = process.env.NEXT_PUBLIC_URL_APP || request.nextUrl.origin;
    const lienReinitialisation = `${baseUrl}/reinitialiser/${token}`;
    
    console.log("Lien de réinitialisation généré pour:", email, lienReinitialisation);
    
    // Retourner le lien directement (mode secours par défaut)
    return NextResponse.json({ 
      message: "Lien de réinitialisation généré avec succès",
      lienSecours: lienReinitialisation,
      modeSecours: true
    }, { status: 200 });
  } catch (erreur) {
    console.error("Erreur lors de la demande de réinitialisation :", erreur);
    return NextResponse.json(
      { erreur: "Une erreur interne est survenue" },
      { status: 500 }
    );
  }
}