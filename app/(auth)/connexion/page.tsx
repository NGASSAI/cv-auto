import type { Metadata } from "next";
import Link from "next/link";
import { PanneauBranding } from "@/features/auth/components/panneau-branding";
import { FormulaireConnexion } from "@/features/auth/components/formulaire-connexion";

export const metadata: Metadata = {
  title: "Connexion — CV Builder",
  description: "Connectez-vous à votre compte CV Builder",
};

export default function PageConnexion() {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <PanneauBranding numeroDossier="0042" />

      <div className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-sm mx-auto">
          <Link
            href="/"
            className="font-display text-xl italic text-secondary mb-10 inline-block md:hidden"
          >
            CV Builder
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-medium">
              Bon retour
            </h1>
            <p className="text-muted-foreground mt-2">
              Connectez-vous pour continuer votre dossier
            </p>
          </div>

          <FormulaireConnexion />
        </div>
      </div>
    </div>
  );
}