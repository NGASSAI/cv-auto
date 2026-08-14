import { prisma } from "@/shared/lib/prisma";
import { aAccesPremium } from "@/features/premium/lib/acces-premium";
import { obtenirInfosTemplate } from "@/features/cv/components/templates/registre-templates";
export class ErreurCV extends Error {}
async function verifierAccesPremiumSiNecessaire(
  utilisateurId: string,
  donnees: { templateId?: string; police?: string; alignementTexte?: string; tailleTexte?: string }
) {
  const utilisateur = await prisma.utilisateur.findUnique({
    where: { id: utilisateurId },
    select: { role: true, abonnement: { select: { statut: true } } },
  });

  if (!utilisateur) {
    throw new ErreurCV("Utilisateur introuvable");
  }

  const estPremium = aAccesPremium(utilisateur);
  if (estPremium) return;

  if (donnees.templateId && obtenirInfosTemplate(donnees.templateId).estPremium) {
    throw new ErreurCV("Ce template est réservé aux comptes Premium");
  }
  if (donnees.police && donnees.police !== "geist") {
    throw new ErreurCV("Le choix de la police est réservé aux comptes Premium");
  }
  if (donnees.alignementTexte && donnees.alignementTexte !== "gauche") {
    throw new ErreurCV("L'alignement du texte est réservé aux comptes Premium");
  }
  if (donnees.tailleTexte && donnees.tailleTexte !== "moyenne") {
    throw new ErreurCV("La taille du texte est réservée aux comptes Premium");
  }
}

/**
 * Récupère tous les CV d'un utilisateur, triés du plus récent au plus ancien.
 * Utilisé pour l'affichage de la liste sur le dashboard.
 */
export async function listerCVUtilisateur(utilisateurId: string) {
  return prisma.cV.findMany({
    where: { utilisateurId },
    orderBy: { misAJourLe: "desc" },
  });
}

/**
 * Récupère un CV complet avec toutes ses relations (informations
 * personnelles, sections et leurs items), triés dans le bon ordre.
 * Vérifie que le CV appartient bien à l'utilisateur demandeur.
 */
export async function recupererCVComplet(cvId: string, utilisateurId: string) {
  const cv = await prisma.cV.findUnique({
    where: { id: cvId },
    include: {
      informations: true,
      sections: {
        orderBy: { ordre: "asc" },
        include: {
          items: {
            orderBy: { ordre: "asc" },
          },
        },
      },
    },
  });

  if (!cv) {
    throw new ErreurCV("CV introuvable");
  }

  if (cv.utilisateurId !== utilisateurId) {
    throw new ErreurCV("Vous n'avez pas accès à ce CV");
  }

  await verifierAccesPremiumSiNecessaire(utilisateurId, {
    templateId: cv.templateId,
  });

  return cv;
}

/**
 * Crée un nouveau CV vide pour un utilisateur, avec ses informations
 * personnelles initialisées (vides, à remplir ensuite dans l'éditeur).
 */
export async function creerCV(utilisateurId: string, titre: string) {
  try {
    return await prisma.cV.create({
      data: {
        utilisateurId,
        titre,
        informations: {
          create: {},
        },
      },
    });
  } catch (erreur) {
    console.error("Erreur création CV dans prisma:", erreur);
    throw new ErreurCV("Impossible de créer le CV en base de données");
  }
}

/**
 * Met à jour les champs généraux d'un CV (titre, template, couleur).
 * Vérifie la propriété avant modification.
 */
export async function mettreAJourCV(
  cvId: string,
  utilisateurId: string,
  donnees: { titre?: string; templateId?: string; couleurAccent?: string }
) {
  const cv = await prisma.cV.findUnique({ where: { id: cvId } });

  if (!cv) {
    throw new ErreurCV("CV introuvable");
  }

  if (cv.utilisateurId !== utilisateurId) {
    throw new ErreurCV("Vous n'avez pas accès à ce CV");
  }

  if (donnees.templateId) {
    await verifierAccesPremiumSiNecessaire(utilisateurId, {
      templateId: donnees.templateId,
    });
  }

  const miseAJour: {
    titre?: string;
    templateId?: string;
    couleurAccent?: string;
  } = {};

  if (donnees.titre !== undefined) {
    miseAJour.titre = donnees.titre;
  }

  if (donnees.templateId !== undefined) {
    miseAJour.templateId = donnees.templateId;
  }

  if (donnees.couleurAccent !== undefined) {
    miseAJour.couleurAccent = donnees.couleurAccent;
  }

  return prisma.cV.update({
    where: { id: cvId },
    data: miseAJour,
  });
}

/**
 * Met à jour les informations personnelles d'un CV.
 * Vérifie la propriété avant modification.
 */
export async function mettreAJourInformations(
  cvId: string,
  utilisateurId: string,
  donnees: Record<string, string | null>
) {
  const cv = await prisma.cV.findUnique({ where: { id: cvId } });

  if (!cv) {
    throw new ErreurCV("CV introuvable");
  }

  if (cv.utilisateurId !== utilisateurId) {
    throw new ErreurCV("Vous n'avez pas accès à ce CV");
  }

  return prisma.informationsPersonnelles.update({
    where: { cvId },
    data: donnees,
  });
}

/**
 * Supprime un CV — vérifie d'abord qu'il appartient bien à l'utilisateur
 * qui fait la demande, pour empêcher qu'un utilisateur supprime le CV
 * de quelqu'un d'autre en devinant un id.
 */
export async function supprimerCV(cvId: string, utilisateurId: string) {
  const cv = await prisma.cV.findUnique({ where: { id: cvId } });

  if (!cv) {
    throw new ErreurCV("CV introuvable");
  }

  if (cv.utilisateurId !== utilisateurId) {
    throw new ErreurCV("Vous n'avez pas accès à ce CV");
  }

  await prisma.cV.delete({ where: { id: cvId } });
}