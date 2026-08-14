import { NextRequest, NextResponse } from "next/server";
import { schemaDemandeReinitialisation } from "@/features/auth/validators/auth.schema";
import { genererTokenReinitialisation } from "@/features/auth/lib/token";
import { envoyerEmailReinitialisation } from "@/features/auth/lib/email";
import { prisma } from "@/shared/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const corps = await request.json();
    const resultatValidation = schemaDemandeReinitialisation.safeParse(corps);

    if (!resultatValidation.success) {
      return NextResponse.json(
        { erreur: "Adresse email invalide" },
        { status: 400 }
      );
    }

    const { email } = resultatValidation.data;

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
    const resultatEmail = await envoyerEmailReinitialisation(email, token);

    // En développement, si l'email échoue, on retourne quand même le succès
    // car le token est disponible dans les logs
    if (process.env.NODE_ENV === 'development' && !resultatEmail.success) {
      console.log('📧 Mode développement: Token disponible dans les logs console');
      const lienReinitialisation = `${process.env.NEXT_PUBLIC_URL_APP}/reinitialiser/${token}`;
      return NextResponse.json({
        message: "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.",
        debug: resultatEmail.message,
        token: token,
        lien: lienReinitialisation
      }, { status: 200 });
    }

    return NextResponse.json(messageGenerique, { status: 200 });
  } catch (erreur) {
    console.error("Erreur lors de la demande de réinitialisation :", erreur);
    return NextResponse.json(
      { erreur: "Une erreur interne est survenue" },
      { status: 500 }
    );
  }
}