import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { marquerCommeLue, supprimerNotification } from "@/features/notifications/api/notification.service";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ notificationId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  try {
    const { notificationId } = await params;
    await marquerCommeLue(notificationId, session.user.id);
    return NextResponse.json({ message: "Notification lue" }, { status: 200 });
  } catch (erreur) {
    console.error("Erreur marquer notification lue:", erreur);
    return NextResponse.json({ erreur: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ notificationId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  try {
    const { notificationId } = await params;
    await supprimerNotification(notificationId, session.user.id);
    return NextResponse.json({ message: "Notification supprimée" }, { status: 200 });
  } catch (erreur) {
    console.error("Erreur suppression notification:", erreur);
    return NextResponse.json({ erreur: "Erreur serveur" }, { status: 500 });
  }
}