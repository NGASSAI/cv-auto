/**
 * Registre des polices pour la génération PDF (@react-pdf/renderer).
 *
 * IMPORTANT : @react-pdf/renderer ne comprend pas les variables CSS
 * (var(--font-xxx)) utilisées côté web par next/font/google. Il a besoin
 * de vrais fichiers .ttf enregistrés via Font.register().
 *
 * On utilise ici les paquets @fontsource/*, qui livrent les fichiers .ttf
 * directement dans node_modules. Ça évite tout appel réseau à la volée
 * (contrairement à un fetch direct vers fonts.gstatic.com), ce qui est
 * plus fiable en environnement serverless (Vercel) : pas de risque de
 * timeout ou d'échec silencieux au cold start.
 */

import path from "node:path";
import { Font } from "@react-pdf/renderer";

interface DefinitionPolice {
  paquet: string;
  base: string;
}

const REPERTOIRE_POLICES: Record<string, DefinitionPolice> = {
  fraunces: { paquet: "fraunces", base: "fraunces-latin" },
  geist: { paquet: "geist-sans", base: "geist-sans-latin" },
  merriweather: { paquet: "merriweather", base: "merriweather-latin" },
  playfair: { paquet: "playfair-display", base: "playfair-display-latin" },
  manrope: { paquet: "manrope", base: "manrope-latin" },
  lora: { paquet: "lora", base: "lora-latin" },
};

const FAMILLES_PDF: Record<string, string> = {
  fraunces: "Fraunces-PDF",
  geist: "Geist-PDF",
  merriweather: "Merriweather-PDF",
  playfair: "PlayfairDisplay-PDF",
  manrope: "Manrope-PDF",
  lora: "Lora-PDF",
};

let policesDejaEnregistrees = false;

function cheminFichierPolice(
  paquet: string,
  base: string,
  poids: number,
  style: "normal" | "italic"
): string {
  return path.join(
    process.cwd(),
    "node_modules",
    "@fontsource",
    paquet,
    "files",
    `${base}-${poids}-${style}.ttf`
  );
}

export function enregistrerPolicesPdf(): void {
  if (policesDejaEnregistrees) return;

  for (const [cle, { paquet, base }] of Object.entries(REPERTOIRE_POLICES)) {
    const famille = FAMILLES_PDF[cle];
    try {
      Font.register({
        family: famille,
        fonts: [
          { src: cheminFichierPolice(paquet, base, 400, "normal"), fontWeight: 400, fontStyle: "normal" },
          { src: cheminFichierPolice(paquet, base, 700, "normal"), fontWeight: 700, fontStyle: "normal" },
          { src: cheminFichierPolice(paquet, base, 400, "italic"), fontWeight: 400, fontStyle: "italic" },
        ],
      });
    } catch (erreur) {
      console.error(`Échec de l'enregistrement de la police PDF "${cle}" :`, erreur);
    }
  }

  policesDejaEnregistrees = true;
}

export function obtenirFamillePolicePdf(cle: string | null | undefined): string {
  if (!cle) return "Helvetica";
  return FAMILLES_PDF[cle] ?? "Helvetica";
}