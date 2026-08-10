import { prisma } from "@/shared/lib/prisma";

export class ErreurCV extends Error {}

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

  return cv;
}

/**
 * Crée un nouveau CV vide pour un utilisateur, avec ses informations
 * personnelles initialisées (vides, à remplir ensuite dans l'éditeur).
 */
export async function creerCV(utilisateurId: string, titre: string) {
  return prisma.cV.create({
    data: {
      utilisateurId,
      titre,
      informations: {
        create: {},
      },
    },
  });
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

  return prisma.cV.update({
    where: { id: cvId },
    data: donnees,
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