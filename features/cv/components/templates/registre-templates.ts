import type { ComponentType } from "react";
import { TemplateClassique } from "@/features/cv/components/templates/classique";
import { TemplateMinimaliste } from "@/features/cv/components/templates/minimaliste";
import { TemplateModerne } from "@/features/cv/components/templates/moderne";
import { TemplateElegant } from "@/features/cv/components/templates/elegant";
import type { ProprietesTemplate } from "@/features/cv/components/templates/types";

export interface MetadonneesTemplate {
  cle: string;
  nom: string;
  estPremium: boolean;
  composant: ComponentType<ProprietesTemplate>;
}

/**
 * Registre central de tous les templates disponibles.
 * Source unique de vérité : utilisé pour le rendu live dans l'éditeur
 * ET pour le sélecteur de template affiché à l'utilisateur.
 *
 * Note : ce registre est codé en dur pour l'instant (côté code).
 * Le modèle Prisma `Template` existe déjà en base pour permettre
 * à l'admin d'activer/désactiver ou de changer le statut premium
 * sans redéploiement — on branchera cette synchronisation au
 * sous-module admin dédié aux templates, plus tard.
 */
export const REGISTRE_TEMPLATES: Record<string, MetadonneesTemplate> = {
  classique: {
    cle: "classique",
    nom: "Classique",
    estPremium: false,
    composant: TemplateClassique,
  },
  minimaliste: {
    cle: "minimaliste",
    nom: "Minimaliste",
    estPremium: false,
    composant: TemplateMinimaliste,
  },
  moderne: {
    cle: "moderne",
    nom: "Moderne",
    estPremium: false,
    composant: TemplateModerne,
  },
  elegant: {
    cle: "elegant",
    nom: "Élégant",
    estPremium: false,
    composant: TemplateElegant,
  },
};

export function obtenirTemplate(cle: string): MetadonneesTemplate {
  return REGISTRE_TEMPLATES[cle] ?? REGISTRE_TEMPLATES.classique;
}

export function listerTemplates(): MetadonneesTemplate[] {
  return Object.values(REGISTRE_TEMPLATES);
}