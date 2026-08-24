import { NextRequest, NextResponse } from "next/server";
import { schemaDemandeReinitialisation } from "@/features/auth/validators/auth.schema";
import { genererTokenReinitialisation } from "@/features/auth/lib/token";
import { prisma } from "@/shared/lib/prisma";
import {
  limiteurReinitialisationParIp,
  limiteurReinitialisationParEmail,
  obtenirIpClient,
} from "@/features/auth/lib/rate-limit";
import { verifierTurnstile } from "@/features/auth/lib/turnstile";

export async function POST(request: NextRequest) {
  try {
    const ip = obtenirIpClient(request);

    const { success: sousLaLimiteIp } =
      await limiteurReinitialisationParIp.limit(ip);

    if (!sousLaLimiteIp) {
       console.log("RATE LIMIT IP DÉCLENCHÉ :", ip);
      return NextResponse.json(
        { erreur: "Trop de tentatives. Réessaie dans quelques instants." },
        { status: 429 }
      );
    }

    const corps = await request.json();

    // Vérification Turnstile
    const captchaValide = await verifierTurnstile(
      corps.jetonTurnstile,
      ip
    );

    if (!captchaValide) {
      return NextResponse.json(
        { erreur: "Vérification anti-robot échouée, réessaie." },
        { status: 400 }
      );
    }

    // Validation de l'email
    const resultat = schemaDemandeReinitialisation.safeParse(corps);

    if (!resultat.success) {
      return NextResponse.json(
        { erreur: "Adresse email invalide" },
        { status: 400 }
      );
    }

    const { email } = resultat.data;

    // Deuxième limite, sur l'email cette fois :
    // empêche de cibler UN compte précis en boucle
    // même depuis des IP différentes.
    const { success: sousLaLimiteEmail } =
      await limiteurReinitialisationParEmail.limit(email);

    if (!sousLaLimiteEmail) {
        console.log("RATE LIMIT EMAIL DÉCLENCHÉ :", email);
      return NextResponse.json(
        {
          erreur:
            "Trop de tentatives pour cette adresse. Réessaie plus tard.",
        },
        { status: 429 }
      );
    }

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { email },
    });

    const messageGenerique = {
      message:
        "Si un compte existe avec cet email, un lien de réinitialisation a été généré.",
    };

    if (!utilisateur) {
      return NextResponse.json(messageGenerique, { status: 200 });
    }

    const { token, expireLe } = await genererTokenReinitialisation(email);

const baseUrl =
  process.env.NEXT_PUBLIC_URL_APP || request.nextUrl.origin;

const lienReinitialisation =
  `${baseUrl}/reinitialiser/${token}`;

    console.log(
      "Lien de réinitialisation généré pour:",
      email,
      lienReinitialisation
    );

    return NextResponse.json(
  {
    message: "Lien de réinitialisation généré avec succès",
    lienSecours: lienReinitialisation,
    expireLe: expireLe.toISOString(),
    modeSecours: true,
  },
  { status: 200 }
);
  } catch (erreur) {
    console.error(
      "Erreur lors de la demande de réinitialisation :",
      erreur
    );

    return NextResponse.json(
      { erreur: "Une erreur interne est survenue" },
      { status: 500 }
    );
  }
}