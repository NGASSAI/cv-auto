"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Palette, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelecteurPolice } from "@/features/cv/components/editor/selecteur-police";
import { SelecteurMiseEnForme } from "@/features/cv/components/editor/selecteur-mise-en-forme";
import { SelecteurTemplate } from "@/features/cv/components/editor/selecteur-template";
import { SelecteurCouleur } from "@/features/cv/components/editor/selecteur-couleur";

interface PanneauDesignProps {
  estPremium: boolean;
}

export function PanneauDesign({ estPremium }: PanneauDesignProps) {
  const [ouvert, setOuvert] = useState(false);

  const modalContent = ouvert && (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-md"
        onClick={() => setOuvert(false)}
      />
      <div className="relative z-[1000000] w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl p-6 text-sm text-popover-foreground max-h-[85vh] overflow-y-auto">
        <button
          type="button"
          onClick={() => setOuvert(false)}
          className="absolute top-2 right-2 p-2 rounded-lg hover:bg-muted transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col gap-2 mb-4">
          <h2 className="font-heading text-base leading-none font-medium">
            Personnaliser le design
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium mb-3">Modèle</p>
            <SelecteurTemplate estPremium={estPremium} />
          </div>

          <div>
            <p className="text-sm font-medium mb-3">Couleur d&apos;accent</p>
            <SelecteurCouleur />
          </div>

          <div>
            <p className="text-sm font-medium mb-3">Police</p>
            <SelecteurPolice estPremium={estPremium} />
          </div>
          <div>
            <p className="text-sm font-medium mb-3">Mise en forme du texte</p>
            <SelecteurMiseEnForme estPremium={estPremium} />
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
      >
        <Palette className="w-4 h-4" />
        Design
      </Button>
      {modalContent && createPortal(modalContent, document.body)}
    </>
  );
}
