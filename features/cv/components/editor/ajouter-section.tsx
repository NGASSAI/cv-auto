"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEditeurCVStore } from "@/features/cv/stores/cv-editor.store";

const TYPES_DISPONIBLES: { type: string; label: string }[] = [
  { type: "EXPERIENCE", label: "Expérience professionnelle" },
  { type: "FORMATION", label: "Formation" },
  { type: "COMPETENCES", label: "Compétences" },
  { type: "LANGUES", label: "Langues" },
  { type: "PROJETS", label: "Projets" },
  { type: "CERTIFICATIONS", label: "Certifications" },
  { type: "CENTRES_INTERET", label: "Centres d'intérêt" },
  { type: "PERSONNALISEE", label: "Section personnalisée" },
];

export function AjouterSection() {
  const cv = useEditeurCVStore((etat) => etat.cv);
  const ajouterSection = useEditeurCVStore((etat) => etat.ajouterSection);
  const [enCours, setEnCours] = useState(false);

  if (!cv) return null;

  async function gererAjout(type: string, label: string) {
    setEnCours(true);

    try {
      const reponse = await fetch(`/api/cv/${cv!.id}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, titre: label }),
      });

      const donnees = await reponse.json();

      if (!reponse.ok) {
        toast.error("Impossible d'ajouter la section");
        return;
      }

      ajouterSection({ ...donnees.section, items: [] });
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setEnCours(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button type="button" variant="outline" className="w-full" disabled={enCours}>
            <Plus className="w-4 h-4" />
            Ajouter une section
          </Button>
        }
      />
      <DropdownMenuContent align="start" className="w-64">
        {TYPES_DISPONIBLES.map((option) => (
          <DropdownMenuItem
            key={option.type}
            closeOnClick
            onClick={() => gererAjout(option.type, option.label)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}