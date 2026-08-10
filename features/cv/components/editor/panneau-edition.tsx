"use client";

import { useEditeurCVStore } from "@/features/cv/stores/cv-editor.store";
import { FormulaireInformations } from "@/features/cv/components/editor/formulaire-informations";
import { ListeSections } from "@/features/cv/components/editor/liste-sections";
import { AjouterSection } from "@/features/cv/components/editor/ajouter-section";

export function PanneauEdition({ estPremium }: { estPremium: boolean }) {
  const cv = useEditeurCVStore((etat) => etat.cv);

  if (!cv) return null;

  return (
    <div className="space-y-8 pb-12">
      <section>
        <h2 className="font-display text-lg font-medium mb-4">
          Informations personnelles
        </h2>
        <FormulaireInformations estPremium={estPremium} />
      </section>

      <section>
        <h2 className="font-display text-lg font-medium mb-4">Sections</h2>
        <ListeSections />
        <div className="mt-3">
          <AjouterSection />
        </div>
      </section>
    </div>
  );
}