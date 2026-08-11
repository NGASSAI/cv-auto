import { prisma } from "@/shared/lib/prisma";
import { notifierAdmins } from "@/features/notifications/api/notification.service";

export class ErreurPremium extends Error {}

/**
 * Crée une demande de passage en premium pour un utilisateur.
 * Empêche la création d'une nouvelle demande si une autre
 * est déjà en attente de traitement (évite le spam de demandes).
 */
export async function creerDemandePremium(
  utilisateurId: string,
  message?: string
) {
  const demandeExistante = await prisma.demandePremium.findFirst({
    where: {
      utilisateurId,
      statut: "EN_ATTENTE",
    },
  });

  if (demandeExistante) {
    throw new ErreurPremium("Une demande est déjà en attente de traitement");
  }

 const demande = await prisma.demandePremium.create({
    data: {
      utilisateurId,
      message,
    },
  });

  const utilisateur = await prisma.utilisateur.findUnique({ where: { id: utilisateurId } });
  await notifierAdmins(
    "Nouvelle demande Premium",
    `${utilisateur?.nom ?? utilisateur?.email} souhaite passer en Premium`,
    "/admin/demandes"
  );

  return demande;
}

/**
 * Récupère la demande la plus récente d'un utilisateur, quel que soit
 * son statut — utilisé pour afficher l'état actuel côté interface
 * (ex: "Demande en attente" vs bouton "Passer en Premium").
 */
export async function recupererDerniereDemandePremium(utilisateurId: string) {
  return prisma.demandePremium.findFirst({
    where: { utilisateurId },
    orderBy: { creeLe: "desc" },
  });
}