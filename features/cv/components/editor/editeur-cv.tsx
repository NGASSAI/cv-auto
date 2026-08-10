"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
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

interface EditeurCVProps {
  cvInitial: CVEditeur;
  estPremium: boolean;
}

export function EditeurCV({ cvInitial, estPremium }: EditeurCVProps) {
  const cv = useEditeurCVStore((etat) => etat.cv);
  const initialiser = useEditeurCVStore((etat) => etat.initialiser);
  const mettreAJourTitreCV = useEditeurCVStore((etat) => etat.mettreAJourTitreCV);

  useEffect(() => {
    initialiser(cvInitial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!cv) return null;

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <header className="border-b border-border bg-card shrink-0">
        <div className="px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/dashboard" className="text-muted-foreground shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Input
              value={cv.titre}
              onChange={(e) => mettreAJourTitreCV(e.target.value)}
              className="h-8 border-transparent bg-transparent hover:border-input focus-visible:border-input font-medium max-w-160px sm:max-w-xs"
            />
          </div>
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
  <IndicateurSauvegarde />
  <PanneauDesign estPremium={estPremium} />
  <a href={`/api/cv/${cv.id}/export`} download>
    <Button variant="default" size="sm">
      <Download className="w-4 h-4" />
      <span className="hidden sm:inline">Télécharger</span>
    </Button>
  </a>
   </div>
  
        </div>
      </header>

      <div className="hidden lg:flex flex-1 min-h-0">
        <div className="w-440px shrink-0 border-r border-border overflow-y-auto p-6">
          <PanneauEdition  estPremium={estPremium} />
        </div>
        <div className="flex-1 overflow-y-auto p-8 bg-muted/30">
          <ApercuLive />
        </div>
      </div>

      <Tabs defaultValue="editer" className="flex-1 min-h-0 flex flex-col lg:hidden">
        <TabsList className="w-full rounded-none border-b border-border h-11 shrink-0">
          <TabsTrigger value="editer" className="flex-1">Éditer</TabsTrigger>
          <TabsTrigger value="apercu" className="flex-1">Aperçu</TabsTrigger>
        </TabsList>

        <TabsContent value="editer" className="flex-1 min-h-0 overflow-y-auto p-4 mt-0">
          <PanneauEdition estPremium={estPremium} />
        </TabsContent>

        <TabsContent value="apercu" className="flex-1 min-h-0 overflow-y-auto p-4 bg-muted/30 mt-0">
          <ApercuLive />
        </TabsContent>
      </Tabs>
    </div>
  );
}