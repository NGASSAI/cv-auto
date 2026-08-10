export interface PoliceDisponible {
  cle: string;
  nom: string;
  variableCss: string;
}

export const POLICES_DISPONIBLES: PoliceDisponible[] = [
  { cle: "fraunces", nom: "Fraunces", variableCss: "var(--font-fraunces)" },
  { cle: "geist", nom: "Geist", variableCss: "var(--font-geist-sans)" },
  { cle: "merriweather", nom: "Merriweather", variableCss: "var(--font-merriweather)" },
  { cle: "playfair", nom: "Playfair Display", variableCss: "var(--font-playfair)" },
  { cle: "manrope", nom: "Manrope", variableCss: "var(--font-manrope)" },
  { cle: "lora", nom: "Lora", variableCss: "var(--font-lora)" },
];

export function obtenirVariableCssPolice(cle: string): string {
  return POLICES_DISPONIBLES.find((p) => p.cle === cle)?.variableCss ?? "var(--font-geist-sans)";
}