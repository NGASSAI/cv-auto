"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { HelpCircle, X, ArrowRight, ChevronRight, Layout, Type, Palette, Download, Sparkles, Plus, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";

type EtapeAide = {
  id: number;
  titre: string;
  description: string;
  icone: React.ReactNode;
};

const ETAPES_AIDE: EtapeAide[] = [
  {
    id: 1,
    titre: "Informations personnelles",
    description: "Commencez par remplir vos informations de base : nom, prénom, titre du poste, email, téléphone et adresse. Vous pouvez également ajouter une photo de profil.",
    icone: <Edit3 className="w-6 h-6" />
  },
  {
    id: 2,
    titre: "Ajouter des sections",
    description: "Cliquez sur le bouton '+' pour ajouter des sections à votre CV : Expérience professionnelle, Formation, Compétences, Langues, Centres d'intérêt, etc.",
    icone: <Plus className="w-6 h-6" />
  },
  {
    id: 3,
    titre: "Remplir les sections",
    description: "Pour chaque section, ajoutez des éléments en cliquant sur 'Ajouter'. Remplissez les champs comme le titre, la date, le lieu et la description.",
    icone: <Layout className="w-6 h-6" />
  },
  {
    id: 4,
    titre: "Personnaliser le design",
    description: "Utilisez le bouton 'Design' pour choisir un template, une couleur d'accent, une police et la mise en forme du texte. Les changements sont appliqués en temps réel.",
    icone: <Palette className="w-6 h-6" />
  },
  {
    id: 5,
    titre: "Suggestions IA",
    description: "Activez les suggestions IA pour obtenir des recommandations de compétences et un résumé professionnel basés sur votre titre de poste.",
    icone: <Sparkles className="w-6 h-6" />
  },
  {
    id: 6,
    titre: "Télécharger le PDF",
    description: "Une fois satisfait de votre CV, cliquez sur 'Télécharger PDF' pour générer et télécharger votre CV au format PDF.",
    icone: <Download className="w-6 h-6" />
  }
];

export function BoutonAideEditeur() {
  const [ouvert, setOuvert] = useState(false);
  const [etapeActuelle, setEtapeActuelle] = useState(0);

  const etapeSuivante = () => {
    if (etapeActuelle < ETAPES_AIDE.length - 1) {
      setEtapeActuelle(etapeActuelle + 1);
    }
  };

  const etapePrecedente = () => {
    if (etapeActuelle > 0) {
      setEtapeActuelle(etapeActuelle - 1);
    }
  };

  const modalContent = ouvert && (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-6">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-md"
        onClick={() => setOuvert(false)}
      />
      
      <div className="relative z-[1000000] w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Guide de l'éditeur</h2>
                <p className="text-sm text-white/80">Comment créer votre CV</p>
              </div>
            </div>
            <button
              onClick={() => setOuvert(false)}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            {ETAPES_AIDE.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full flex-1 transition-colors ${
                  index <= etapeActuelle ? "bg-primary" : "bg-slate-200"
                }`}
              />
            ))}
          </div>

          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 text-primary">
              {ETAPES_AIDE[etapeActuelle].icone}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">{ETAPES_AIDE[etapeActuelle].titre}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {ETAPES_AIDE[etapeActuelle].description}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button
              onClick={etapePrecedente}
              variant="outline"
              disabled={etapeActuelle === 0}
              className="flex-1 mr-2"
            >
              Précédent
            </Button>
            <div className="text-sm text-muted-foreground px-4">
              {etapeActuelle + 1} / {ETAPES_AIDE.length}
            </div>
            <Button
              onClick={etapeActuelle === ETAPES_AIDE.length - 1 ? () => setOuvert(false) : etapeSuivante}
              className="flex-1 ml-2 bg-primary hover:bg-primary/90"
            >
              {etapeActuelle === ETAPES_AIDE.length - 1 ? (
                "Compris"
              ) : (
                <>
                  Suivant
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setOuvert(true)}
        className="gap-2"
      >
        <HelpCircle className="w-4 h-4" />
        <span className="hidden sm:inline">Aide</span>
      </Button>
      {modalContent && createPortal(modalContent, document.body)}
    </>
  );
}
