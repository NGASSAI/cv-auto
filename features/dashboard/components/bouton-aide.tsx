"use client";

import { useState } from "react";
import { HelpCircle, ChevronRight, Download, Edit, Home, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ETAPES_AIDE = [
  {
    titre: "Dashboard - Page d'accueil",
    description: "C'est votre espace personnel où vous pouvez voir tous vos CVs créés et créer de nouveaux CVs.",
    icon: Home,
    couleur: "text-primary",
  },
  {
    titre: "Créer un nouveau CV",
    description: "Cliquez sur le bouton 'Créer un CV' en haut à droite du dashboard pour commencer un nouveau CV.",
    icon: Sparkles,
    couleur: "text-secondary",
  },
  {
    titre: "Éditeur de CV",
    description: "Dans l'éditeur, vous pouvez : \n• Ajouter vos informations personnelles\n• Créer des sections (Expérience, Formation, Compétences...)\n• Choisir un template\n• Personnaliser la couleur",
    icon: Edit,
    couleur: "text-primary",
  },
  {
    titre: "Suggestions IA (1000 FCFA+)",
    description: "En mode Premium à partir de 1000 FCFA, utilisez le bouton 'Suggestions IA' pour :\n• Obtenir des suggestions de compétences basées sur votre titre de poste\n• Générer un résumé professionnel personnalisé\n• Copier ou appliquer directement les suggestions",
    icon: Sparkles,
    couleur: "text-secondary",
  },
  {
    titre: "Templates Premium (600 FCFA+)",
    description: "Pour accéder aux templates premium, la photo de profil et les options de personnalisation, cliquez sur 'Passer en Premium' et suivez les instructions. Les fonctionnalités Premium commencent à 600 FCFA.",
    icon: Sparkles,
    couleur: "text-primary",
  },
  {
    titre: "Télécharger en PDF",
    description: "Une fois votre CV terminé, cliquez sur le bouton 'Télécharger PDF' en haut de l'éditeur pour obtenir votre CV prêt à envoyer.",
    icon: Download,
    couleur: "text-secondary",
  },
];

export function BoutonAide() {
  const [dialogueOuvert, setDialogueOuvert] = useState(false);
  const [etapeActive, setEtapeActive] = useState(0);

  const etapeSuivante = () => {
    if (etapeActive < ETAPES_AIDE.length - 1) {
      setEtapeActive(etapeActive + 1);
    }
  };

  const etapePrecedente = () => {
    if (etapeActive > 0) {
      setEtapeActive(etapeActive - 1);
    }
  };

  const etapeCourante = ETAPES_AIDE[etapeActive];
  const Icone = etapeCourante.icon;

  return (
    <Dialog open={dialogueOuvert} onOpenChange={setDialogueOuvert}>
      <DialogTrigger
        className="p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
      >
        <HelpCircle className="w-5 h-5" />
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
         
         <DialogTitle className="flex items-center gap-2">
  <HelpCircle className="w-5 h-5 text-primary" />
  Guide d&apos;utilisation
</DialogTitle>
          <DialogDescription>
            Apprenez à naviguer dans CV Builder et créer votre CV professionnel
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          {/* Indicateur de progression */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {ETAPES_AIDE.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === etapeActive
                      ? "w-8 bg-primary"
                      : index < etapeActive
                      ? "w-2 bg-primary/50"
                      : "w-2 bg-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {etapeActive + 1} / {ETAPES_AIDE.length}
            </span>
          </div>

          {/* Contenu de l'étape */}
          <div className="bg-muted/50 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg bg-background ${etapeCourante.couleur}`}>
                <Icone className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{etapeCourante.titre}</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {etapeCourante.description}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={etapePrecedente}
              disabled={etapeActive === 0}
            >
              Précédent
            </Button>

            {etapeActive === ETAPES_AIDE.length - 1 ? (
              <Button onClick={() => setDialogueOuvert(false)}>
                Compris !
              </Button>
            ) : (
              <Button onClick={etapeSuivante}>
                Suivant
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
