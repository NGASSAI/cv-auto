"use client";

import { useEditeurCVStore } from "@/features/cv/stores/cv-editor.store";
import { obtenirTemplate } from "@/features/cv/components/templates/registre-templates";

export function ApercuLive() {
  const cv = useEditeurCVStore((etat) => etat.cv);

  if (!cv) return null;

  const ComposantTemplate = obtenirTemplate(cv.templateId);

  return (
    <div className="w-full max-w-600px mx-auto shadow-xl">
      <ComposantTemplate
  informations={cv.informations}
  sections={cv.sections}
  couleurAccent={cv.couleurAccent}
  police={cv.police}
  alignementTexte={cv.alignementTexte}
  tailleTexte={cv.tailleTexte}
/>
    </div>
  );
}