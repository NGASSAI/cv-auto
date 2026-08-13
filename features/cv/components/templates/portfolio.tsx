import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import {
  ProprietesTemplate,
  formaterPeriode,
  classeAlignement,
  tailleResume,
} from "@/features/cv/components/templates/types";
import { obtenirVariableCssPolice } from "@/features/cv/lib/registre-polices";

const TYPES_EN_BADGES = ["LANGUES", "CENTRES_INTERET"];

interface DonneesNiveau {
  niveau?: number;
}

function obtenirNiveau(donneesJson: unknown): number {
  if (!donneesJson || typeof donneesJson !== "object") return 75;
  const donnees = donneesJson as DonneesNiveau;
  return typeof donnees.niveau === "number" ? donnees.niveau : 75;
}

export function TemplatePortfolio({
  informations,
  sections,
  couleurAccent,
  police,
  alignementTexte,
  tailleTexte,
}: ProprietesTemplate) {
  const nomComplet = [informations.prenom, informations.nom].filter(Boolean).join(" ");

  const sectionsVisibles = sections.filter((s) => s.estVisible);
  const sectionCompetences = sectionsVisibles.find((s) => s.type === "COMPETENCES");
  const sectionsBadges = sectionsVisibles.filter((s) => TYPES_EN_BADGES.includes(s.type));
  const sectionsChronologiques = sectionsVisibles.filter(
    (s) => s.type !== "COMPETENCES" && !TYPES_EN_BADGES.includes(s.type)
  );

  return (
    <div
      className="w-full aspect-210/297 overflow-hidden bg-papier text-encre"
      style={{ fontFamily: obtenirVariableCssPolice(police) }}
    >
      {/* En-tête pleine largeur */}
      <header className="flex items-center gap-6 px-10 pt-10 pb-6">
        {informations.photoUrl && (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2" style={{ borderColor: couleurAccent }}>
            <Image src={informations.photoUrl} alt={nomComplet} fill unoptimized className="object-cover" />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-medium leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            {nomComplet || "Votre nom"}
          </h1>
          {informations.titrePoste && (
            <p className="mt-1 text-base font-medium" style={{ color: couleurAccent }}>
              {informations.titrePoste}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ardoise">
            {informations.email && (
              <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {informations.email}</span>
            )}
            {informations.telephone && (
              <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> {informations.telephone}</span>
            )}
            {informations.adresse && (
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {informations.adresse}</span>
            )}
          </div>
        </div>
      </header>

      <div className="px-10 pb-10">
        {informations.resume && (
          <p className={`${tailleResume(tailleTexte)} ${classeAlignement(alignementTexte)} mb-6 leading-relaxed text-ardoise`}>
            {informations.resume}
          </p>
        )}

        {/* Badges (langues, centres d'intérêt) sous l'en-tête */}
        {sectionsBadges.length > 0 && (
          <div className="mb-7 flex flex-col gap-3">
            {sectionsBadges.map((section) => (
              <div key={section.id} className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-semibold uppercase tracking-widest text-ardoise">
                  {section.titre}
                </span>
                {section.items.map((item) => (
                  <span
                    key={item.id}
                    className="rounded-full px-3 py-1 text-sm font-medium"
                    style={{ backgroundColor: `${couleurAccent}18`, color: couleurAccent }}
                  >
                    {item.titre}
                    {section.type === "LANGUES" && item.sousTitre ? ` — ${item.sousTitre}` : ""}
                  </span>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Compétences en grille de cartes avec anneau de niveau */}
        {sectionCompetences && sectionCompetences.items.length > 0 && (
          <div className="mb-8">
            <h2
              className="mb-3 text-base font-semibold uppercase tracking-widest"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {sectionCompetences.titre}
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {sectionCompetences.items.map((item) => {
                const niveau = obtenirNiveau(item.donneesJson);
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-2.5 rounded-lg border border-ardoise/15 p-2.5"
                  >
                    <svg viewBox="0 0 36 36" className="h-8 w-8 shrink-0">
                      <circle cx="18" cy="18" r="15" fill="none" stroke={`${couleurAccent}25`} strokeWidth="4" />
                      <circle
                        cx="18"
                        cy="18"
                        r="15"
                        fill="none"
                        stroke={couleurAccent}
                        strokeWidth="4"
                        strokeDasharray={`${(niveau / 100) * 94.2} 94.2`}
                        strokeLinecap="round"
                        transform="rotate(-90 18 18)"
                      />
                    </svg>
                    <span className="text-sm font-medium leading-tight">{item.titre}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sections chronologiques en timeline avec pastille */}
        <div className="flex flex-col gap-7">
          {sectionsChronologiques.map((section) => (
            <div key={section.id}>
              <h2
                className="mb-4 text-base font-semibold uppercase tracking-widest"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {section.titre}
              </h2>
              <div className="flex flex-col gap-5">
                {section.items.map((item) => (
                  <div key={item.id} className="relative pl-6">
                    <span
                      className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: couleurAccent }}
                    />
                    <span
                      className="absolute left-[4.5px] top-4 bottom-20px w-px"
                      style={{ backgroundColor: `${couleurAccent}30` }}
                    />
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <h3 className="text-base font-semibold">{item.titre}</h3>
                      {(item.dateDebut || item.dateFin) && (
                        <span className="text-sm text-ardoise">
                          {formaterPeriode(item.dateDebut, item.dateFin)}
                        </span>
                      )}
                    </div>
                    {(item.sousTitre || item.lieu) && (
                      <p className="mt-0.5 text-sm text-ardoise">
                        {[item.sousTitre, item.lieu].filter(Boolean).join(" — ")}
                      </p>
                    )}
                    {item.description && (
                      <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-encre/85">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}