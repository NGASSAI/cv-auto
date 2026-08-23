"use client";

import { useEditeurCVStore } from "@/features/cv/stores/cv-editor.store";
import { FormulaireInformations } from "@/features/cv/components/editor/formulaire-informations";
import { ListeSections } from "@/features/cv/components/editor/liste-sections";
import { AjouterSection } from "@/features/cv/components/editor/ajouter-section";

export function PanneauEdition({ estPremium, estSuggestionsIA }: { estPremium: boolean; estSuggestionsIA: boolean }) {
  const cv = useEditeurCVStore((etat) => etat.cv);

  if (!cv) return null;

  return (
    <div className="space-y-6 pb-8">
      <section>
        <h2 className="font-display text-base font-medium mb-3 text-foreground">
          Informations personnelles
        </h2>
        <FormulaireInformations estPremium={estPremium} estSuggestionsIA={estSuggestionsIA} />
      </section>

      <section>
        <h2 className="font-display text-base font-medium mb-3 text-foreground">Sections</h2>
        <ListeSections />
        <div className="mt-3">
          <AjouterSection />
        </div>
      </section>
    </div>
  );
}