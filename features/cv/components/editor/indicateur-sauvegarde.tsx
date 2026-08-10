"use client";

import { Check, Loader2, CircleAlert } from "lucide-react";
import { useEditeurCVStore } from "@/features/cv/stores/cv-editor.store";

export function IndicateurSauvegarde() {
  const statut = useEditeurCVStore((etat) => etat.statutSauvegarde);

  if (statut === "inactif") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Check className="w-3.5 h-3.5" />
        Enregistré
      </span>
    );
  }

  if (statut === "en_attente" || statut === "sauvegarde") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        Sauvegarde...
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1.5 text-xs text-destructive">
      <CircleAlert className="w-3.5 h-3.5" />
      Erreur de sauvegarde
    </span>
  );
}