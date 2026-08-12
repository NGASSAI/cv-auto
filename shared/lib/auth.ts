import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/shared/lib/prisma";
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
  adapter: PrismaAdapter(prisma),

  // JWT plutôt que sessions en base : plus simple à démarrer,
  // pas besoin de gérer le nettoyage des sessions expirées.
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/connexion",
    error: "/connexion",
  },

  // Configuration des cookies sécurisés en production
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  providers: [
    CredentialsProvider({
      name: "Identifiants",
      credentials: {
        email: { label: "Email", type: "email" },
        motDePasse: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const resultat = schemaConnexion.safeParse(credentials);

        if (!resultat.success) {
          return null;
        }

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
    // (accessible ensuite côté client via useSession())
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    // Redirection selon le rôle après connexion
    async redirect({ url, baseUrl }) {
      // Si l'URL est relative, on la retourne telle quelle
      if (url.startsWith("/")) {
        return url;
      }
      // Si l'URL est sur le même domaine, on la retourne
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      // Sinon, on redirige vers le dashboard par défaut
      return baseUrl + "/dashboard";
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};