import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { listerDemandesPremium } from "@/features/admin/api/admin.service";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ erreur: "Accès refusé" }, { status: 403 });
  }

  const demandes = await listerDemandesPremium();

  return NextResponse.json({ demandes }, { status: 200 });
}