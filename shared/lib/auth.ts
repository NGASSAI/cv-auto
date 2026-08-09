import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/shared/lib/prisma";
import { verifierIdentifiants } from "@/features/auth/api/utilisateur.service";
import { schemaConnexion } from "@/features/auth/validators/auth.schema";

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
  },

  secret: process.env.NEXTAUTH_SECRET,
};