"use client";

import { Trash2, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useEditeurCVStore, type ItemSectionEditeur } from "@/features/cv/stores/cv-editor.store";

interface FormulaireItemProps {
  sectionId: string;
  item: ItemSectionEditeur;
  poigneeDragProps?: React.HTMLAttributes<HTMLButtonElement>;
}

export function FormulaireItem({
  sectionId,
  item,
  poigneeDragProps,
}: FormulaireItemProps) {
  const mettreAJourItem = useEditeurCVStore((etat) => etat.mettreAJourItem);
  const supprimerItem = useEditeurCVStore((etat) => etat.supprimerItem);

  const enCours = item.dateFin === null && item.dateDebut !== null;

  function gererChangement(champ: keyof ItemSectionEditeur, valeur: unknown) {
    mettreAJourItem(sectionId, item.id, { [champ]: valeur });
  }

  return (
    <div className="border border-border rounded-lg p-3 space-y-3 bg-background">
      <div className="flex items-start gap-2">
        <button
          type="button"
          className="mt-2 text-muted-foreground cursor-grab active:cursor-grabbing touch-none"
          {...poigneeDragProps}
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className="flex-1 grid grid-cols-2 gap-2">
          <Input
            placeholder="Titre (ex: Développeur Frontend)"
            value={item.titre ?? ""}
            onChange={(e) => gererChangement("titre", e.target.value)}
            className="col-span-2"
          />
          <Input
            placeholder="Entreprise / École"
            value={item.sousTitre ?? ""}
            onChange={(e) => gererChangement("sousTitre", e.target.value)}
          />
          <Input
            placeholder="Lieu"
            value={item.lieu ?? ""}
            onChange={(e) => gererChangement("lieu", e.target.value)}
          />
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => supprimerItem(sectionId, item.id)}
        >
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      </div>

      <div className="pl-6 space-y-3">
        <div className="grid grid-cols-2 gap-2 items-end">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Début</Label>
            <Input
              type="month"
              value={item.dateDebut?.slice(0, 7) ?? ""}
              onChange={(e) =>
                gererChangement(
                  "dateDebut",
                  e.target.value ? `${e.target.value}-01T00:00:00.000Z` : null
                )
              }
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Fin</Label>
            <Input
              type="month"
              disabled={enCours}
              value={item.dateFin?.slice(0, 7) ?? ""}
              onChange={(e) =>
                gererChangement(
                  "dateFin",
                  e.target.value ? `${e.target.value}-01T00:00:00.000Z` : null
                )
              }
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id={`en-cours-${item.id}`}
            checked={enCours}
            onCheckedChange={(coche) =>
              gererChangement("dateFin", coche ? null : new Date().toISOString())
            }
          />
          <Label htmlFor={`en-cours-${item.id}`} className="text-xs font-normal">
            En cours actuellement
          </Label>
        </div>

        <Textarea
          placeholder="Description des missions, réalisations..."
          rows={3}
          value={item.description ?? ""}
          onChange={(e) => gererChangement("description", e.target.value)}
        />
      </div>
    </div>
  );
}