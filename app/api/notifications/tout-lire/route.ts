import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { marquerToutCommeLu, supprimerToutesNotifications } from "@/features/notifications/api/notification.service";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PATCH() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  try {
    await marquerToutCommeLu(session.user.id);
    return NextResponse.json({ message: "Tout marqué comme lu" }, { status: 200 });
  } catch (erreur) {
    console.error("Erreur marquer tout lu:", erreur);
    return NextResponse.json({ erreur: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  try {
    await supprimerToutesNotifications(session.user.id);
    return NextResponse.json({ message: "Toutes les notifications supprimées" }, { status: 200 });
  } catch (erreur) {
    console.error("Erreur supprimer toutes notifications:", erreur);
    return NextResponse.json({ erreur: "Erreur serveur" }, { status: 500 });
  }
}