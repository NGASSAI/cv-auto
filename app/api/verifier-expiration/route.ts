import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { verifierEtDesactiverExpiration } from "@/features/premium/api/abonnement.service";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  try {
    const aExpire = await verifierEtDesactiverExpiration(session.user.id);
    return NextResponse.json({ aExpire });
  } catch (error) {
    console.error("Erreur lors de la vérification d'expiration:", error);
    return NextResponse.json({ erreur: "Erreur serveur" }, { status: 500 });
  }
}
