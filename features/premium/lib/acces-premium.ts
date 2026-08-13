interface UtilisateurPourVerification {
  role: string;
  abonnement?: { statut: string; formulePremium?: string | null } | null;
}

/**
 * Détermine si un utilisateur a accès aux fonctionnalités premium.
 * Un ADMIN a toujours accès, peu importe son abonnement.
 * Un utilisateur normal doit avoir un abonnement au statut ACTIF.
 *
 * Fonction centrale à réutiliser partout où on doit vérifier l'accès
 * premium (éditeur de CV, choix de template, export...).
 */
export function aAccesPremium(utilisateur: UtilisateurPourVerification): boolean {
  if (utilisateur.role === "ADMIN") {
    return true;
  }

  return utilisateur.abonnement?.statut === "ACTIF";
}

/**
 * Détermine si un utilisateur a accès aux Suggestions IA.
 * Un ADMIN a toujours accès.
 * Un utilisateur normal doit avoir un abonnement ACTIF avec une formule de 1000 FCFA ou plus
 * (DEUX_SEMAINES_1000 ou MENSUEL_1500).
 */
export function aAccesSuggestionsIA(utilisateur: UtilisateurPourVerification): boolean {
  if (utilisateur.role === "ADMIN") {
    return true;
  }

  if (utilisateur.abonnement?.statut !== "ACTIF") {
    return false;
  }

  // Formules de 1000 FCFA ou plus
  const formulesAvecIA = ["DEUX_SEMAINES_1000", "MENSUEL_1500"];
  return formulesAvecIA.includes(utilisateur.abonnement.formulePremium || "");
}