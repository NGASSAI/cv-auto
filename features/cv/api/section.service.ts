import { prisma } from "@/shared/lib/prisma";
import type {
  DonneesCreationSection,
  DonneesMiseAJourSection,
  DonneesCreationItem,
  DonneesMiseAJourItem,
} from "@/features/cv/validators/section.schema";

export class ErreurSection extends Error {}

/**
 * Vérifie qu'un CV appartient bien à l'utilisateur donné.
 * Utilisé avant toute création de section, pour s'assurer qu'on
 * n'ajoute pas de contenu dans le CV de quelqu'un d'autre.
 */
async function verifierProprieteCV(cvId: string, utilisateurId: string) {
  const cv = await prisma.cV.findUnique({ where: { id: cvId } });

  if (!cv) {
    throw new ErreurSection("CV introuvable");
  }

  if (cv.utilisateurId !== utilisateurId) {
    throw new ErreurSection("Vous n'avez pas accès à ce CV");
  }
}

/**
 * Vérifie qu'une section appartient bien (via son CV) à l'utilisateur donné.
 * Remonte la relation Section -> CV -> utilisateurId pour la vérification,
 * car une section n'a pas de propriétaire direct.
 */
async function verifierProprieteSection(sectionId: string, utilisateurId: string) {
  const section = await prisma.section.findUnique({
    where: { id: sectionId },
    include: { cv: true },
  });

  if (!section) {
    throw new ErreurSection("Section introuvable");
  }

  if (section.cv.utilisateurId !== utilisateurId) {
    throw new ErreurSection("Vous n'avez pas accès à cette section");
  }

  return section;
}

/**
 * Vérifie qu'un item appartient bien (via sa section puis son CV)
 * à l'utilisateur donné.
 */
async function verifierProprieteItem(itemId: string, utilisateurId: string) {
  const item = await prisma.itemSection.findUnique({
    where: { id: itemId },
    include: { section: { include: { cv: true } } },
  });

  if (!item) {
    throw new ErreurSection("Élément introuvable");
  }

  if (item.section.cv.utilisateurId !== utilisateurId) {
    throw new ErreurSection("Vous n'avez pas accès à cet élément");
  }

  return item;
}

/**
 * Crée une nouvelle section dans un CV, positionnée après
 * les sections existantes (ordre = nombre de sections actuelles).
 */
export async function creerSection(
  cvId: string,
  utilisateurId: string,
  donnees: DonneesCreationSection
) {
  await verifierProprieteCV(cvId, utilisateurId);

  const nombreSections = await prisma.section.count({ where: { cvId } });

  return prisma.section.create({
    data: {
      cvId,
      type: donnees.type,
      titre: donnees.titre,
      ordre: nombreSections,
    },
  });
}

/**
 * Met à jour le titre ou la visibilité d'une section.
 */
export async function mettreAJourSection(
  sectionId: string,
  utilisateurId: string,
  donnees: DonneesMiseAJourSection
) {
  await verifierProprieteSection(sectionId, utilisateurId);

  return prisma.section.update({
    where: { id: sectionId },
    data: donnees,
  });
}

/**
 * Supprime une section et tous ses items (cascade gérée par le schéma Prisma).
 */
export async function supprimerSection(sectionId: string, utilisateurId: string) {
  await verifierProprieteSection(sectionId, utilisateurId);

  await prisma.section.delete({ where: { id: sectionId } });
}

/**
 * Réorganise l'ordre des sections d'un CV après un drag & drop.
 * Reçoit la liste complète des ids dans le nouvel ordre souhaité.
 */
export async function reordonnerSections(
  cvId: string,
  utilisateurId: string,
  ordreIds: string[]
) {
  await verifierProprieteCV(cvId, utilisateurId);

  await prisma.$transaction(
    ordreIds.map((id, index) =>
      prisma.section.update({
        where: { id },
        data: { ordre: index },
      })
    )
  );
}

/**
 * Crée un nouvel item dans une section, positionné en dernier.
 */
export async function creerItem(
  sectionId: string,
  utilisateurId: string,
  donnees: DonneesCreationItem
) {
  await verifierProprieteSection(sectionId, utilisateurId);

  const nombreItems = await prisma.itemSection.count({ where: { sectionId } });

  return prisma.itemSection.create({
    data: {
      sectionId,
      ordre: nombreItems,
      titre: donnees.titre,
      sousTitre: donnees.sousTitre,
      lieu: donnees.lieu,
      dateDebut: donnees.dateDebut ? new Date(donnees.dateDebut) : undefined,
      dateFin: donnees.dateFin ? new Date(donnees.dateFin) : undefined,
      description: donnees.description,
      donneesJson: donnees.donneesJson as never,
    },
  });
}

/**
 * Met à jour un item existant.
 */
export async function mettreAJourItem(
  itemId: string,
  utilisateurId: string,
  donnees: DonneesMiseAJourItem
) {
  await verifierProprieteItem(itemId, utilisateurId);

  return prisma.itemSection.update({
    where: { id: itemId },
    data: {
      titre: donnees.titre,
      sousTitre: donnees.sousTitre,
      lieu: donnees.lieu,
      dateDebut: donnees.dateDebut ? new Date(donnees.dateDebut) : undefined,
      dateFin: donnees.dateFin ? new Date(donnees.dateFin) : undefined,
      description: donnees.description,
      donneesJson: donnees.donneesJson as never,
    },
  });
}

/**
 * Supprime un item.
 */
export async function supprimerItem(itemId: string, utilisateurId: string) {
  await verifierProprieteItem(itemId, utilisateurId);

  await prisma.itemSection.delete({ where: { id: itemId } });
}

/**
 * Réorganise l'ordre des items à l'intérieur d'une section.
 */
export async function reordonnerItems(
  sectionId: string,
  utilisateurId: string,
  ordreIds: string[]
) {
  await verifierProprieteSection(sectionId, utilisateurId);

  await prisma.$transaction(
    ordreIds.map((id, index) =>
      prisma.itemSection.update({
        where: { id },
        data: { ordre: index },
      })
    )
  );
}