"use client";

import Link from "next/link";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { INFORMATIONS_EXEMPLE, SECTIONS_EXEMPLE } from "@/features/cv/lib/donnees-exemple";

interface ModaleApercuTemplateProps {
  ouvert: boolean;
  onFermer: () => void;
  template: {
    cle: string;
    nom: string;
    composant: React.ComponentType<any>;
    estPremium: boolean;
  };
  couleur?: string;
}

export function ModaleApercuTemplate({
  ouvert,
  onFermer,
  template,
  couleur = "#E8992D",
}: ModaleApercuTemplateProps) {
  const Composant = template.composant;
  const largeurReelle = 800;
  const hauteurReelle = largeurReelle * (297 / 210);
  const echelle = 0.65;

  return (
    <Dialog open={ouvert} onOpenChange={onFermer}>
      <DialogContent className="max-w-5xl w-full max-h-[95vh] overflow-auto p-0 bg-background">
        <DialogClose className="absolute right-4 top-4 z-30 p-2 rounded-full bg-white/95 hover:bg-white shadow-lg transition-all">
          <X className="w-5 h-5" />
        </DialogClose>

        <div className="flex flex-col">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">{template.nom}</h2>
              {template.estPremium && (
                <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-md">
                  Premium
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-center p-6 md:p-10 overflow-auto bg-gradient-to-br from-slate-50 to-slate-100">
            <div 
              className="transform transition-transform duration-500 shadow-2xl rounded-lg overflow-hidden bg-white"
              style={{ 
                width: `${largeurReelle * echelle}px`,
                height: `${hauteurReelle * echelle}px`,
              }}
            >
              <div
                style={{
                  width: largeurReelle,
                  height: hauteurReelle,
                  transform: `scale(${echelle})`,
                  transformOrigin: "top left",
                }}
              >
                <Composant
                  informations={INFORMATIONS_EXEMPLE}
                  sections={SECTIONS_EXEMPLE}
                  couleurAccent={couleur}
                  police="geist"
                  alignementTexte="gauche"
                  tailleTexte="moyenne"
                />
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-t">
            <Link
              href="/inscription"
              className="inline-block w-full md:w-auto bg-slate-900 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-slate-800 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Créer mon CV avec ce modèle
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
