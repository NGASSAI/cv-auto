import type { FormulePremium } from "@/lib/generated/prisma/client";

export interface FormulePremiumConfig {
  id: FormulePremium;
  nom: string;
  prix: number; // en FCFA
  dureeJours: number;
  description: string;
}

export const FORMULES_PREMIUM: FormulePremiumConfig[] = [
  {
    id: "MENSUEL_1500",
    nom: "Mensuel",
    prix: 1500,
    dureeJours: 30,
    description: "1 mois d'accès Premium",
  },
  {
    id: "DEUX_SEMAINES_1000",
    nom: "2 semaines",
    prix: 1000,
    dureeJours: 14,
    description: "2 semaines d'accès Premium",
  },
  {
    id: "TROIS_JOURS_600",
    nom: "3 jours",
    prix: 600,
    dureeJours: 3,
    description: "3 jours d'accès Premium",
  },
];

export function obtenirFormuleParId(id: FormulePremium): FormulePremiumConfig | undefined {
  return FORMULES_PREMIUM.find((f) => f.id === id);
}

export function calculerDateExpiration(formule: FormulePremium): Date {
  const config = obtenirFormuleParId(formule);
  if (!config) {
    throw new Error(`Formule Premium inconnue: ${formule}`);
  }

  const date = new Date();
  date.setDate(date.getDate() + config.dureeJours);
  return date;
}

export function formaterDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
