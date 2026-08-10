"use client";

import { useState } from "react";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelecteurPolice } from "@/features/cv/components/editor/selecteur-police";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SelecteurTemplate } from "@/features/cv/components/editor/selecteur-template";
import { SelecteurCouleur } from "@/features/cv/components/editor/selecteur-couleur";

interface PanneauDesignProps {
  estPremium: boolean;
}

export function PanneauDesign({ estPremium }: PanneauDesignProps) {
  const [ouvert, setOuvert] = useState(false);

  return (
    <Dialog open={ouvert} onOpenChange={setOuvert}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            <Palette className="w-4 h-4" />
            Design
          </Button>
        }
      />
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Personnaliser le design</DialogTitle>
        </DialogHeader>

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
        </div>
      </DialogContent>
    </Dialog>
  );
}