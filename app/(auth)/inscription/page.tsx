import type { Metadata } from "next";
import Link from "next/link";
import { PanneauBranding } from "@/features/auth/components/panneau-branding";
import { FormulaireInscription } from "@/features/auth/components/formulaire-inscription";

export const metadata: Metadata = {
  title: "Créer un compte — CV Builder",
  description: "Créez votre compte et commencez votre CV",
};

export default function PageInscription() {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <PanneauBranding numeroDossier="0043" />

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
              Ouvrez votre dossier
            </h1>
            <p className="text-muted-foreground mt-2">
              Quelques minutes suffisent pour un CV qui vous ressemble
            </p>
          </div>

          <FormulaireInscription />
        </div>
      </div>
    </div>
  );
}