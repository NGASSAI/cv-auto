"use client";

import { Trash2, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEditeurCVStore, type ItemSectionEditeur } from "@/features/cv/stores/cv-editor.store";

interface FormulaireItemSpecialProps {
  sectionId: string;
  sectionType: string;
  item: ItemSectionEditeur;
  poigneeDragProps?: React.HTMLAttributes<HTMLButtonElement>;
}

export function FormulaireItemSpecial({
  sectionId,
  sectionType,
  item,
  poigneeDragProps,
}: FormulaireItemSpecialProps) {
  const mettreAJourItem = useEditeurCVStore((etat) => etat.mettreAJourItem);
  const supprimerItem = useEditeurCVStore((etat) => etat.supprimerItem);

  function gererChangement(champ: keyof ItemSectionEditeur, valeur: unknown) {
    mettreAJourItem(sectionId, item.id, { [champ]: valeur });
  }

  const placeholderSousTitre = sectionType === "LANGUES" ? "Niveau (ex: Courant, Professionnel)" : "Détail (optionnel)";
  const placeholderTitre = sectionType === "LANGUES" ? "Langue (ex: Français, Anglais)" : "Intérêt (ex: Photographie)";
  const labelTitre = sectionType === "LANGUES" ? "Langue" : "Intérêt";
  const labelSousTitre = sectionType === "LANGUES" ? "Niveau" : "Détail";
  
  // Pour les certifications, on veut afficher la description
  const estCertification = sectionType === "CERTIFICATIONS";
  const montrerDescription = estCertification || sectionType === "PROJETS";

  return (
    <div className="border border-border rounded-lg p-4 space-y-4 bg-background shadow-sm">
      <div className="flex items-start gap-3">
        <button
          type="button"
          className="mt-2 text-muted-foreground cursor-grab active:cursor-grabbing touch-none hover:text-foreground transition-colors"
          {...poigneeDragProps}
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className="flex-1 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor={`titre-${item.id}`} className="text-sm font-medium text-foreground">
              {labelTitre}
            </Label>
            <Input
              id={`titre-${item.id}`}
              placeholder={placeholderTitre}
              value={item.titre ?? ""}
              onChange={(e) => gererChangement("titre", e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`sousTitre-${item.id}`} className="text-sm font-medium text-foreground">
              {labelSousTitre}
            </Label>
            <Input
              id={`sousTitre-${item.id}`}
              placeholder={placeholderSousTitre}
              value={item.sousTitre ?? ""}
              onChange={(e) => gererChangement("sousTitre", e.target.value)}
              className="w-full"
            />
          </div>

          {montrerDescription && (
            <div className="space-y-1.5">
              <Label htmlFor={`description-${item.id}`} className="text-sm font-medium text-foreground">
                Description
              </Label>
              <Textarea
                id={`description-${item.id}`}
                placeholder={estCertification ? "Détails de la certification (organisme, date, etc.)" : "Description du projet"}
                rows={3}
                value={item.description ?? ""}
                onChange={(e) => gererChangement("description", e.target.value)}
                className="w-full"
              />
            </div>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
          onClick={() => supprimerItem(sectionId, item.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
