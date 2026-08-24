import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifierIdentifiants } from "@/features/auth/api/utilisateur.service";
import { schemaConnexion } from "@/features/auth/validators/auth.schema";
import { limiteurConnexion } from "@/features/auth/lib/rate-limit";
import { hacherMotDePasse } from "@/features/auth/lib/mot-de-passe";

// Validation des variables d'environnement critiques au démarrage
if (!process.env.NEXTAUTH_SECRET) {
  console.warn("⚠️ ATTENTION: NEXTAUTH_SECRET n'est pas défini. La connexion pourrait échouer en production.");
}

if (!process.env.NEXTAUTH_URL && process.env.NODE_ENV === "production") {
  console.warn("⚠️ ATTENTION: NEXTAUTH_URL n'est pas défini en production. Les cookies pourraient ne pas fonctionner correctement.");
}

if (!process.env.EMAIL_ADMIN && process.env.NODE_ENV === "production") {
  console.warn("⚠️ ATTENTION: EMAIL_ADMIN n'est pas défini en production. Le rôle admin ne pourra pas être attribué automatiquement.");
}

// Hash factice utilisé uniquement pour égaliser le temps de réponse
// (voir le commentaire dans authorize() ci-dessous).
let hashFactice: string | null = null;

export const authOptions: NextAuthOptions = {
  // Configuration JWT simple sans adapter
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },

  pages: {
    signIn: "/connexion",
    error: "/connexion",
  },

  providers: [
    CredentialsProvider({
      name: "Identifiants",
      credentials: {
        email: { label: "Email", type: "email" },
        motDePasse: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.motDePasse) {
          return null;
        }

        const resultat = schemaConnexion.safeParse(credentials);

        if (!resultat.success) {
          return null;
        }

        // Rate limiting combiné IP + email : limite le bruteforce sur
        // un compte précis, sans pénaliser tout un réseau partagé qui
        // se connecterait à des comptes différents.
        const ip = req?.headers?.get?.("x-forwarded-for")?.split(",")[0]?.trim() ?? "ip-inconnue";
        const cle = `${ip}:${resultat.data.email}`;
        const { success: sousLaLimite } = await limiteurConnexion.limit(cle);
        if (!sousLaLimite) {
          throw new Error("TROP_DE_TENTATIVES");
        }

        try {
          const utilisateur = await verifierIdentifiants(
            resultat.data.email,
            resultat.data.motDePasse
          );

          // Fuite de timing : verifierIdentifiants() retourne vite si
          // l'email n'existe pas (pas de comparaison bcrypt), et plus
          // lentement si l'email existe (comparaison bcrypt réelle).
          // Ça permettrait de deviner quels emails ont un compte en
          // mesurant le temps de réponse. On égalise en faisant une
          // comparaison bcrypt factice dans tous les cas où elle
          // n'aurait pas eu lieu naturellement.
          if (!utilisateur) {
            if (!hashFactice) {
              hashFactice = await hacherMotDePasse("mot-de-passe-factice-pour-timing");
            }
            await import("@/features/auth/lib/mot-de-passe").then(({ verifierMotDePasse }) =>
              verifierMotDePasse(resultat.data.motDePasse, hashFactice!)
            );
            return null;
          }

          // NextAuth exige un champ "id" de type string sur l'objet retourné
          return {
            id: utilisateur.id,
            name: utilisateur.nom,
            email: utilisateur.email,
            role: utilisateur.role,
          };
        } catch (error) {
          if (error instanceof Error && error.message === "TROP_DE_TENTATIVES") {
            throw error;
          }
          console.error("Erreur dans authorize:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    // Ajoute l'id et le rôle dans le token JWT lors de la connexion
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // Propage l'id et le rôle depuis le token vers l'objet session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    // Redirection simplifiée
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return url;
      }
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl + "/dashboard";
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};