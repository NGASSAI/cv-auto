import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import {
  creerDemandePremium,
  ErreurPremium,
  obtenirStatutPremium,
} from "@/features/premium/api/premium.service";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  try {
    const statut = await obtenirStatutPremium(session.user.id);
    return NextResponse.json({ statut }, { status: 200 });
  } catch (erreur) {
    console.error("Erreur lors de la récupération du statut premium:", erreur);
    return NextResponse.json({ statut: null }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  try {
    const corps = await request.json();
    const message = typeof corps?.message === "string" ? corps.message : undefined;
    const formule = typeof corps?.formule === "string" ? corps.formule : undefined;

    const demande = await creerDemandePremium(session.user.id, message, formule);

    return NextResponse.json({ demande }, { status: 201 });
  } catch (erreur) {
    if (erreur instanceof ErreurPremium) {
      return NextResponse.json({ erreur: erreur.message }, { status: 409 });
    }

    console.error("Erreur lors de la demande premium :", erreur);
    return NextResponse.json(
      { erreur: "Une erreur interne est survenue" },
      { status: 500 }
    );
  }
}