export interface ItemCVAffichage {
  id: string;
  titre: string | null;
  sousTitre: string | null;
  lieu: string | null;
  dateDebut: string | null;
  dateFin: string | null;
  description: string | null;
  donneesJson: unknown;
}

export interface SectionCVAffichage {
  id: string;
  type: string;
  titre: string;
  estVisible: boolean;
  items: ItemCVAffichage[];
}

export interface InformationsCVAffichage {
  prenom: string | null;
  nom: string | null;
  titrePoste: string | null;
  email: string | null;
  telephone: string | null;
  adresse: string | null;
  photoUrl: string | null;
  resume: string | null;
}

export interface ProprietesTemplate {
  informations: InformationsCVAffichage;
  sections: SectionCVAffichage[];
  couleurAccent: string;
  police: string;
    alignementTexte: string;
  tailleTexte: string;
}

export function formaterPeriode(dateDebut: string | null, dateFin: string | null): string {
  if (!dateDebut) return "";

  const optionsFormat: Intl.DateTimeFormatOptions = { month: "short", year: "numeric" };
  const debut = new Date(dateDebut).toLocaleDateString("fr-FR", optionsFormat);

  if (!dateFin) return `${debut} — Présent`;

  const fin = new Date(dateFin).toLocaleDateString("fr-FR", optionsFormat);
  return `${debut} — ${fin}`;
}
export function classeAlignement(alignement: string): string {
  const correspondances: Record<string, string> = {
    gauche: "text-left",
    centre: "text-center",
    droite: "text-right",
    justifie: "text-justify",
  };
  return correspondances[alignement] ?? "text-left";
}

export function tailleResume(taille: string): string {
  const correspondances: Record<string, string> = {
    petite: "text-base",    // Petit → 16px (augmenté pour lisibilité)
    moyenne: "text-lg",   // Normal → 18px (augmenté pour lisibilité)
    grande: "text-xl",    // Gros → 20px (augmenté pour lisibilité)
  };
  return correspondances[taille] ?? "text-lg";
}