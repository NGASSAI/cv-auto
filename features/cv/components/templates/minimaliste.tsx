import { Mail, Phone, MapPin } from "lucide-react";
import { ProprietesTemplate, formaterPeriode } from "@/features/cv/components/templates/types";
import { obtenirVariableCssPolice } from "@/features/cv/lib/registre-polices";
import { classeAlignement, tailleResume } from "@/features/cv/components/templates/types";

const TYPES_EN_BADGES = ["COMPETENCES", "LANGUES", "CENTRES_INTERET"];

export function TemplateMinimaliste({ informations, sections, couleurAccent, police, alignementTexte, tailleTexte }: ProprietesTemplate) {
  const nomComplet = [informations.prenom, informations.nom].filter(Boolean).join(" ");

  return (
    <div
      className="bg-white text-[#161B22] w-full aspect-210/297 p-10 pt-9 overflow-hidden"
      style={{ fontFamily: obtenirVariableCssPolice(police) }}
    >
      <header className="mb-7">
        <h1 className="text-4xl font-normal tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          {nomComplet || "Votre nom"}
        </h1>
        {informations.titrePoste && (
          <p className="text-base mt-2 text-[#3D4B5C] font-light">{informations.titrePoste}</p>
        )}

        <div className="flex gap-4 mt-4 text-sm text-[#3D4B5C] flex-wrap">
          {informations.email && (
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4" /> {informations.email}
            </span>
          )}
          {informations.telephone && (
            <span className="flex items-center gap-1.5">
              <Phone className="w-4 h-4" /> {informations.telephone}
            </span>
          )}
          {informations.adresse && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> {informations.adresse}
            </span>
          )}
        </div>
      </header>

      {informations.resume && (
        <p className={`${tailleResume(tailleTexte)} leading-relaxed ${classeAlignement(alignementTexte)} italic mb-7 text-[#3D4B5C] px-4 whitespace-pre-wrap break-words`}>
          {informations.resume}
        </p>
      )}

      <div className="space-y-6">
        {sections
          .filter((s) => s.estVisible)
          .map((section) => (
            <section key={section.id}>
              <h2 className="text-sm font-medium uppercase tracking-[0.2em] mb-4 text-[#161B22]">
                {section.titre}
              </h2>

              {TYPES_EN_BADGES.includes(section.type) ? (
                <div className="flex flex-wrap gap-2">
                  {section.items.map((item) => (
                    <span
                      key={item.id}
                      className="text-sm px-3 py-1 border rounded-full"
                      style={{ borderColor: couleurAccent, color: couleurAccent }}
                    >
                      {item.titre}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="space-y-5">
                  {section.items.map((item) => (
                    <div key={item.id} className="grid grid-cols-[90px_1fr] gap-4">
                      <span className="text-xs text-[#3D4B5C] pt-0.5 leading-tight">
                        {formaterPeriode(item.dateDebut, item.dateFin)}
                      </span>
                      <div>
                        <p className="text-base font-medium">{item.titre}</p>
                        {(item.sousTitre || item.lieu) && (
                          <p className="text-sm text-[#3D4B5C] mt-0.5 font-light">
                            {[item.sousTitre, item.lieu].filter(Boolean).join(", ")}
                          </p>
                        )}
                        {item.description && (
                          <p className="text-sm leading-relaxed mt-1.5 text-[#161B22]/75 font-light whitespace-pre-line">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
      </div>

      <div className="h-0.5 w-12 mt-10" style={{ backgroundColor: couleurAccent }} />
    </div>
  );
}