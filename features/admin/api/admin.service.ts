import { prisma } from "@/shared/lib/prisma";
import { creerNotification } from "@/features/notifications/api/notification.service";
import { calculerDateExpiration, type FormulePremiumConfig } from "@/features/premium/lib/formules-premium";
import type { FormulePremium } from "@/lib/generated/prisma/client";
export class ErreurAdmin extends Error {}

/**
 * Liste toutes les demandes premium, triées par statut
 * (les demandes en attente en premier) puis par date décroissante.
 * Inclut les infos de l'utilisateur concerné pour l'affichage.
 */
export async function listerDemandesPremium() {
  return prisma.demandePremium.findMany({
    orderBy: [{ statut: "asc" }, { creeLe: "desc" }],
    include: {
      utilisateur: {
        select: { id: true, nom: true, email: true },
      },
    },
  });
}

/**
 * Approuve ou refuse une demande premium.
 * Si approuvée : met aussi à jour/crée l'abonnement de l'utilisateur.
 */
export async function traiterDemandePremium(
  demandeId: string,
  decision: "APPROUVEE" | "REFUSEE",
  noteAdmin?: string
) {
  const demande = await prisma.demandePremium.findUnique({
    where: { id: demandeId },
  });

  if (!demande) {
    throw new ErreurAdmin("Demande introuvable");
  }

  if (demande.statut !== "EN_ATTENTE") {
    throw new ErreurAdmin("Cette demande a déjà été traitée");
  }

  await prisma.demandePremium.update({
    where: { id: demandeId },
    data: {
      statut: decision,
      noteAdmin,
      traiteLe: new Date(),
    },
  });
  await creerNotification(
    demande.utilisateurId,
    decision === "APPROUVEE" ? "Compte Premium activé" : "Demande refusée",
    decision === "APPROUVEE"
      ? "Votre compte est maintenant Premium, profitez de toutes les options."
      : "Votre demande Premium n'a pas été acceptée.",
    "/dashboard"
  );

  if (decision === "APPROUVEE") {
    await prisma.abonnement.upsert({
      where: { utilisateurId: demande.utilisateurId },
      create: {
        utilisateurId: demande.utilisateurId,
        plan: "MENSUEL",
        statut: "ACTIF",
        dateDebut: new Date(),
      },
      update: {
        plan: "MENSUEL",
        statut: "ACTIF",
        dateDebut: new Date(),
      },
    });
  }
}

/**
 * Liste tous les utilisateurs (hors mot de passe), avec le nombre
 * de CV créés et leur statut d'abonnement — vue d'ensemble pour l'admin.
 */
export async function listerUtilisateurs() {
  return prisma.utilisateur.findMany({
    orderBy: { creeLe: "desc" },
   select: {
      id: true,
      nom: true,
      email: true,
      role: true,
      estSuspendu: true,
      creeLe: true,
      _count: { select: { cvs: true } },
      abonnement: { 
        select: { 
          plan: true, 
          statut: true,
          formulePremium: true,
          dateDebut: true,
          dateFin: true,
        } 
      },
    },
  });
}

/**
 * Active ou désactive le Premium d'un utilisateur manuellement,
 * indépendamment du système de demandes.
 */
export async function togglerPremium(utilisateurId: string, activer: boolean, formule?: string) {
  const utilisateur = await prisma.utilisateur.findUnique({
    where: { id: utilisateurId },
  });

  if (!utilisateur) {
    throw new ErreurAdmin("Utilisateur introuvable");
  }

  if (activer) {
    // Activation avec formule et dates
    const dateFin = formule ? calculerDateExpiration(formule as FormulePremium) : undefined;
    
    await prisma.abonnement.upsert({
      where: { utilisateurId },
      create: {
        utilisateurId,
        plan: "MENSUEL",
        statut: "ACTIF",
        formulePremium: formule as FormulePremium,
        dateDebut: new Date(),
        dateFin,
      },
      update: {
        plan: "MENSUEL",
        statut: "ACTIF",
        formulePremium: formule as FormulePremium,
        dateDebut: new Date(),
        dateFin,
      },
    });

    await creerNotification(
      utilisateurId,
      "Compte Premium activé",
      "Votre compte est maintenant Premium. Profitez de toutes les options premium !",
      "/dashboard"
    );
  } else {
    // Désactivation
    await prisma.abonnement.update({
      where: { utilisateurId },
      data: {
        statut: "ANNULE",
        formulePremium: null,
        dateFin: null,
      },
    });

    await creerNotification(
      utilisateurId,
      "Compte Premium désactivé",
      "Votre compte Premium a été désactivé. Vous pouvez réactiver le Premium à tout moment.",
      "/dashboard"
    );
  }
}

export async function togglerSuspension(utilisateurId: string, suspendre: boolean) {
  const utilisateur = await prisma.utilisateur.findUnique({
    where: { id: utilisateurId },
  });

  if (!utilisateur) {
    throw new ErreurAdmin("Utilisateur introuvable");
  }

  if (utilisateur.role === "ADMIN") {
    throw new ErreurAdmin("Impossible de suspendre un compte administrateur");
  }

 await prisma.utilisateur.update({
    where: { id: utilisateurId },
    data: { estSuspendu: suspendre },
  });

  await creerNotification(
    utilisateurId,
    suspendre ? "Compte suspendu" : "Compte réactivé",
    suspendre
      ? "Votre compte a été temporairement suspendu par l'administrateur."
      : "Votre compte a été réactivé, vous pouvez de nouveau vous connecter."
  );
}

/**
 * Supprime un compte utilisateur et toutes ses données associées
 * (CV, demandes, abonnement — via les relations onDelete: Cascade du schéma).
 * Empêche un admin de se supprimer lui-même par erreur.
 */
export async function supprimerUtilisateur(
  utilisateurId: string,
  idAdminConnecte: string
) {
  if (utilisateurId === idAdminConnecte) {
    throw new ErreurAdmin("Vous ne pouvez pas supprimer votre propre compte");
  }

  const utilisateur = await prisma.utilisateur.findUnique({
    where: { id: utilisateurId },
  });

  if (!utilisateur) {
    throw new ErreurAdmin("Utilisateur introuvable");
  }

  await prisma.utilisateur.delete({ where: { id: utilisateurId } });
}

/**
 * Statistiques globales pour la vue d'ensemble du dashboard admin.
 */
export async function recupererStatistiques() {
  const [totalUtilisateurs, totalCV, demandesEnAttente, totalPremium] =
    await Promise.all([
      prisma.utilisateur.count(),
      prisma.cV.count(),
      prisma.demandePremium.count({ where: { statut: "EN_ATTENTE" } }),
      prisma.abonnement.count({ where: { statut: "ACTIF" } }),
    ]);

  return { totalUtilisateurs, totalCV, demandesEnAttente, totalPremium };
}

/**
 * Statistiques détaillées : inscriptions des 8 dernières semaines,
 * taux de conversion premium, demandes traitées vs en attente.
 */
export async function recupererStatistiquesDetaillees() {
  const huitSemainesAvant = new Date();
  huitSemainesAvant.setDate(huitSemainesAvant.getDate() - 56);

  const [
    totalUtilisateurs,
    totalPremium,
    utilisateursRecents,
    demandesApprouvees,
    demandesRefusees,
    demandesEnAttente,
    totalCV,
  ] = await Promise.all([
    prisma.utilisateur.count(),
    prisma.abonnement.count({ where: { statut: "ACTIF" } }),
    prisma.utilisateur.findMany({
      where: { creeLe: { gte: huitSemainesAvant } },
      select: { creeLe: true },
    }),
    prisma.demandePremium.count({ where: { statut: "APPROUVEE" } }),
    prisma.demandePremium.count({ where: { statut: "REFUSEE" } }),
    prisma.demandePremium.count({ where: { statut: "EN_ATTENTE" } }),
    prisma.cV.count(),
  ]);

  // Regroupement des inscriptions par semaine (8 dernières semaines)
  const inscriptionsParSemaine: { semaine: string; total: number }[] = [];
  for (let i = 7; i >= 0; i--) {
    const debutSemaine = new Date();
    debutSemaine.setDate(debutSemaine.getDate() - i * 7 - 7);
    const finSemaine = new Date();
    finSemaine.setDate(finSemaine.getDate() - i * 7);

    const total = utilisateursRecents.filter(
      (u) => u.creeLe >= debutSemaine && u.creeLe < finSemaine
    ).length;

    inscriptionsParSemaine.push({
      semaine: debutSemaine.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      }),
      total,
    });
  }

  const tauxConversion =
    totalUtilisateurs > 0
      ? Math.round((totalPremium / totalUtilisateurs) * 100)
      : 0;

  return {
    totalUtilisateurs,
    totalPremium,
    totalCV,
    tauxConversion,
    inscriptionsParSemaine,
    demandes: {
      approuvees: demandesApprouvees,
      refusees: demandesRefusees,
      enAttente: demandesEnAttente,
    },
  };
}