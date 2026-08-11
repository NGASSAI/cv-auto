import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email requis" }, { status: 400 });
  }

  const utilisateur = await prisma.utilisateur.findUnique({
    where: { email },
    select: { role: true },
  });

  if (!utilisateur) {
    return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
  }

  return NextResponse.json({ role: utilisateur.role });
}
