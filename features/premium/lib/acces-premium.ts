interface UtilisateurPourVerification {
  role: string;
  abonnement?: { statut: string } | null;
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