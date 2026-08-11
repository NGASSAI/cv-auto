import Image from "next/image";
import {
  ProprietesTemplate,
  formaterPeriode,
  classeAlignement,
  tailleResume,
} from "@/features/cv/components/templates/types";
import { obtenirVariableCssPolice } from "@/features/cv/lib/registre-polices";

const TYPES_EN_BADGES = ["COMPETENCES", "LANGUES", "CENTRES_INTERET"];

function numeroSection(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function TemplateDossierStructure({
  informations,
  sections,
  couleurAccent,
  police,
  alignementTexte,
  tailleTexte,
}: ProprietesTemplate) {
  const nomComplet = [informations.prenom, informations.nom].filter(Boolean).join(" ");
  const sectionsVisibles = sections.filter((s) => s.estVisible);

  return (
    <div
      className="w-full aspect-210/297 overflow-hidden bg-papier text-encre px-12 py-12"
      style={{ fontFamily: obtenirVariableCssPolice(police) }}
    >
      {/* Cadre en-tête avec coin corné */}
      <div
        className="relative p-[1.5px]"
        style={{
          clipPath: "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%)",
          backgroundColor: couleurAccent,
        }}
      >
        <div
          className="relative p-6"
          style={{
            clipPath: "polygon(0 0, calc(100% - 26.5px) 0, 100% 26.5px, 100% 100%, 0 100%)",
            backgroundColor: `${couleurAccent}12`,
          }}
        >
          <div
            className="absolute right-0 top-0 h-7 w-7 bg-papier"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
          />
        <div className="flex items-center gap-5">
          {informations.photoUrl && (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded" style={{ border: `2px solid ${couleurAccent}` }}>
              <Image src={informations.photoUrl} alt={nomComplet} fill unoptimized className="object-cover" />
            </div>
          )}
          <div>
            <h1
              className="text-3xl font-medium leading-tight"
              style={{ fontFamily: "var(--font-display)", color: `color-mix(in srgb, ${couleurAccent} 55%, #161B22)` }}
            >
              {nomComplet || "Votre nom"}
            </h1>
            {informations.titrePoste && (
              <p className="mt-1 text-sm font-medium" style={{ color: couleurAccent }}>
                {informations.titrePoste}
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-ardoise">
              {informations.email && <span>{informations.email}</span>}
              {informations.telephone && <span>{informations.telephone}</span>}
              {informations.adresse && <span>{informations.adresse}</span>}
            </div>
          </div>
        </div>
        </div>
      </div>

      <div className="mt-8">
        {informations.resume && (
          <p className={`${tailleResume(tailleTexte)} ${classeAlignement(alignementTexte)} mb-8 leading-relaxed text-ardoise`}>
            {informations.resume}
          </p>
        )}

        <div className="flex flex-col gap-7">
          {sectionsVisibles.map((section, index) => (
            <section key={section.id} className="flex gap-4">
              <span
                className="shrink-0 text-2xl font-medium leading-none"
                style={{ fontFamily: "var(--font-display)", color: `${couleurAccent}` }}
              >
                {numeroSection(index)}
              </span>
              <div className="flex-1 border-l border-ardoise/20 pl-4">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest">
                  {section.titre}
                </h2>

                {TYPES_EN_BADGES.includes(section.type) ? (
                  <div className="flex flex-wrap gap-2">
                    {section.items.map((item) => (
                      <span
                        key={item.id}
                        className="rounded-full px-3 py-1 text-xs font-medium"
                        style={{ backgroundColor: `${couleurAccent}18`, color: couleurAccent }}
                      >
                        {item.titre}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {section.items.map((item) => (
                      <div key={item.id}>
                        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                          <h3 className="text-sm font-semibold">{item.titre}</h3>
                          {(item.dateDebut || item.dateFin) && (
                            <span className="text-xs text-ardoise">
                              {formaterPeriode(item.dateDebut, item.dateFin)}
                            </span>
                          )}
                        </div>
                        {(item.sousTitre || item.lieu) && (
                          <p className="mt-0.5 text-xs text-ardoise">
                            {[item.sousTitre, item.lieu].filter(Boolean).join(" — ")}
                          </p>
                        )}
                        {item.description && (
                          <p className="mt-1.5 whitespace-pre-line text-xs leading-relaxed text-encre/85">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}