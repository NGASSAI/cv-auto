"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Download, Loader2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  useEditeurCVStore,
  type CVEditeur,
} from "@/features/cv/stores/cv-editor.store";
import { PanneauEdition } from "@/features/cv/components/editor/panneau-edition";
import { ApercuLive } from "@/features/cv/components/editor/apercu-live";
import { PanneauDesign } from "@/features/cv/components/editor/panneau-design";
import { IndicateurSauvegarde } from "@/features/cv/components/editor/indicateur-sauvegarde";
import { BoutonAideEditeur } from "@/features/cv/components/editor/bouton-aide-editeur";

interface EditeurCVProps {
  cvInitial: CVEditeur;
  estPremium: boolean;
  estSuggestionsIA: boolean;
}

export function EditeurCV({ cvInitial, estPremium, estSuggestionsIA }: EditeurCVProps) {
  const cv = useEditeurCVStore((etat) => etat.cv);
  const initialiser = useEditeurCVStore((etat) => etat.initialiser);
  const mettreAJourTitreCV = useEditeurCVStore((etat) => etat.mettreAJourTitreCV);
  const [telechargementEnCours, setTelechargementEnCours] = useState(false);
  useEffect(() => {
    initialiser(cvInitial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!cv) return null;
  async function gererTelechargement() {
    if (!cv) return;
    setTelechargementEnCours(true);

    try {
      const reponse = await fetch(`/api/cv/${cv.id}/export`);

      if (!reponse.ok) {
        const donnees = await reponse.json();
        toast.error(donnees.erreur ?? "Impossible de télécharger le CV");
        return;
      }

      const blob = await reponse.blob();
      const url = window.URL.createObjectURL(blob);
      const lien = document.createElement("a");
      lien.href = url;
      lien.download = `${cv?.titre ?? "cv"}.pdf`;
      document.body.appendChild(lien);
      lien.click();
      document.body.removeChild(lien);
      window.URL.revokeObjectURL(url);
      toast.success("PDF téléchargé avec succès");
    } catch {
      toast.error("Une erreur est survenue lors du téléchargement");
    } finally {
      setTelechargementEnCours(false);
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col overflow-hidden">
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-sm shrink-0">
        <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Link 
              href="/dashboard" 
              className="group flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-all duration-200 shrink-0"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  CV
                </span>
              </div>
              <Input
                value={cv.titre}
                onChange={(e) => mettreAJourTitreCV(e.target.value)}
                className="h-10 border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/10 text-base font-semibold rounded-xl transition-all duration-200 max-w-full sm:max-w-md"
                placeholder="Titre du CV"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <IndicateurSauvegarde />
            <BoutonAideEditeur />
            <PanneauDesign estPremium={estPremium} />
            <Button
              variant="default"
              size="sm"
              onClick={gererTelechargement}
              disabled={telechargementEnCours}
              className="rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:from-slate-800 hover:to-slate-700 shadow-lg shadow-slate-900/20 transition-all duration-200 hover:shadow-xl hover:shadow-slate-900/30 hover:-translate-y-0.5"
            >
              {telechargementEnCours ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span className="hidden sm:inline font-medium">Télécharger PDF</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="hidden lg:flex flex-1 min-h-0 p-6 gap-6">
        <div className="w-[440px] shrink-0 overflow-y-auto rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 p-6">
          <PanneauEdition estPremium={estPremium} estSuggestionsIA={estSuggestionsIA} />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mx-auto w-full max-w-[960px] rounded-[32px] border border-slate-200/60 bg-white/80 backdrop-blur-xl p-4 shadow-2xl shadow-slate-200/40">
            <ApercuLive />
          </div>
        </div>
      </div>

      <Tabs defaultValue="editer" className="flex-1 min-h-0 flex flex-col lg:hidden">
        <TabsList className="w-full rounded-none border-b border-slate-200/60 h-14 shrink-0 bg-white/80 backdrop-blur-xl">
          <TabsTrigger value="editer" className="flex-1 data-[state=active]:bg-slate-100/50 rounded-none h-full font-medium">Éditer</TabsTrigger>
          <TabsTrigger value="apercu" className="flex-1 data-[state=active]:bg-slate-100/50 rounded-none h-full font-medium">Aperçu</TabsTrigger>
        </TabsList>

        <TabsContent value="editer" className="flex-1 min-h-0 overflow-y-auto p-4 mt-0">
          <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-xl p-5">
            <PanneauEdition estPremium={estPremium} estSuggestionsIA={estSuggestionsIA} />
          </div>
        </TabsContent>

        <TabsContent value="apercu" className="flex-1 min-h-0 overflow-y-auto p-4 bg-gradient-to-br from-slate-50 via-white to-slate-100 mt-0">
          <div className="mx-auto w-full max-w-[720px] rounded-[32px] border border-slate-200/60 bg-white/80 backdrop-blur-xl p-4 shadow-xl">
            <ApercuLive />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
