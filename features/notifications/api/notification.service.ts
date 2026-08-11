import { prisma } from "@/shared/lib/prisma";

export async function creerNotification(
  utilisateurId: string,
  titre: string,
  message: string,
  lien?: string
) {
  return prisma.notification.create({
    data: { utilisateurId, titre, message, lien },
  });
}

/**
 * Envoie une notification à tous les administrateurs
 * (dans cette app il n'y en a qu'un seul, mais la fonction reste générique).
 */
export async function notifierAdmins(titre: string, message: string, lien?: string) {
  const admins = await prisma.utilisateur.findMany({
    where: { role: "ADMIN" },
    select: { id: true },
  });

  await prisma.notification.createMany({
    data: admins.map((admin) => ({
      utilisateurId: admin.id,
      titre,
      message,
      lien,
    })),
  });
}

export async function listerNotifications(utilisateurId: string) {
  return prisma.notification.findMany({
    where: { utilisateurId },
    orderBy: { creeLe: "desc" },
    take: 30,
  });
}

export async function compterNonLues(utilisateurId: string) {
  return prisma.notification.count({
    where: { utilisateurId, lu: false },
  });
}

export async function marquerCommeLue(notificationId: string, utilisateurId: string) {
  await prisma.notification.updateMany({
    where: { id: notificationId, utilisateurId },
    data: { lu: true },
  });
}

export async function marquerToutCommeLu(utilisateurId: string) {
  await prisma.notification.updateMany({
    where: { utilisateurId, lu: false },
    data: { lu: true },
  });
}