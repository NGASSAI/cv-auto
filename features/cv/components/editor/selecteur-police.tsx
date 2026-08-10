"use client";

import { Lock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useEditeurCVStore } from "@/features/cv/stores/cv-editor.store";
import { POLICES_DISPONIBLES } from "@/features/cv/lib/registre-polices";

interface SelecteurPoliceProps {
  estPremium: boolean;
}

export function SelecteurPolice({ estPremium }: SelecteurPoliceProps) {
  const cv = useEditeurCVStore((etat) => etat.cv);
  const changerPolice = useEditeurCVStore((etat) => etat.changerPolice);

  if (!cv) return null;

  function gererSelection(cle: string) {
    if (!estPremium) {
      toast.error("La personnalisation de la police est réservée aux comptes Premium");
      return;
    }
    changerPolice(cle);
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {POLICES_DISPONIBLES.map((police) => {
        const selectionnee = cv.police === police.cle;

        return (
          <button
            key={police.cle}
            type="button"
            onClick={() => gererSelection(police.cle)}
            className={cn(
              "flex items-center justify-between border rounded-lg px-3 py-2.5 text-left transition-colors",
              selectionnee ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground",
              !estPremium && "opacity-60"
            )}
            style={{ fontFamily: police.variableCss }}
          >
            <span className="text-sm">{police.nom}</span>
            {!estPremium && <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}