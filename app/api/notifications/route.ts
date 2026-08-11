import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { listerNotifications, compterNonLues } from "@/features/notifications/api/notification.service";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  const [notifications, nonLues] = await Promise.all([
    listerNotifications(session.user.id),
    compterNonLues(session.user.id),
  ]);

  return NextResponse.json({ notifications, nonLues }, { status: 200 });
}