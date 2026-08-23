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
  message?: string,
  formule?: string
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
      noteAdmin: formule, // Utiliser noteAdmin pour stocker la formule demandée
    },
  });

  const utilisateur = await prisma.utilisateur.findUnique({ where: { id: utilisateurId } });
  const formuleLabel = formule ? ` (${formule})` : "";
  await notifierAdmins(
    "Nouvelle demande Premium",
    `${utilisateur?.nom ?? utilisateur?.email} souhaite passer en Premium${formuleLabel}`,
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

/**
 * Récupère le statut premium actuel d'un utilisateur :
 * - APPROUVEE si a un abonnement actif
 * - EN_ATTENTE si a une demande en attente
 * - REFUSEE si la dernière demande a été refusée
 * - null sinon
 */
export async function obtenirStatutPremium(utilisateurId: string) {
  // D'abord vérifier si l'utilisateur a un abonnement actif
  const abonnement = await prisma.abonnement.findFirst({
    where: {
      utilisateurId,
      statut: "ACTIF",
      dateFin: { gte: new Date() },
    },
  });

  if (abonnement) {
    return "APPROUVEE";
  }

  // Sinon vérifier la dernière demande
  const derniereDemande = await recupererDerniereDemandePremium(utilisateurId);
  
  if (derniereDemande) {
    return derniereDemande.statut;
  }

  return null;
}