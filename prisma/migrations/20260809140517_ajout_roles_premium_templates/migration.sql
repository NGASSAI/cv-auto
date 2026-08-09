-- CreateEnum
CREATE TYPE "Role" AS ENUM ('UTILISATEUR', 'ADMIN');

-- CreateEnum
CREATE TYPE "StatutDemande" AS ENUM ('EN_ATTENTE', 'APPROUVEE', 'REFUSEE');

-- AlterTable
ALTER TABLE "utilisateurs" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'UTILISATEUR';

-- CreateTable
CREATE TABLE "demandes_premium" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "statut" "StatutDemande" NOT NULL DEFAULT 'EN_ATTENTE',
    "message" TEXT,
    "noteAdmin" TEXT,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "traiteLe" TIMESTAMP(3),

    CONSTRAINT "demandes_premium_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "templates" (
    "id" TEXT NOT NULL,
    "cle" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "estPremium" BOOLEAN NOT NULL DEFAULT false,
    "estActif" BOOLEAN NOT NULL DEFAULT true,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "apercuUrl" TEXT,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "demandes_premium_utilisateurId_idx" ON "demandes_premium"("utilisateurId");

-- CreateIndex
CREATE INDEX "demandes_premium_statut_idx" ON "demandes_premium"("statut");

-- CreateIndex
CREATE UNIQUE INDEX "templates_cle_key" ON "templates"("cle");

-- AddForeignKey
ALTER TABLE "demandes_premium" ADD CONSTRAINT "demandes_premium_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
