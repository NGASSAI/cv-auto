import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { recupererStatistiquesDetaillees } from "@/features/admin/api/admin.service";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ erreur: "Accès refusé" }, { status: 403 });
  }

  const stats = await recupererStatistiquesDetaillees();

  return NextResponse.json({ stats }, { status: 200 });
}