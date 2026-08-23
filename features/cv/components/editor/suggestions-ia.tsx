"use client";

import { useState } from "react";
import { Sparkles, RefreshCw, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEditeurCVStore } from "@/features/cv/stores/cv-editor.store";

interface SuggestionsIAProps {
  titrePoste: string | null;
  informations: {
    prenom: string | null;
    nom: string | null;
    titrePoste: string | null;
  };
  onResumeChange: (resume: string) => void;
}

export function SuggestionsIA({ titrePoste, informations, onResumeChange }: SuggestionsIAProps) {
  const [dialogueOuvert, setDialogueOuvert] = useState(false);
  const [generationEnCours, setGenerationEnCours] = useState(false);
  const [suggestionsCompetences, setSuggestionsCompetences] = useState<string[]>([]);
  const [suggestionsResume, setSuggestionsResume] = useState<string>("");
  const [resumeCopie, setResumeCopie] = useState(false);
  const ajouterCompetences = useEditeurCVStore((etat) => etat.ajouterCompetences);

  async function genererSuggestions() {
    if (!titrePoste) {
      toast.error("Veuillez d'abord renseigner votre titre de poste");
      return;
    }

    setGenerationEnCours(true);
    setSuggestionsCompetences([]);
    setSuggestionsResume("");

    try {
      // Récupérer les suggestions de compétences
      const reponseCompetences = await fetch("/api/suggestions-ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "competences", titrePoste }),
      });

      if (!reponseCompetences.ok) {
        const erreur = await reponseCompetences.json();
        throw new Error(erreur.erreur || "Erreur lors de la récupération des compétences");
      }

      const donneesCompetences = await reponseCompetences.json();
      setSuggestionsCompetences(donneesCompetences.competences || []);

      // Générer le résumé
      const reponseResume = await fetch("/api/suggestions-ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resume", informations }),
      });

      if (!reponseResume.ok) {
        const erreur = await reponseResume.json();
        throw new Error(erreur.erreur || "Erreur lors de la génération du résumé");
      }

      const donneesResume = await reponseResume.json();
      setSuggestionsResume(donneesResume.resume || "");

      toast.success("Suggestions générées avec succès");
    } catch (error) {
      console.error("Erreur génération suggestions:", error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de la génération des suggestions");
    } finally {
      setGenerationEnCours(false);
    }
  }

  function appliquerResume() {
    if (suggestionsResume) {
      onResumeChange(suggestionsResume);
      setDialogueOuvert(false);
      toast.success("Résumé appliqué");
    }
  }

  function copierResume() {
    navigator.clipboard.writeText(suggestionsResume);
    setResumeCopie(true);
    toast.success("Résumé copié");
    setTimeout(() => setResumeCopie(false), 2000);
  }

  async function ajouterCompetence(competence: string) {
    try {
      await ajouterCompetences([competence]);
      toast.success(`"${competence}" ajoutée aux compétences`);
    } catch (error) {
      console.error("Erreur ajout compétence:", error);
      toast.error("Erreur lors de l'ajout de la compétence");
    }
  }

  async function ajouterToutesCompetences() {
    try {
      await ajouterCompetences(suggestionsCompetences);
      toast.success(`${suggestionsCompetences.length} compétences ajoutées`);
    } catch (error) {
      console.error("Erreur ajout compétences:", error);
      toast.error("Erreur lors de l'ajout des compétences");
    }
  }

  return (
    <Dialog open={dialogueOuvert} onOpenChange={setDialogueOuvert}>
      <DialogTrigger
        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
      >
        <Sparkles className="w-4 h-4" />
        Suggestions IA
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Suggestions IA
          </DialogTitle>
          <DialogDescription>
            Obtenez des suggestions de compétences et de résumé basées sur votre titre de poste
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Bouton de génération */}
          <button
            onClick={genererSuggestions}
            disabled={generationEnCours || !titrePoste}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md transition-colors hover:opacity-90 disabled:opacity-50"
          >
            {generationEnCours ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Générer des suggestions
              </>
            )}
          </button>

          {/* Suggestions de compétences */}
          {suggestionsCompetences.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Compétences suggérées</h3>
                <button
                  type="button"
                  onClick={ajouterToutesCompetences}
                  className="text-xs text-primary hover:underline"
                >
                  Ajouter toutes
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestionsCompetences.map((competence) => (
                  <button
                    key={competence}
                    type="button"
                    onClick={() => ajouterCompetence(competence)}
                    className="px-3 py-1.5 text-sm border border-border rounded-full hover:bg-primary hover:text-white hover:border-primary transition-colors"
                  >
                    + {competence}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions de résumé */}
          {suggestionsResume && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Résumé suggéré</h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={copierResume}
                    className="inline-flex items-center justify-center h-8 px-3 text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                  >
                    {resumeCopie ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={appliquerResume}
                    className="inline-flex items-center justify-center h-8 px-3 text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                  >
                    Appliquer
                  </button>
                </div>
              </div>
              <Textarea
                value={suggestionsResume}
                readOnly
                rows={4}
                className="bg-muted/50"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
