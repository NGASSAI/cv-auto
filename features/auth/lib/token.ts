import crypto from "crypto";
import { prisma } from "@/shared/lib/prisma";

/**
 * Durée de validité d'un token de réinitialisation : 15 minutes.
 */
const DUREE_VALIDITE_MINUTES = 15;

/**
 * Génère un token de réinitialisation sécurisé pour un email donné.
 *
 * Le token est stocké en base avec sa date d'expiration.
 */
export async function genererTokenReinitialisation(
  email: string
): Promise<{ token: string; expireLe: Date }> {
  // Supprime les anciens tokens pour cet email
  await prisma.tokenReinitialisation.deleteMany({
    where: { email },
  });

  const token = crypto.randomBytes(32).toString("hex");

  const expireLe = new Date(
    Date.now() + DUREE_VALIDITE_MINUTES * 60 * 1000
  );

  await prisma.tokenReinitialisation.create({
    data: {
      email,
      token,
      expireLe,
    },
  });

  return {
    token,
    expireLe,
  };
}

/**
 * Vérifie qu'un token existe et n'est pas expiré.
 *
 * Retourne l'email associé au token ou null si le token
 * est invalide ou expiré.
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
    await prisma.tokenReinitialisation.delete({
      where: { token },
    });

    return null;
  }

  return enregistrement.email;
}

/**
 * Supprime un token après utilisation.
 *
 * Cela empêche la réutilisation du même lien.
 */
export async function supprimerTokenReinitialisation(
  token: string
): Promise<void> {
  await prisma.tokenReinitialisation.deleteMany({
    where: { token },
  });
}