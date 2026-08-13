import { Mail, Phone, MapPin } from "lucide-react";
import { ProprietesTemplate, formaterPeriode } from "@/features/cv/components/templates/types";
import { obtenirVariableCssPolice } from "@/features/cv/lib/registre-polices";
import { classeAlignement, tailleResume } from "@/features/cv/components/templates/types";

const TYPES_EN_BADGES = ["COMPETENCES", "LANGUES", "CENTRES_INTERET"];

export function TemplateClassique({ informations, sections, couleurAccent, police, alignementTexte, tailleTexte }: ProprietesTemplate) {
  const nomComplet = [informations.prenom, informations.nom].filter(Boolean).join(" ");

  return (
    <div
      className="bg-white text-[#161B22] w-full aspect-210/297 p-8 pt-8 overflow-hidden"
      style={{ fontFamily: obtenirVariableCssPolice(police) }}
    >
      <header className="text-center pb-4 mb-4" style={{ borderBottom: `2px solid ${couleurAccent}` }}>
        <h1 className="text-4xl font-medium" style={{ fontFamily: "var(--font-display)" }}>
          {nomComplet || "Votre nom"}
        </h1>
        {informations.titrePoste && (
          <p className="text-base uppercase tracking-widest mt-1 text-[#3D4B5C]">
            {informations.titrePoste}
          </p>
        )}
        <div className="flex justify-center gap-4 mt-3 text-sm text-[#3D4B5C] flex-wrap">
          {informations.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-4 h-4" style={{ color: couleurAccent }} />
              {informations.email}
            </span>
          )}
          {informations.telephone && (
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4" style={{ color: couleurAccent }} />
              {informations.telephone}
            </span>
          )}
          {informations.adresse && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" style={{ color: couleurAccent }} />
              {informations.adresse}
            </span>
          )}
        </div>
      </header>

      {informations.resume && (
        <p className={`${tailleResume(tailleTexte)} leading-relaxed ${classeAlignement(alignementTexte)} italic mb-7 text-[#3D4B5C] px-4`}>
          {informations.resume}
        </p>
      )}

      <div className="space-y-4">
        {sections
          .filter((s) => s.estVisible)
          .map((section) => (
            <section key={section.id}>
              <h2
                className="text-sm font-semibold uppercase tracking-widest pb-1.5 mb-3"
                style={{ color: couleurAccent, borderBottom: `1px solid ${couleurAccent}33` }}
              >
                {section.titre}
              </h2>

              {TYPES_EN_BADGES.includes(section.type) ? (
                <div className="flex flex-wrap gap-2">
                  {section.items.map((item) => (
                    <span
                      key={item.id}
                      className="text-sm px-3 py-1 rounded-full font-medium"
                      style={{ backgroundColor: `${couleurAccent}18`, color: couleurAccent }}
                    >
                      {item.titre}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="space-y-3.5">
                  {section.items.map((item) => (
                    <div key={item.id} className="pl-3" style={{ borderLeft: `2px solid ${couleurAccent}40` }}>
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="text-base font-medium">{item.titre}</span>
                        <span className="text-sm text-[#3D4B5C] shrink-0 whitespace-nowrap">
                          {formaterPeriode(item.dateDebut, item.dateFin)}
                        </span>
                      </div>
                      {(item.sousTitre || item.lieu) && (
                        <p className="text-sm text-[#3D4B5C] mt-0.5">
                          {[item.sousTitre, item.lieu].filter(Boolean).join(" — ")}
                        </p>
                      )}
                      {item.description && (
                        <p className="text-sm leading-relaxed mt-1.5 text-[#161B22]/85 whitespace-pre-line">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
      </div>
    </div>
  );
}