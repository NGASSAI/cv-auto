import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifierIdentifiants } from "@/features/auth/api/utilisateur.service";
import { schemaConnexion } from "@/features/auth/validators/auth.schema";

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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.motDePasse) {
          return null;
        }

        const resultat = schemaConnexion.safeParse(credentials);

        if (!resultat.success) {
          return null;
        }

        try {
          const utilisateur = await verifierIdentifiants(
            resultat.data.email,
            resultat.data.motDePasse
          );

          if (!utilisateur) {
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