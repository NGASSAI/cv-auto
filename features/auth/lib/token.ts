import crypto from "crypto";
import { prisma } from "@/shared/lib/prisma";

/**
 * Durée de validité d'un token de réinitialisation : 1 heure.
 * Passé ce délai, le lien envoyé par email ne fonctionne plus.
 */
const DUREE_VALIDITE_MINUTES = 60;

/**
 * Génère un token de réinitialisation sécurisé pour un email donné,
 * le stocke en base, et le retourne pour qu'il soit inséré dans le lien
 * envoyé par email.
 *
 * Si un token existant n'a pas encore expiré pour cet email, il est
 * supprimé avant d'en créer un nouveau (évite d'accumuler des tokens
 * inutilisés en base).
 */
export async function genererTokenReinitialisation(email: string): Promise<string> {
  // Nettoyage des anciens tokens pour cet email
  await prisma.tokenReinitialisation.deleteMany({
    where: { email },
  });

  const token = crypto.randomBytes(32).toString("hex");
  const expireLe = new Date(Date.now() + DUREE_VALIDITE_MINUTES * 60 * 1000);

  await prisma.tokenReinitialisation.create({
    data: {
      email,
      token,
      expireLe,
    },
  });

  return token;
}

/**
 * Vérifie qu'un token existe, n'a pas expiré, et retourne l'email associé.
 * Retourne null si le token est invalide ou expiré.
 */
export async function verifierTokenReinitialisation(
  token: string
): Promise<string | null> {
  const enregistrement = await prisma.tokenReinitialisation.findUnique({
    where: { token },
  });

  if (!enregistrement) {
    return null;
  }

  if (enregistrement.expireLe < new Date()) {
    // Token expiré : on le supprime au passage pour garder la table propre
    await prisma.tokenReinitialisation.delete({ where: { token } });
    return null;
  }

  return enregistrement.email;
}

/**
 * Supprime un token après utilisation réussie
 * (empêche de réutiliser le même lien de réinitialisation deux fois).
 */
export async function supprimerTokenReinitialisation(token: string): Promise<void> {
  await prisma.tokenReinitialisation.deleteMany({
    where: { token },
  });
}