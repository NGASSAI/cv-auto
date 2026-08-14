"use client";

import { useEditeurCVStore } from "@/features/cv/stores/cv-editor.store";
import { FormulaireInformations } from "@/features/cv/components/editor/formulaire-informations";
import { ListeSections } from "@/features/cv/components/editor/liste-sections";
import { AjouterSection } from "@/features/cv/components/editor/ajouter-section";

export function PanneauEdition({ estPremium, estSuggestionsIA }: { estPremium: boolean; estSuggestionsIA: boolean }) {
  const cv = useEditeurCVStore((etat) => etat.cv);

  if (!cv) return null;

  return (
    <div className="space-y-5 pb-8">
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Profil</p>
            <h2 className="font-display text-lg font-semibold text-slate-900">
              Informations personnelles
            </h2>
          </div>
        </div>
        <FormulaireInformations estPremium={estPremium} estSuggestionsIA={estSuggestionsIA} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Contenu</p>
          <h2 className="font-display text-lg font-semibold text-slate-900">Sections du CV</h2>
        </div>
        <ListeSections />
        <div className="mt-4 pt-4 border-t border-slate-200">
          <AjouterSection />
        </div>
      </section>
    </div>
  );
}