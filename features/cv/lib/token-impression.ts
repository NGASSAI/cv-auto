/**
 * Token signé à très courte durée de vie, utilisé pour autoriser
 * Puppeteer à accéder à la page d'impression interne
 * (app/imprimer/cv/[cvId]/page.tsx) SANS passer par la session
 * NextAuth habituelle (Puppeteer n'a pas de cookie de navigateur).
 *
 * Le token encode le cvId + l'userId propriétaire, avec une expiration
 * de 60 secondes — largement suffisant pour le temps d'un rendu PDF,
 * mais inutilisable si jamais l'URL fuitait ailleurs.
 *
 * Utilise HMAC-SHA256 via le module natif "node:crypto" — pas de
 * nouvelle dépendance nécessaire. Réutilise NEXTAUTH_SECRET (déjà
 * configuré pour next-auth) comme clé de signature.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

interface ChargeUtileToken {
  cvId: string;
  userId: string;
  exp: number; // timestamp d'expiration en millisecondes
}

const DUREE_VALIDITE_MS = 60 * 1000; // 60 secondes

function obtenirCle(): string {
  const cle = process.env.NEXTAUTH_SECRET;
  if (!cle) {
    throw new Error(
      "NEXTAUTH_SECRET n'est pas défini — requis pour signer les tokens d'impression PDF."
    );
  }
  return cle;
}

function encoderBase64Url(valeur: string): string {
  return Buffer.from(valeur, "utf-8").toString("base64url");
}

function decoderBase64Url(valeur: string): string {
  return Buffer.from(valeur, "base64url").toString("utf-8");
}

function signer(donnees: string): string {
  return createHmac("sha256", obtenirCle()).update(donnees).digest("hex");
}

/**
 * Génère un token signé pour un CV et un utilisateur donnés.
 * À appeler juste avant de lancer Puppeteer dans la route d'export.
 */
export function genererTokenImpression(cvId: string, userId: string): string {
  const charge: ChargeUtileToken = {
    cvId,
    userId,
    exp: Date.now() + DUREE_VALIDITE_MS,
  };
  const chargeEncodee = encoderBase64Url(JSON.stringify(charge));
  const signature = signer(chargeEncodee);
  return `${chargeEncodee}.${signature}`;
}

/**
 * Vérifie un token reçu par la page d'impression.
 * Retourne la charge utile (cvId, userId) si le token est valide et
 * non expiré, sinon null.
 */
export function verifierTokenImpression(token: string | null | undefined): ChargeUtileToken | null {
  if (!token) return null;

  const [chargeEncodee, signatureRecue] = token.split(".");
  if (!chargeEncodee || !signatureRecue) return null;

  const signatureAttendue = signer(chargeEncodee);

  // Comparaison en temps constant pour éviter les attaques par timing
  const bufferRecu = Buffer.from(signatureRecue, "hex");
  const bufferAttendu = Buffer.from(signatureAttendue, "hex");
  if (bufferRecu.length !== bufferAttendu.length) return null;
  if (!timingSafeEqual(bufferRecu, bufferAttendu)) return null;

  try {
    const charge = JSON.parse(decoderBase64Url(chargeEncodee)) as ChargeUtileToken;
    if (typeof charge.exp !== "number" || Date.now() > charge.exp) return null;
    if (!charge.cvId || !charge.userId) return null;
    return charge;
  } catch {
    return null;
  }
}