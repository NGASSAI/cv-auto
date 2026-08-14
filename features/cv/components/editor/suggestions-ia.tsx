"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Sparkles, RefreshCw, Copy, Check, X, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface SuggestionsIAProps {
  titrePoste: string | null;
  informations: {
    prenom: string | null;
    nom: string | null;
    titrePoste: string | null;
  };
  onResumeChange: (resume: string) => void;
  onCompetencesChange: (competences: string[]) => void;
}

export function SuggestionsIA({ titrePoste, informations, onResumeChange, onCompetencesChange }: SuggestionsIAProps) {
  const [dialogueOuvert, setDialogueOuvert] = useState(false);
  const [generationEnCours, setGenerationEnCours] = useState(false);
  const [suggestionsCompetences, setSuggestionsCompetences] = useState<string[]>([]);
  const [suggestionsResume, setSuggestionsResume] = useState<string>("");
  const [resumeCopie, setResumeCopie] = useState(false);

  async function genererSuggestions() {
    if (!titrePoste) {
      toast.error("Veuillez d'abord renseigner votre titre de poste");
      return;
    }

    setGenerationEnCours(true);

    try {
      const reponseCompetences = await fetch("/api/suggestions-ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "competences", titrePoste }),
      });

      if (reponseCompetences.ok) {
        const donneesCompetences = await reponseCompetences.json();
        setSuggestionsCompetences(donneesCompetences.competences || []);
      }

      const reponseResume = await fetch("/api/suggestions-ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resume", informations }),
      });

      if (reponseResume.ok) {
        const donneesResume = await reponseResume.json();
        setSuggestionsResume(donneesResume.resume || "");
      }

      toast.success("Suggestions générées avec succès");
    } catch {
      toast.error("Erreur lors de la génération des suggestions");
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

  function ajouterCompetence(competence: string) {
    const nouvellesCompetences = [...suggestionsCompetences, competence];
    setSuggestionsCompetences(nouvellesCompetences);
    onCompetencesChange(nouvellesCompetences);
    toast.success(`"${competence}" ajoutée aux compétences`);
  }
  
  function appliquerCompetences() {
    if (suggestionsCompetences.length > 0) {
      onCompetencesChange(suggestionsCompetences);
      toast.success(`${suggestionsCompetences.length} compétences appliquées`);
    }
  }

  const modalContent = dialogueOuvert && (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-6">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-md"
        onClick={() => setDialogueOuvert(false)}
      />
      
      <div className="relative z-[1000000] w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Assistant IA</h2>
                <p className="text-sm text-white/80">Suggestions pour votre CV</p>
              </div>
            </div>
            <button
              onClick={() => setDialogueOuvert(false)}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {!suggestionsCompetences.length && !suggestionsResume ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Générer des suggestions</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                L'IA analysera votre titre de poste pour vous suggérer des compétences et un résumé professionnel
              </p>
              <Button
                onClick={genererSuggestions}
                disabled={generationEnCours || !titrePoste}
                className="bg-primary hover:bg-primary/90"
              >
                {generationEnCours ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Génération...
                  </>
                ) : (
                  "Générer les suggestions"
                )}
              </Button>
            </div>
          ) : (
            <>
              {suggestionsCompetences.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Compétences suggérées</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {suggestionsCompetences.map((competence, index) => (
                      <button
                        key={`${competence}-${index}`}
                        onClick={() => ajouterCompetence(competence)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-primary hover:text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        {competence}
                      </button>
                    ))}
                  </div>
                  <Button
                    onClick={appliquerCompetences}
                    size="sm"
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Appliquer toutes les compétences
                  </Button>
                </div>
              )}

              {suggestionsResume && (
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Résumé professionnel</h3>
                  <Textarea
                    value={suggestionsResume}
                    readOnly
                    rows={6}
                    className="bg-slate-50 border-slate-200 resize-none mb-4 text-sm"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={copierResume}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      {resumeCopie ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copié
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copier
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={appliquerResume}
                      size="sm"
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      Appliquer
                    </Button>
                  </div>
                </div>
              )}

              <Button
                onClick={genererSuggestions}
                disabled={generationEnCours}
                variant="outline"
                className="w-full mt-6"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${generationEnCours ? 'animate-spin' : ''}`} />
                Régénérer
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Button 
        variant="outline" 
        className="gap-2 border-dashed hover:border-solid transition-all duration-200"
        onClick={() => setDialogueOuvert(true)}
      >
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="hidden sm:inline">Suggestions IA</span>
        <span className="sm:hidden">IA</span>
      </Button>
      {modalContent && createPortal(modalContent, document.body)}
    </>
  );
}
