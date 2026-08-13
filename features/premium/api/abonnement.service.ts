import { prisma } from "@/shared/lib/prisma";
import { creerNotification } from "@/features/notifications/api/notification.service";

/**
 * Vérifie si l'abonnement d'un utilisateur est expiré et le désactive si nécessaire.
 * Retourne true si l'abonnement a été désactivé (expiré), false sinon.
 */
export async function verifierEtDesactiverExpiration(utilisateurId: string): Promise<boolean> {
  const abonnement = await prisma.abonnement.findUnique({
    where: { utilisateurId },
  });

  if (!abonnement || abonnement.statut !== "ACTIF" || !abonnement.dateFin) {
    return false;
  }

  const maintenant = new Date();
  const dateFin = new Date(abonnement.dateFin);

  if (maintenant > dateFin) {
    // L'abonnement est expiré, on le désactive
    await prisma.abonnement.update({
      where: { utilisateurId },
      data: {
        statut: "EXPIRE",
        formulePremium: null,
        dateFin: null,
      },
    });

    // Notifier l'utilisateur
    await creerNotification(
      utilisateurId,
      "Abonnement Premium expiré",
      "Votre abonnement Premium a expiré. Vous pouvez réactiver le Premium à tout moment.",
      "/dashboard"
    );

    // Notifier l'admin
    const admin = await prisma.utilisateur.findFirst({
      where: { role: "ADMIN" },
    });

    if (admin) {
      await creerNotification(
        admin.id,
        "Abonnement Premium expiré",
        `L'abonnement Premium d'un utilisateur a expiré.`,
        "/admin/utilisateurs"
      );
    }

    return true;
  }

  return false;
}

/**
 * Vérifie tous les abonnements expirés (utilisable via tâche planifiée si disponible).
 * Pour l'instant, appelé manuellement ou lors de la connexion.
 */
export async function verifierToutesExpirations(): Promise<number> {
  const maintenant = new Date();

  const abonnementsExpires = await prisma.abonnement.findMany({
    where: {
      statut: "ACTIF",
      dateFin: {
        lt: maintenant,
      },
    },
    include: {
      utilisateur: {
        select: { id: true, nom: true, email: true },
      },
    },
  });

  for (const abonnement of abonnementsExpires) {
    await prisma.abonnement.update({
      where: { id: abonnement.id },
      data: {
        statut: "EXPIRE",
        formulePremium: null,
        dateFin: null,
      },
    });

    await creerNotification(
      abonnement.utilisateurId,
      "Abonnement Premium expiré",
      "Votre abonnement Premium a expiré. Vous pouvez réactiver le Premium à tout moment.",
      "/dashboard"
    );
  }

  // Notifier l'admin si des abonnements ont expiré
  if (abonnementsExpires.length > 0) {
    const admin = await prisma.utilisateur.findFirst({
      where: { role: "ADMIN" },
    });

    if (admin) {
      await creerNotification(
        admin.id,
        `${abonnementsExpires.length} abonnement(s) expiré(s)`,
        `${abonnementsExpires.length} abonnement(s) Premium ont expiré.`,
        "/admin/utilisateurs"
      );
    }
  }

  return abonnementsExpires.length;
}
