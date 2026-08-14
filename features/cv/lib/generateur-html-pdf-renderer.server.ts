import type { ProprietesTemplate } from "@/features/cv/components/templates/types";
import { obtenirComposantTemplate } from "@/features/cv/components/templates/registre-templates";
import { obtenirCssPourPdf } from "./generateur-html-pdf";

export function genererHtmlPourPdf(
  templateId: string,
  proprietes: ProprietesTemplate
): { templateId: string; proprietes: ProprietesTemplate; css: string } {
  return {
    templateId,
    proprietes,
    css: obtenirCssPourPdf()
  };
}
