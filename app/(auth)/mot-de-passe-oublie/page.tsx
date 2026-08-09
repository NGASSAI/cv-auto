import type { Metadata } from "next";
import Link from "next/link";
import { PanneauBranding } from "@/features/auth/components/panneau-branding";
import { FormulaireMotDePasseOublie } from "@/features/auth/components/formulaire-mot-de-passe-oublie";

export const metadata: Metadata = {
  title: "Mot de passe oublié — CV Builder",
  description: "Réinitialisez votre mot de passe",
};

export default function PageMotDePasseOublie() {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <PanneauBranding numeroDossier="0044" />

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
              Mot de passe oublié
            </h1>
            <p className="text-muted-foreground mt-2">
              Indiquez votre email, on vous envoie un lien
            </p>
          </div>

          <FormulaireMotDePasseOublie />
        </div>
      </div>
    </div>
  );
}