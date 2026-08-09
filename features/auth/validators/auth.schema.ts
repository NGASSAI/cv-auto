import { z } from "zod";

/**
 * Règles du mot de passe : minimum 8 caractères,
 * au moins une majuscule, une minuscule et un chiffre.
 */
const schemaMotDePasse = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères")
  .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
  .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
  .regex(/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]]/, "Le mot de passe doit contenir au moins un caractère spécial")
  .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre");

/**
 * Schéma de validation pour l'inscription
 */
export const schemaInscription = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  motDePasse: schemaMotDePasse,
});

export type DonneesInscription = z.infer<typeof schemaInscription>;

/**
 * Schéma de validation pour la connexion
 * (pas de règles de force ici : on vérifie juste que les champs sont présents)
 */
export const schemaConnexion = z.object({
  email: z.string().email("Adresse email invalide"),
  motDePasse: z.string().min(1, "Le mot de passe est requis"),
});

export type DonneesConnexion = z.infer<typeof schemaConnexion>;

/**
 * Schéma pour la demande de réinitialisation (mot de passe oublié)
 */
export const schemaDemandeReinitialisation = z.object({
  email:z.email("Adresse email invalide"),
});

export type DonneesDemandeReinitialisation = z.infer<typeof schemaDemandeReinitialisation >;   

/**
 * Schéma pour la réinitialisation effective du mot de passe
 */
export const schemaReinitialisation = z.object({
  token: z.string().min(1, "Token manquant"),
  nouveauMotDePasse: schemaMotDePasse,
});

export type DonneesReinitialisation = z.infer<typeof schemaReinitialisation>;