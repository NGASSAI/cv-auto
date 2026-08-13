import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { marquerCommeLue, supprimerNotification } from "@/features/notifications/api/notification.service";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ notificationId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  const { notificationId } = await params;
  await marquerCommeLue(notificationId, session.user.id);

  return NextResponse.json({ message: "Notification lue" }, { status: 200 });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ notificationId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  const { notificationId } = await params;
  await supprimerNotification(notificationId, session.user.id);

  return NextResponse.json({ message: "Notification supprimée" }, { status: 200 });
}