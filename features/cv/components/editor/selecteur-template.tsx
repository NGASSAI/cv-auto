"use client";

import { Lock, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useEditeurCVStore } from "@/features/cv/stores/cv-editor.store";
import { listerTemplates } from "@/features/cv/components/templates/registre-templates";

interface SelecteurTemplateProps {
  estPremium: boolean;
}

export function SelecteurTemplate({ estPremium }: SelecteurTemplateProps) {
  const cv = useEditeurCVStore((etat) => etat.cv);
  const changerTemplate = useEditeurCVStore((etat) => etat.changerTemplate);

  if (!cv) return null;

  function gererSelection(cle: string, templateEstPremium: boolean) {
    if (templateEstPremium && !estPremium) {
      toast.error("Ce template est réservé aux comptes Premium");
      return;
    }
    changerTemplate(cle);
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {listerTemplates().map((template) => {
        const selectionne = cv.templateId === template.cle;
        const verrouille = template.estPremium && !estPremium;

        return (
          <button
            key={template.cle}
            type="button"
            onClick={() => gererSelection(template.cle, template.estPremium)}
            className={cn(
              "relative border-2 rounded-lg p-3 text-left transition-colors",
              selectionne ? "border-primary" : "border-border hover:border-muted-foreground",
              verrouille && "opacity-70"
            )}
          >
            {/* Miniature simplifiée du template — un aperçu réel viendrait
                plus tard via une capture, on reste sur un placeholder stylisé pour l'instant */}
            <div className="aspect-210/297 bg-muted rounded mb-2 flex items-center justify-center">
              {verrouille ? (
                <Lock className="w-5 h-5 text-muted-foreground" />
              ) : (
                <span className="text-[10px] font-mono text-muted-foreground">
                  Aperçu
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{template.nom}</span>
              {selectionne && <Check className="w-4 h-4 text-primary" />}
              {verrouille && !selectionne && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  Premium
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}