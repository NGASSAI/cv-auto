import type { DefaultSession } from "next-auth";

/**
 * Étend les types par défaut de NextAuth pour inclure l'id
 * et le rôle utilisateur dans la session — nécessaire car NextAuth
 * ne les expose pas par défaut pour des raisons de sécurité/vie privée génériques.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}