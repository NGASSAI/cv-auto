import { NextRequest, NextResponse } from "next/server";
import { schemaDemandeReinitialisation } from "@/features/auth/validators/auth.schema";
import { genererTokenReinitialisation } from "@/features/auth/lib/token";
import { envoyerEmailReinitialisation } from "@/features/auth/lib/email";
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
        "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.",
    };

    if (!utilisateur) {
      return NextResponse.json(messageGenerique, { status: 200 });
    }

    const token = await genererTokenReinitialisation(email);
    await envoyerEmailReinitialisation(email, token);

    return NextResponse.json(messageGenerique, { status: 200 });
  } catch (erreur) {
    console.error("Erreur lors de la demande de réinitialisation :", erreur);
    return NextResponse.json(
      { erreur: "Une erreur interne est survenue" },
      { status: 500 }
    );
  }
}