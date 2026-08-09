import { z } from "zod";

/**
 * Schéma de création d'un CV.
 * Un titre est requis, le reste des champs (template, couleur...)
 * a des valeurs par défaut gérées côté base de données.
 */
export const schemaCreationCV = z.object({
  titre: z
    .string()
    .min(1, "Le titre est requis")
    .max(100, "Le titre est trop long")
    .default("Mon CV"),
});

export type DonneesCreationCV = z.infer<typeof schemaCreationCV>;

/**
 * Schéma de mise à jour des informations générales d'un CV
 * (titre, template choisi, couleur d'accent).
 */
export const schemaMiseAJourCV = z.object({
  titre: z.string().min(1).max(100).optional(),
  templateId: z.string().optional(),
  couleurAccent: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Couleur invalide")
    .optional(),
});

export type DonneesMiseAJourCV = z.infer<typeof schemaMiseAJourCV>;