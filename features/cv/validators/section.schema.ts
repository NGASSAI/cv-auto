import { z } from "zod";

const TYPES_SECTION = [
  "EXPERIENCE",
  "FORMATION",
  "COMPETENCES",
  "LANGUES",
  "CENTRES_INTERET",
  "CERTIFICATIONS",
  "PROJETS",
  "PERSONNALISEE",
] as const;

/**
 * Création d'une nouvelle section dans un CV.
 */
export const schemaCreationSection = z.object({
  type: z.enum(TYPES_SECTION),
  titre: z.string().min(1, "Le titre est requis").max(60),
});

export type DonneesCreationSection = z.infer<typeof schemaCreationSection>;

/**
 * Mise à jour d'une section (titre, visibilité).
 * L'ordre est géré séparément via la route de réorganisation.
 */
export const schemaMiseAJourSection = z.object({
  titre: z.string().min(1).max(60).optional(),
  estVisible: z.boolean().optional(),
});

export type DonneesMiseAJourSection = z.infer<typeof schemaMiseAJourSection>;

/**
 * Création d'un item dans une section (une expérience, une formation...).
 * Tous les champs sont optionnels sauf la section cible, car l'utilisateur
 * peut créer un item vide puis le remplir progressivement.
 */
export const schemaCreationItem = z.object({
  titre: z.string().max(150).optional(),
  sousTitre: z.string().max(150).optional(),
  lieu: z.string().max(100).optional(),
  dateDebut: z.string().datetime().optional().nullable(),
  dateFin: z.string().datetime().optional().nullable(),
  description: z.string().max(2000).optional(),
  donneesJson: z.unknown().optional(),
});

export type DonneesCreationItem = z.infer<typeof schemaCreationItem>;

/**
 * Mise à jour d'un item — mêmes champs, tous optionnels.
 */
export const schemaMiseAJourItem = schemaCreationItem;
export type DonneesMiseAJourItem = z.infer<typeof schemaMiseAJourItem>;

/**
 * Réorganisation des sections après un drag & drop.
 * On envoie la liste complète des ids dans le nouvel ordre.
 */
export const schemaReordonnerSections = z.object({
  ordreIds: z.array(z.string()).min(1),
});

export type DonneesReordonnerSections = z.infer<typeof schemaReordonnerSections>;

/**
 * Réorganisation des items à l'intérieur d'une section.
 */
export const schemaReordonnerItems = z.object({
  sectionId: z.string(),
  ordreIds: z.array(z.string()).min(1),
});

export type DonneesReordonnerItems = z.infer<typeof schemaReordonnerItems>;