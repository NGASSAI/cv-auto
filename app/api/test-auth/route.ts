import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { verifierIdentifiants } from "@/features/auth/api/utilisateur.service";

export async function POST(request: NextRequest) {
  try {
    const { email, motDePasse } = await request.json();

    if (!email || !motDePasse) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
    }

    console.log("🔍 Test d'authentification pour:", email);

    const utilisateur = await verifierIdentifiants(email, motDePasse);

    if (!utilisateur) {
      console.log("❌ Identifiants invalides");
      return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
    }

    console.log("✅ Authentification réussie:", {
      id: utilisateur.id,
      nom: utilisateur.nom,
      email: utilisateur.email,
      role: utilisateur.role,
    });

    return NextResponse.json({ 
      success: true,
      utilisateur: {
        id: utilisateur.id,
        nom: utilisateur.nom,
        email: utilisateur.email,
        role: utilisateur.role,
      }
    });
  } catch (error) {
    console.error("❌ Erreur:", error);
    if (error instanceof Error && error.message === "COMPTE_SUSPENDU") {
      return NextResponse.json({ error: "Compte suspendu" }, { status: 403 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
