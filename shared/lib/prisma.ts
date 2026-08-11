import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Le driver serverless de Neon communique via WebSocket plutôt qu'une
// connexion TCP classique : il gère nativement le réveil de la base
// après une mise en veille, contrairement à l'ancien driver pg qui
// provoquait des erreurs P1001 intermittentes en production.
neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const globalPourPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
export const prisma = globalPourPrisma.prisma ?? new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") { globalPourPrisma.prisma = prisma; }