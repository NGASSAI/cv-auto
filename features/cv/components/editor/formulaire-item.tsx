"use client";

import { Trash2, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useEditeurCVStore, type ItemSectionEditeur, type SectionEditeur } from "@/features/cv/stores/cv-editor.store";

interface FormulaireItemProps {
  sectionId: string;
  sectionType: string;
  item: ItemSectionEditeur;
  poigneeDragProps?: React.HTMLAttributes<HTMLButtonElement>;
}

// Configuration des champs par type de section
const CONFIGURATION_CHAMPS: Record<string, {
  titre: string;
  sousTitre: string;
  lieu: string;
  dates: boolean;
  description: string;
  descriptionLignes: number;
}> = {
  EXPERIENCE: {
    titre: "Poste (ex: Développeur Frontend)",
    sousTitre: "Entreprise",
    lieu: "Lieu",
    dates: true,
    description: "Description des missions, réalisations...",
    descriptionLignes: 4,
  },
  FORMATION: {
    titre: "Diplôme (ex: Master Informatique)",
    sousTitre: "Établissement",
    lieu: "Lieu",
    dates: true,
    description: "Description de la formation...",
    descriptionLignes: 3,
  },
  COMPETENCES: {
    titre: "Compétence (ex: JavaScript)",
    sousTitre: "",
    lieu: "",
    dates: false,
    description: "",
    descriptionLignes: 0,
  },
  LANGUES: {
    titre: "Langue (ex: Anglais)",
    sousTitre: "",
    lieu: "",
    dates: false,
    description: "",
    descriptionLignes: 0,
  },
  PROJETS: {
    titre: "Nom du projet",
    sousTitre: "",
    lieu: "",
    dates: false,
    description: "Description du projet, technologies utilisées...",
    descriptionLignes: 4,
  },
  CERTIFICATIONS: {
    titre: "Certification (ex: AWS Solutions Architect)",
    sousTitre: "Organisme",
    lieu: "",
    dates: true,
    description: "Description de la certification...",
    descriptionLignes: 2,
  },
  CENTRES_INTERET: {
    titre: "Centre d'intérêt (ex: Lecture, Sport)",
    sousTitre: "",
    lieu: "",
    dates: false,
    description: "",
    descriptionLignes: 0,
  },
  PERSONNALISEE: {
    titre: "Titre",
    sousTitre: "Sous-titre",
    lieu: "Lieu",
    dates: true,
    description: "Description...",
    descriptionLignes: 4,
  },
};

export function FormulaireItem({
  sectionId,
  sectionType,
  item,
  poigneeDragProps,
}: FormulaireItemProps) {
  const mettreAJourItem = useEditeurCVStore((etat) => etat.mettreAJourItem);
  const supprimerItem = useEditeurCVStore((etat) => etat.supprimerItem);

  const config = CONFIGURATION_CHAMPS[sectionType] || CONFIGURATION_CHAMPS.PERSONNALISEE;
  const enCours = item.dateFin === null && item.dateDebut !== null;

  function gererChangement(champ: keyof ItemSectionEditeur, valeur: unknown) {
    mettreAJourItem(sectionId, item.id, { [champ]: valeur });
  }

  const afficherDates = config.dates;
  const afficherDescription = config.description !== "";
  const afficherSousTitre = config.sousTitre !== "";
  const afficherLieu = config.lieu !== "";

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
            placeholder={config.titre}
            value={item.titre ?? ""}
            onChange={(e) => gererChangement("titre", e.target.value)}
            className="col-span-2"
          />
          {afficherSousTitre && (
            <Input
              placeholder={config.sousTitre}
              value={item.sousTitre ?? ""}
              onChange={(e) => gererChangement("sousTitre", e.target.value)}
            />
          )}
          {afficherLieu && (
            <Input
              placeholder={config.lieu}
              value={item.lieu ?? ""}
              onChange={(e) => gererChangement("lieu", e.target.value)}
            />
          )}
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

      {afficherDates && (
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
        </div>
      )}

      {afficherDescription && (
        <div className="pl-6">
          <Textarea
            placeholder={config.description}
            rows={config.descriptionLignes}
            value={item.description ?? ""}
            onChange={(e) => gererChangement("description", e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}   