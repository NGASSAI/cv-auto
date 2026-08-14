import { obtenirComposantTemplate } from "@/features/cv/components/templates/registre-templates";
import { obtenirCssPourPdf } from "@/features/cv/lib/generateur-html-pdf";
import type { ProprietesTemplate } from "@/features/cv/components/templates/types";
import { createElement } from "react";

export async function genererHtmlPourPdfServer(
  templateId: string,
  proprietes: ProprietesTemplate
): Promise<string> {
  const composantTemplate = obtenirComposantTemplate(templateId);
  const composantReact = createElement(composantTemplate, proprietes);
  
  // Utiliser renderToString avec import dynamique
  const { renderToString } = await import("react-dom/server");
  const htmlContent = renderToString(composantReact);
  
  // Remplacer les imports next/image par des balises img standards dans le HTML généré
  const htmlContentFixed = htmlContent.replace(/<img[^>]*src="[^"]*"[^>]*>/g, (match) => {
    const srcMatch = match.match(/src="([^"]*)"/);
    const altMatch = match.match(/alt="([^"]*)"/);
    const src = srcMatch ? srcMatch[1] : '';
    const alt = altMatch ? altMatch[1] : '';
    return `<img src="${src}" alt="${alt}" style="object-fit: cover;" />`;
  });
  
  const css = obtenirCssPourPdf();
  
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CV</title>
  <style>
    ${css}
  </style>
</head>
<body>
  ${htmlContentFixed}
</body>
</html>
  `.trim();
}
