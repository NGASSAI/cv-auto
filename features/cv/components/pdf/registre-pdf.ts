import type { ComponentType } from "react";
import { ClassiquePdf } from "@/features/cv/components/pdf/classique.pdf";
import { MinimalistePdf } from "@/features/cv/components/pdf/minimaliste.pdf";
import { ModernePdf } from "@/features/cv/components/pdf/moderne.pdf";
import { ElegantPdf } from "@/features/cv/components/pdf/elegant.pdf";
import type { ProprietesTemplate } from "@/features/cv/components/templates/types";

const REGISTRE_PDF: Record<string, ComponentType<ProprietesTemplate>> = {
  classique: ClassiquePdf,
  minimaliste: MinimalistePdf,
  moderne: ModernePdf,
  elegant: ElegantPdf,
};

export function obtenirComposantPdf(templateId: string): ComponentType<ProprietesTemplate> {
  return REGISTRE_PDF[templateId] ?? REGISTRE_PDF.classique;
}