import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import {
  obtenirParametresSite,
  mettreAJourParametresSite,
} from "@/features/admin/api/parametres.service";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ erreur: "Accès refusé" }, { status: 403 });
  }

  const parametres = await obtenirParametresSite();
  return NextResponse.json({ parametres }, { status: 200 });
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ erreur: "Accès refusé" }, { status: 403 });
  }

  const corps = await request.json();
  const parametres = await mettreAJourParametresSite(corps);

  return NextResponse.json({ parametres, message: "Paramètres enregistrés" }, { status: 200 });
}