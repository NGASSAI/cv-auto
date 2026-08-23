"use client";

import { useEditeurCVStore } from "@/features/cv/stores/cv-editor.store";
import { obtenirTemplate } from "@/features/cv/components/templates/registre-templates";

export function ApercuLive() {
  const cv = useEditeurCVStore((etat) => etat.cv);

  if (!cv) return null;

  const template = obtenirTemplate(cv.templateId);
  const ComposantTemplate = template.composant;

  return (
    <div className="w-full min-w-0">
      {/* 
       * Conteneur de prévisualisation.
       *
       * Le CV conserve sa largeur naturelle.
       * Sur les petits écrans, on autorise le scroll horizontal
       * plutôt que de compresser fortement le contenu.
       */}
      <div
        className="
          w-full
          min-w-0
          overflow-x-auto
          overflow-y-visible
          overscroll-x-contain
          pb-6
          [scrollbar-width:thin]
        "
      >
        <div
          className="
            flex
            w-full
            min-w-fit
            justify-center
            px-2
            sm:px-4
          "
        >
          <div
            className="
              w-full
              max-w-[600px]
              min-w-[320px]
              shrink-0
              overflow-hidden
              bg-transparent
              shadow-xl
              sm:min-w-[520px]
            "
          >
            <ComposantTemplate
              informations={cv.informations}
              sections={cv.sections}
              couleurAccent={cv.couleurAccent}
              police={cv.police}
              alignementTexte={cv.alignementTexte}
              tailleTexte={cv.tailleTexte}
            />
          </div>
        </div>
      </div>
    </div>
  );
}