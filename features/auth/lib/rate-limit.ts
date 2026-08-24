/**
 * Rate limiting via Upstash Redis (@upstash/ratelimit) — fonctionne de
 * façon fiable même en environnement serverless (Vercel), contrairement
 * à un compteur en mémoire qui serait remis à zéro à chaque nouvelle
 * invocation de fonction.
 *
 * Nécessite les variables d'environnement UPSTASH_REDIS_REST_URL et
 * UPSTASH_REDIS_REST_TOKEN (fournies par ton dashboard Upstash après
 * création d'une base Redis).
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

/**
 * Inscription : 5 tentatives par heure et par IP.
 * Suffisant pour un usage légitime (une personne ne crée pas 5 comptes
 * par heure), bloque le spam de comptes automatisé.
 */
export const limiteurInscription = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  prefix: "ratelimit:inscription",
});

/**
 * Connexion : 5 tentatives par 15 minutes, combinées IP + email.
 * Protège contre le bruteforce de mot de passe sur un compte précis,
 * sans bloquer injustement tout un réseau (IP partagée) qui tenterait
 * de se connecter à des comptes différents.
 */
export const limiteurConnexion = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  prefix: "ratelimit:connexion",
});

/**
 * Demande de réinitialisation : 3 tentatives par heure, par IP ET par
 * email (les deux sont vérifiés séparément) — plus strict que les
 * autres routes car le lien de réinitialisation est ici renvoyé
 * directement dans la réponse (pas d'email), donc chaque tentative
 * réussie expose potentiellement un compte.
 */
export const limiteurReinitialisationParIp = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  prefix: "ratelimit:reinitialisation:ip",
});

export const limiteurReinitialisationParEmail = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  prefix: "ratelimit:reinitialisation:email",
});

/**
 * Extrait l'adresse IP du client à partir des en-têtes de la requête.
 * Sur Vercel, x-forwarded-for contient l'IP réelle du visiteur (le
 * serveur Next.js est toujours derrière leur proxy).
 */
export function obtenirIpClient(request: Request): string {
  const enTete = request.headers.get("x-forwarded-for");
  if (enTete) {
    return enTete.split(",")[0].trim();
  }
  return "ip-inconnue";
}