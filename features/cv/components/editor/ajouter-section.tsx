"use client";

import { useState } from "react";
import { Plus, Briefcase, GraduationCap, Award, Globe, FolderOpen, Verified, Heart, LayoutTemplate, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useEditeurCVStore } from "@/features/cv/stores/cv-editor.store";

const TYPES_DISPONIBLES: { type: string; label: string; description: string; icon: any }[] = [
  { type: "EXPERIENCE", label: "Expérience professionnelle", description: "Vos emplois et stages", icon: Briefcase },
  { type: "FORMATION", label: "Formation", description: "Diplômes et études", icon: GraduationCap },
  { type: "COMPETENCES", label: "Compétences", description: "Savoir-faire techniques", icon: Award },
  { type: "LANGUES", label: "Langues", description: "Langues parlées", icon: Globe },
  { type: "PROJETS", label: "Projets", description: "Projets personnels ou pro", icon: FolderOpen },
  { type: "CERTIFICATIONS", label: "Certifications", description: "Certifications obtenues", icon: Verified },
  { type: "CENTRES_INTERET", label: "Centres d'intérêt", description: "Loisirs et passions", icon: Heart },
  { type: "PERSONNALISEE", label: "Section personnalisée", description: "Créez votre propre section", icon: LayoutTemplate },
];

export function AjouterSection() {
  const cv = useEditeurCVStore((etat) => etat.cv);
  const ajouterSection = useEditeurCVStore((etat) => etat.ajouterSection);
  const [enCours, setEnCours] = useState(false);
  const [menuOuvert, setMenuOuvert] = useState(false);

  if (!cv) return null;

  async function gererAjout(type: string, label: string) {
    setEnCours(true);
    setMenuOuvert(false);

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
      toast.success(`${label} ajoutée avec succès`);
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setEnCours(false);
    }
  }

  return (
    <div className="relative">
      <Button 
        variant="outline" 
        className="w-full border-dashed hover:border-solid transition-all duration-200 justify-between"
        onClick={() => setMenuOuvert(!menuOuvert)}
        disabled={enCours}
      >
        <span className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Ajouter une section
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${menuOuvert ? 'rotate-180' : ''}`} />
      </Button>

      {menuOuvert && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-background border border-border rounded-lg shadow-lg p-2 w-80">
          <div className="px-2 py-1.5">
            <p className="text-sm font-semibold text-foreground">Choisir une section</p>
            <p className="text-xs text-muted-foreground mt-0.5">Sélectionnez le type de section à ajouter</p>
          </div>
          <div className="my-2 h-px bg-border" />
          {TYPES_DISPONIBLES.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.type}
                onClick={() => gererAjout(option.type, option.label)}
                className="w-full flex flex-col items-start gap-0.5 py-3 px-3 cursor-pointer hover:bg-accent rounded-md transition-colors text-left"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-foreground block">{option.label}</span>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
