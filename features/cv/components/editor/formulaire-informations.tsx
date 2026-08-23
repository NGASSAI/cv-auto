"use client";

import { useEditeurCVStore } from "@/features/cv/stores/cv-editor.store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadPhoto } from "@/features/cv/components/editor/upload-photo";
import { SuggestionsIA } from "@/features/cv/components/editor/suggestions-ia";

const CHAMPS_SIMPLES: {
  cle: "prenom" | "nom" | "titrePoste" | "email" | "telephone" | "adresse";
  label: string;
  placeholder: string;
  type?: string;
}[] = [
  { cle: "prenom", label: "Prénom", placeholder: "Nathan" },
  { cle: "nom", label: "Nom", placeholder: "Nkosi" },
  { cle: "titrePoste", label: "Titre du poste", placeholder: "Cheffe de Projet" },
  { cle: "email", label: "Email", placeholder: "vous@exemple.com", type: "email" },
  { cle: "telephone", label: "Téléphone", placeholder: "+242 06 000 00 00" },
  { cle: "adresse", label: "Adresse", placeholder: "Brazzaville, Congo" },
];

export function FormulaireInformations({ estPremium, estSuggestionsIA }: { estPremium: boolean; estSuggestionsIA: boolean }) {
  const cv = useEditeurCVStore((etat) => etat.cv);
  const mettreAJourInformations = useEditeurCVStore(
    (etat) => etat.mettreAJourInformations
  );
  const ajouterCompetences = useEditeurCVStore((etat) => etat.ajouterCompetences);

  if (!cv) return null;

  return (
   <div className="space-y-4">
      {estSuggestionsIA && (
        <div className="flex justify-end">
          <SuggestionsIA
            titrePoste={cv.informations.titrePoste}
            informations={cv.informations}
            onResumeChange={(resume) => mettreAJourInformations("resume", resume)}
            onCompetencesChange={(competences) => ajouterCompetences(competences)}
          />
        </div>
      )}
      {estPremium && <UploadPhoto />}
      <div className="grid grid-cols-2 gap-3">
        {CHAMPS_SIMPLES.map((champ) => (
          <div
            key={champ.cle}
            className={
              champ.cle === "email" || champ.cle === "adresse"
                ? "col-span-2 space-y-1.5"
                : "space-y-1.5"
            }
          >
            <Label htmlFor={champ.cle} className="text-xs">
              {champ.label}
            </Label>
            <Input
              id={champ.cle}
              type={champ.type ?? "text"}
              placeholder={champ.placeholder}
              value={cv.informations[champ.cle] ?? ""}
              onChange={(e) =>
                mettreAJourInformations(champ.cle, e.target.value)
              }
            />
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="resume" className="text-xs">
          Résumé professionnel
        </Label>
        <Textarea
          id="resume"
          placeholder="Une courte présentation de votre profil et de vos objectifs..."
          rows={4}
          value={cv.informations.resume ?? ""}
          onChange={(e) => mettreAJourInformations("resume", e.target.value)}
          className="resize-none overflow-hidden"
          style={{ wordWrap: "break-word", overflowWrap: "break-word" }}
        />
      </div>
    </div>
  );
}