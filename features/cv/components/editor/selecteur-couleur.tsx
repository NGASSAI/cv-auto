"use client";

import { useEditeurCVStore } from "@/features/cv/stores/cv-editor.store";
import { cn } from "@/lib/utils";

const COULEURS_DISPONIBLES = [
  { nom: "Safran", valeur: "#E8992D" },
  { nom: "Sceau", valeur: "#2D5A4A" },
  { nom: "Bordeaux", valeur: "#8B3A3A" },
  { nom: "Océan", valeur: "#1E5F8C" },
  { nom: "Prune", valeur: "#6B4C7A" },
  { nom: "Turquoise", valeur: "#1E8C8C" },
  { nom: "Corail", valeur: "#D9603B" },
  { nom: "Rose poudré", valeur: "#B85C7A" },
  { nom: "Bleu roi", valeur: "#2E4C8C" },
  { nom: "Olive", valeur: "#6B7A3A" },
  { nom: "Doré", valeur: "#A8791F" },
  { nom: "Ardoise", valeur: "#3D4B5C" },
  { nom: "Nuit", valeur: "#161B22" },
  { nom: "Framboise", valeur: "#A83A5C" },
   { nom: "Blanc", valeur: "#FFFFFF" },
];

export function SelecteurCouleur() {
  const cv = useEditeurCVStore((etat) => etat.cv);
  const changerCouleur = useEditeurCVStore((etat) => etat.changerCouleur);

  if (!cv) return null;

  return (
    <div className="grid grid-cols-7 gap-2.5">
      {COULEURS_DISPONIBLES.map((couleur) => (
        <button
          key={couleur.valeur}
          type="button"
          title={couleur.nom}
          onClick={() => changerCouleur(couleur.valeur)}
         className={cn(
            "w-8 h-8 rounded-full transition-transform hover:scale-110 border border-ardoise/20",
            cv.couleurAccent === couleur.valeur && "ring-2 ring-offset-2 ring-foreground"
          )}
          style={{ backgroundColor: couleur.valeur }}
        />
      ))}
    </div>
  );
}