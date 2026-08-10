-- AlterTable
ALTER TABLE "cvs" ADD COLUMN     "alignementTexte" TEXT NOT NULL DEFAULT 'gauche',
ADD COLUMN     "tailleTexte" TEXT NOT NULL DEFAULT 'moyenne';
