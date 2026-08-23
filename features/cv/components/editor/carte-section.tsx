"use client";

import { useState } from "react";
import { Plus, Trash2, Eye, EyeOff, GripVertical, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import {
  useEditeurCVStore,
  type SectionEditeur,
} from "@/features/cv/stores/cv-editor.store";
import { FormulaireItem } from "@/features/cv/components/editor/formulaire-item";

interface CarteSectionProps {
  section: SectionEditeur;
  poigneeDragProps?: React.HTMLAttributes<HTMLButtonElement>;
}

export function CarteSection({ section, poigneeDragProps }: CarteSectionProps) {
  const [ouverte, setOuverte] = useState(true);
  const [dialogueOuvert, setDialogueOuvert] = useState(false);

  const mettreAJourTitreSection = useEditeurCVStore(
    (etat) => etat.mettreAJourTitreSection
  );
  const togglerVisibiliteSection = useEditeurCVStore(
    (etat) => etat.togglerVisibiliteSection
  );
  const supprimerSection = useEditeurCVStore((etat) => etat.supprimerSection);
  const ajouterItem = useEditeurCVStore((etat) => etat.ajouterItem);

  async function gererAjoutItem() {
    try {
      const reponse = await fetch(
        `/api/cv/sections/${section.id}/items`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }
      );

      const donnees = await reponse.json();
      if (reponse.ok) {
        ajouterItem(section.id, donnees.item);
      }
    } catch {
      // Erreur réseau silencieuse acceptable ici :
      // l'utilisateur peut simplement réessayer de cliquer sur "Ajouter"
    }
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 p-3 bg-muted/50">
        <button
          type="button"
          className="text-muted-foreground cursor-grab active:cursor-grabbing touch-none"
          {...poigneeDragProps}
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <Input
          value={section.titre}
          onChange={(e) => mettreAJourTitreSection(section.id, e.target.value)}
          className="h-8 font-medium border-transparent bg-transparent hover:border-input focus-visible:border-input px-2"
        />

        <div className="flex items-center gap-0.5 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => togglerVisibiliteSection(section.id)}
            title={section.estVisible ? "Masquer la section" : "Afficher la section"}
          >
            {section.estVisible ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4 text-muted-foreground" />
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setDialogueOuvert(true)}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setOuverte(!ouverte)}
          >
            <ChevronDown
              className={cn("w-4 h-4 transition-transform", !ouverte && "-rotate-90")}
            />
          </Button>
        </div>
      </div>

      {ouverte && (
        <div className="p-3 space-y-2">
          {section.items.map((item) => (
            <FormulaireItem key={item.id} sectionId={section.id} sectionType={section.type} item={item} />
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={gererAjoutItem}
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </Button>
        </div>
      )}

      <AlertDialog open={dialogueOuvert} onOpenChange={setDialogueOuvert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer « {section.titre} » ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette section et tout son contenu seront supprimés définitivement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => supprimerSection(section.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}