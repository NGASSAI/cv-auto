"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const COULEURS_PRO = [
  { nom: "Safran", valeur: "#E8992D" },
  { nom: "Sceau", valeur: "#2D5A4A" },
  { nom: "Bordeaux", valeur: "#8B3A3A" },
  { nom: "Océan", valeur: "#1E5F8C" },
  { nom: "Prune", valeur: "#6B4C7A" },
  { nom: "Turquoise", valeur: "#1E8C8C" },
  { nom: "Corail", valeur: "#D9603B" },
  { nom: "Bleu roi", valeur: "#2E4C8C" },
  { nom: "Olive", valeur: "#6B7A3A" },
  { nom: "Doré", valeur: "#A8791F" },
  { nom: "Ardoise", valeur: "#3D4B5C" },
  { nom: "Nuit", valeur: "#161B22" },
];

interface PaletteCouleurSiteProps {
  valeur: string;
  onChange: (couleur: string) => void;
}

export function PaletteCouleurSite({ valeur, onChange }: PaletteCouleurSiteProps) {
  const couleurActuelle = COULEURS_PRO.find(
    (c) => c.valeur.toLowerCase() === valeur.toLowerCase()
  );

  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            className="flex items-center gap-2.5 border border-border rounded-lg px-3 py-2 hover:border-muted-foreground transition-colors"
          >
            <span
              className="w-6 h-6 rounded-full shrink-0 border border-black/10"
              style={{ backgroundColor: valeur }}
            />
            <span className="text-sm">{couleurActuelle?.nom ?? valeur}</span>
          </button>
        }
      />
      <PopoverContent className="w-64" align="start">
        <div className="grid grid-cols-6 gap-2">
          {COULEURS_PRO.map((couleur) => {
            const selectionnee = valeur.toLowerCase() === couleur.valeur.toLowerCase();
            return (
              <button
                key={couleur.valeur}
                type="button"
                title={couleur.nom}
                onClick={() => onChange(couleur.valeur)}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110",
                  selectionnee && "ring-2 ring-offset-2 ring-foreground"
                )}
                style={{ backgroundColor: couleur.valeur }}
              >
                {selectionnee && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
          <input
            type="color"
            value={valeur}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-8 rounded border border-border cursor-pointer shrink-0"
          />
          <span className="text-xs text-muted-foreground">Couleur personnalisée</span>
        </div>
      </PopoverContent>
    </Popover>
  );
}