import type { ComponentType } from "react";
import { TemplateClassique } from "@/features/cv/components/templates/classique";
import { TemplateMinimaliste } from "@/features/cv/components/templates/minimaliste";
import { TemplateModerne } from "@/features/cv/components/templates/moderne";
import { TemplateElegant } from "@/features/cv/components/templates/elegant";
import { TemplateExecutif } from "@/features/cv/components/templates/executif";
import { TemplateDossierStructure } from "@/features/cv/components/templates/dossier-structure";
import { TemplatePortfolio } from "@/features/cv/components/templates/portfolio";
import type { ProprietesTemplate } from "@/features/cv/components/templates/types";

const REGISTRE_TEMPLATES: Record<string, ComponentType<ProprietesTemplate>> = {
  classique: TemplateClassique,
  minimaliste: TemplateMinimaliste,
  moderne: TemplateModerne,
  elegant: TemplateElegant,
  portfolio: TemplatePortfolio,
  executif: TemplateExecutif,
  "dossier-structure": TemplateDossierStructure,
};

const INFOS_TEMPLATES: Record<string, { nom: string; estPremium: boolean }> = {
  classique: { nom: "Classique", estPremium: false },
  minimaliste: { nom: "Minimaliste", estPremium: false },
  moderne: { nom: "Moderne", estPremium: false },
  elegant: { nom: "Élégant", estPremium: true },
  portfolio: { nom: "Portfolio", estPremium: true },
  executif: { nom: "Exécutif", estPremium: true },
  "dossier-structure": { nom: "Dossier Structure", estPremium: true },
};

export function obtenirComposantTemplate(templateId: string): ComponentType<ProprietesTemplate> {
  return REGISTRE_TEMPLATES[templateId] ?? REGISTRE_TEMPLATES.moderne;
}

export function obtenirTemplate(templateId: string): ComponentType<ProprietesTemplate> {
  return obtenirComposantTemplate(templateId);
}

export function obtenirInfosTemplate(templateId: string): { nom: string; estPremium: boolean } {
  return INFOS_TEMPLATES[templateId] ?? { nom: templateId, estPremium: false };
}

export function listerTemplates(): Array<{ cle: string; composant: ComponentType<ProprietesTemplate>; nom: string; estPremium: boolean }> {
  return Object.keys(REGISTRE_TEMPLATES).map(cle => ({
    cle,
    composant: REGISTRE_TEMPLATES[cle],
    nom: INFOS_TEMPLATES[cle]?.nom || cle,
    estPremium: INFOS_TEMPLATES[cle]?.estPremium || false,
  }));
}
