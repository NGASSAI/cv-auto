import bcrypt from "bcrypt";

/**
 * Nombre de "tours" de salage — 12 est un bon compromis
 * sécurité/performance en 2026 (plus haut = plus lent mais plus sûr).
 */
const NOMBRE_TOURS_SALAGE = 12;

/**
 * Hash un mot de passe en clair avant de le stocker en base.
 * À utiliser uniquement lors de l'inscription ou de la réinitialisation.
 */
export async function hacherMotDePasse(motDePasseEnClair: string): Promise<string> {
  return bcrypt.hash(motDePasseEnClair, NOMBRE_TOURS_SALAGE);
}

/**
 * Compare un mot de passe en clair (saisi par l'utilisateur à la connexion)
 * avec le hash stocké en base.
 * Retourne true si ça correspond, false sinon.
 */
export async function verifierMotDePasse(
  motDePasseEnClair: string,
  motDePasseHache: string
): Promise<boolean> {
  return bcrypt.compare(motDePasseEnClair, motDePasseHache);
}