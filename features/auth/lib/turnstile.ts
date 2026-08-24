/**
 * Vérification côté serveur d'un jeton Cloudflare Turnstile (CAPTCHA).
 *
 * Nécessite TURNSTILE_SECRET_KEY (clé secrète, jamais exposée au client)
 * en variable d'environnement.
 *
 * Le widget Turnstile doit être ajouté côté FRONTEND (dans le formulaire
 * React) avec la clé publique NEXT_PUBLIC_TURNSTILE_SITE_KEY — ce fichier
 * ne couvre que la vérification côté serveur du jeton qu'il produit.
 * Voir la doc: https://developers.cloudflare.com/turnstile/get-started/
 */

const URL_VERIFICATION_TURNSTILE = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifierTurnstile(jeton: string | undefined, ipClient: string): Promise<boolean> {
  if (!jeton) return false;

  const cleSecrete = process.env.TURNSTILE_SECRET_KEY;
  if (!cleSecrete) {
    console.error("TURNSTILE_SECRET_KEY n'est pas définie dans les variables d'environnement.");
    // En cas de mauvaise configuration, on bloque par sécurité plutôt
    // que de laisser passer silencieusement.
    return false;
  }

  try {
    const reponse = await fetch(URL_VERIFICATION_TURNSTILE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: cleSecrete,
        response: jeton,
        remoteip: ipClient,
      }),
    });
const resultat = await reponse.json();

console.log("Réponse Cloudflare Turnstile :", resultat);

return resultat.success === true;
  } catch (erreur) {
    console.error("Erreur lors de la vérification Turnstile :", erreur);
    return false;
  }
}