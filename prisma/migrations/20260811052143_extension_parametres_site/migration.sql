-- CreateTable
CREATE TABLE "parametres_site" (
    "id" TEXT NOT NULL DEFAULT 'parametres',
    "modeMaintenance" BOOLEAN NOT NULL DEFAULT false,
    "messageMaintenance" TEXT,
    "numeroWhatsapp" TEXT,
    "titreAccueil" TEXT,
    "descriptionAccueil" TEXT,
    "accrocheAccueil" TEXT,
    "couleurPrimaire" TEXT,
    "couleurSecondaire" TEXT,
    "emailSupport" TEXT,
    "inscriptionActivee" BOOLEAN NOT NULL DEFAULT true,
    "exportPdfActif" BOOLEAN NOT NULL DEFAULT true,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parametres_site_pkey" PRIMARY KEY ("id")
);
