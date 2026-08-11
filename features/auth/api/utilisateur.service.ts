import { prisma } from "@/shared/lib/prisma";
import { hacherMotDePasse, verifierMotDePasse } from "@/features/auth/lib/mot-de-passe";

export class ErreurAuth extends Error {}

/**
 * Détermine le rôle qu'un utilisateur doit avoir, en fonction
 * de la variable d'environnement EMAIL_ADMIN. Permet de définir
 * le tout premier compte admin sans intervention manuelle en base.
 */
function determinerRole(email: string): "UTILISATEUR" | "ADMIN" {
  return email === process.env.EMAIL_ADMIN ? "ADMIN" : "UTILISATEUR";
}

/**
 * Crée un nouvel utilisateur avec mot de passe hashé.
 * Lève une ErreurAuth si l'email est déjà utilisé.
 */
export async function creerUtilisateur(
  nom: string,
  email: string,
  motDePasse: string
) {
  const utilisateurExistant = await prisma.utilisateur.findUnique({
    where: { email },
  });

  if (utilisateurExistant) {
    throw new ErreurAuth("Un compte existe déjà avec cet email");
  }

  const motDePasseHache = await hacherMotDePasse(motDePasse);

  const utilisateur = await prisma.utilisateur.create({
    data: {
      nom,
      email,
      motDePasse: motDePasseHache,
      role: determinerRole(email),
    },
  });

  const { motDePasse: _motDePasseHache, ...utilisateurSansMotDePasse } = utilisateur;
  return utilisateurSansMotDePasse;
}

/**
 * Vérifie les identifiants d'un utilisateur pour la connexion.
 * Synchronise aussi le rôle admin si l'email correspond à EMAIL_ADMIN
 * (utile pour un compte créé avant la mise en place de ce système).
 *
 * Retourne l'utilisateur (sans mot de passe) si les identifiants sont valides,
 * ou null sinon.
 */
export async function verifierIdentifiants(email: string, motDePasse: string) {
  let utilisateur = await prisma.utilisateur.findUnique({
    where: { email },
  });

  if (!utilisateur || !utilisateur.motDePasse) {
    return null;
  }

 const motDePasseValide = await verifierMotDePasse(
    motDePasse,
    utilisateur.motDePasse
  );

  if (!motDePasseValide) {
    return null;
  }

  if (utilisateur.estSuspendu) {
    throw new Error("COMPTE_SUSPENDU");
  }

  // Synchronisation du rôle admin à chaque connexion
  const roleAttendu = determinerRole(email);
  if (utilisateur.role !== roleAttendu) {
    utilisateur = await prisma.utilisateur.update({
      where: { email },
      data: { role: roleAttendu },
    });
  }

  const { motDePasse: _motDePasseHache, ...utilisateurSansMotDePasse } = utilisateur;
  return utilisateurSansMotDePasse;
}

/**
 * Met à jour le mot de passe d'un utilisateur à partir de son email
 * (utilisé lors de la réinitialisation de mot de passe).
 */
export async function reinitialiserMotDePasseUtilisateur(
  email: string,
  nouveauMotDePasse: string
) {
  const motDePasseHache = await hacherMotDePasse(nouveauMotDePasse);

  await prisma.utilisateur.update({
    where: { email },
    data: { motDePasse: motDePasseHache },
  });
}