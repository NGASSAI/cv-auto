import Image from "next/image";
import {
  ProprietesTemplate,
  formaterPeriode,
  classeAlignement,
  tailleResume,
} from "@/features/cv/components/templates/types";
import { obtenirVariableCssPolice } from "@/features/cv/lib/registre-polices";

const TYPES_EN_BADGES = ["COMPETENCES", "LANGUES", "CENTRES_INTERET"];

export function TemplateExecutif({
  informations,
  sections,
  couleurAccent,
  police,
  alignementTexte,
  tailleTexte,
}: ProprietesTemplate) {
  const nomComplet = [informations.prenom, informations.nom].filter(Boolean).join(" ");

  return (
    <div
      className="relative flex w-full aspect-210/297 overflow-hidden bg-papier text-encre"
      style={{ fontFamily: obtenirVariableCssPolice(police) }}
    >
      {informations.photoUrl && (
        <div className="absolute right-12 top-12 h-16 w-16 overflow-hidden rounded-full border border-ardoise/20">
          <Image src={informations.photoUrl} alt={nomComplet} fill unoptimized className="object-cover" />
        </div>
      )}

      <div className="flex w-full flex-col gap-8 px-16 pb-16 pt-14">
        <header>
          <h1
            className="text-4xl font-medium leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {nomComplet || "Votre nom"}
          </h1>
          {informations.titrePoste && (
            <p className="mt-2 text-base tracking-wide text-ardoise">{informations.titrePoste}</p>
          )}

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ardoise">
            {informations.email && <span>{informations.email}</span>}
            {informations.telephone && <span>{informations.telephone}</span>}
            {informations.adresse && <span>{informations.adresse}</span>}
          </div>
        </header>

        {informations.resume && (
          <p
            className={`${tailleResume(tailleTexte)} ${classeAlignement(alignementTexte)} leading-relaxed text-ardoise`}
          >
            {informations.resume}
          </p>
        )}

        <div className="flex flex-col gap-7">
          {sections
            .filter((s) => s.estVisible)
            .map((section) => (
              <section key={section.id}>
                <h2
                  className="pb-2 text-base font-medium uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-display)", borderBottom: `1px solid ${couleurAccent}` }}
                >
                  {section.titre}
                </h2>

                <div className="mt-4">
                  {TYPES_EN_BADGES.includes(section.type) ? (
                    <div className="flex flex-wrap gap-2">
                      {section.items.map((item) => (
                        <span
                          key={item.id}
                          className="rounded-full px-3 py-1 text-sm font-medium"
                          style={{ backgroundColor: `${couleurAccent}18`, color: couleurAccent }}
                        >
                          {item.titre}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-5">
                      {section.items.map((item) => (
                        <div key={item.id}>
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
                  )}
                </div>
              </section>
            ))}
        </div>
      </div>
    </div>
  );
}