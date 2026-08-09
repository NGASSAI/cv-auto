-- CreateEnum
CREATE TYPE "StatutAbonnement" AS ENUM ('ACTIF', 'EN_ATTENTE', 'ANNULE', 'EXPIRE');

-- CreateEnum
CREATE TYPE "PlanAbonnement" AS ENUM ('GRATUIT', 'MENSUEL', 'ANNUEL');

-- CreateEnum
CREATE TYPE "TypeSection" AS ENUM ('EXPERIENCE', 'FORMATION', 'COMPETENCES', 'LANGUES', 'CENTRES_INTERET', 'CERTIFICATIONS', 'PROJETS', 'PERSONNALISEE');

-- CreateTable
CREATE TABLE "utilisateurs" (
    "id" TEXT NOT NULL,
    "nom" TEXT,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT,
    "emailVerifieLe" TIMESTAMP(3),
    "image" TEXT,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comptes_oauth" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "fournisseur" TEXT NOT NULL,
    "fournisseurCompteId" TEXT NOT NULL,
    "refreshToken" TEXT,
    "accessToken" TEXT,
    "expiresAt" INTEGER,
    "tokenType" TEXT,
    "scope" TEXT,
    "idToken" TEXT,

    CONSTRAINT "comptes_oauth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "expire" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "abonnements" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "plan" "PlanAbonnement" NOT NULL DEFAULT 'GRATUIT',
    "statut" "StatutAbonnement" NOT NULL DEFAULT 'ACTIF',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "dateDebut" TIMESTAMP(3),
    "dateFin" TIMESTAMP(3),
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "abonnements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cvs" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "titre" TEXT NOT NULL DEFAULT 'Mon CV',
    "templateId" TEXT NOT NULL DEFAULT 'classique',
    "couleurAccent" TEXT NOT NULL DEFAULT '#2563eb',
    "police" TEXT NOT NULL DEFAULT 'inter',
    "estPublic" BOOLEAN NOT NULL DEFAULT false,
    "slugPublic" TEXT,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cvs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "informations_personnelles" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "prenom" TEXT,
    "nom" TEXT,
    "titrePoste" TEXT,
    "email" TEXT,
    "telephone" TEXT,
    "adresse" TEXT,
    "photoUrl" TEXT,
    "resume" TEXT,

    CONSTRAINT "informations_personnelles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sections" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "type" "TypeSection" NOT NULL,
    "titre" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL,
    "estVisible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items_section" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL,
    "titre" TEXT,
    "sousTitre" TEXT,
    "lieu" TEXT,
    "dateDebut" TIMESTAMP(3),
    "dateFin" TIMESTAMP(3),
    "description" TEXT,
    "donneesJson" JSONB,

    CONSTRAINT "items_section_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_email_key" ON "utilisateurs"("email");

-- CreateIndex
CREATE UNIQUE INDEX "comptes_oauth_fournisseur_fournisseurCompteId_key" ON "comptes_oauth"("fournisseur", "fournisseurCompteId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "abonnements_utilisateurId_key" ON "abonnements"("utilisateurId");

-- CreateIndex
CREATE UNIQUE INDEX "abonnements_stripeCustomerId_key" ON "abonnements"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "abonnements_stripeSubscriptionId_key" ON "abonnements"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "cvs_slugPublic_key" ON "cvs"("slugPublic");

-- CreateIndex
CREATE UNIQUE INDEX "informations_personnelles_cvId_key" ON "informations_personnelles"("cvId");

-- CreateIndex
CREATE INDEX "sections_cvId_idx" ON "sections"("cvId");

-- CreateIndex
CREATE INDEX "items_section_sectionId_idx" ON "items_section"("sectionId");

-- AddForeignKey
ALTER TABLE "comptes_oauth" ADD CONSTRAINT "comptes_oauth_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "abonnements" ADD CONSTRAINT "abonnements_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cvs" ADD CONSTRAINT "cvs_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "informations_personnelles" ADD CONSTRAINT "informations_personnelles_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_section" ADD CONSTRAINT "items_section_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
