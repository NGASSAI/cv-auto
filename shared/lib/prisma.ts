import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Adapter PostgreSQL requis par Prisma 7 pour se connecter à Neon.
 */
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Singleton du client Prisma.
 * Évite de créer une nouvelle connexion à chaque hot-reload en dev
 * (Next.js recharge les modules à chaque changement de fichier).
 */
const globalPourPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalPourPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalPourPrisma.prisma = prisma;
}