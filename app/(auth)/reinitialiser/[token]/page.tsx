import type { Metadata } from "next";
import Link from "next/link";
import { PanneauBranding } from "@/features/auth/components/panneau-branding";
import { FormulaireReinitialisation } from "@/features/auth/components/formulaire-reinitialisation";

export const metadata: Metadata = {
  title: "Réinitialiser le mot de passe — CV Builder",
};

export default async function PageReinitialisation({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <PanneauBranding numeroDossier="0045" />

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
              Nouveau mot de passe
            </h1>
            <p className="text-muted-foreground mt-2">
              Choisissez un mot de passe sécurisé
            </p>
          </div>

          <FormulaireReinitialisation token={token} />
        </div>
      </div>
    </div>
  );
}