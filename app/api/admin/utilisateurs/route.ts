import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { listerUtilisateurs } from "@/features/admin/api/admin.service";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ erreur: "Accès refusé" }, { status: 403 });
  }

  const utilisateurs = await listerUtilisateurs();

  return NextResponse.json({ utilisateurs }, { status: 200 });
}