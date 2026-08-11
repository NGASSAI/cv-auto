import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { marquerToutCommeLu } from "@/features/notifications/api/notification.service";

export async function PATCH() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  await marquerToutCommeLu(session.user.id);

  return NextResponse.json({ message: "Tout marqué comme lu" }, { status: 200 });
}