"use client";

import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Lock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useEditeurCVStore } from "@/features/cv/stores/cv-editor.store";

interface SelecteurMiseEnFormeProps {
  estPremium: boolean;
}

const ALIGNEMENTS = [
  { cle: "gauche", icone: AlignLeft, label: "Gauche" },
  { cle: "centre", icone: AlignCenter, label: "Centré" },
  { cle: "droite", icone: AlignRight, label: "Droite" },
  { cle: "justifie", icone: AlignJustify, label: "Justifié" },
];

const TAILLES = [
  { cle: "petite", label: "Petite" },
  { cle: "moyenne", label: "Moyenne" },
  { cle: "grande", label: "Grande" },
];

export function SelecteurMiseEnForme({ estPremium }: SelecteurMiseEnFormeProps) {
  const cv = useEditeurCVStore((etat) => etat.cv);
  const changerAlignement = useEditeurCVStore((etat) => etat.changerAlignement);
  const changerTailleTexte = useEditeurCVStore((etat) => etat.changerTailleTexte);

  if (!cv) return null;

  function verifierPremium(): boolean {
    if (!estPremium) {
      toast.error("Cette option est réservée aux comptes Premium");
      return false;
    }
    return true;
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-muted-foreground mb-2">Alignement du texte</p>
        <div className="flex gap-2">
          {ALIGNEMENTS.map((alignement) => {
            const Icone = alignement.icone;
            const selectionne = cv.alignementTexte === alignement.cle;
            return (
              <button
                key={alignement.cle}
                type="button"
                title={alignement.label}
                onClick={() => verifierPremium() && changerAlignement(alignement.cle)}
                className={cn(
                  "flex-1 flex items-center justify-center border rounded-lg py-2 transition-colors",
                  selectionne ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground",
                  !estPremium && "opacity-60"
                )}
              >
                <Icone className="w-4 h-4" />
              </button>
            );
          })}
          {!estPremium && <Lock className="w-4 h-4 text-muted-foreground self-center ml-1" />}
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-2">Taille du texte</p>
        <div className="flex gap-2">
          {TAILLES.map((taille) => {
            const selectionnee = cv.tailleTexte === taille.cle;
            return (
              <button
                key={taille.cle}
                type="button"
                onClick={() => verifierPremium() && changerTailleTexte(taille.cle)}
                className={cn(
                  "flex-1 text-xs border rounded-lg py-2 transition-colors",
                  selectionnee ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground",
                  !estPremium && "opacity-60"
                )}
              >
                {taille.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}