import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { ProprietesTemplate, formaterPeriode } from "@/features/cv/components/templates/types";
import { obtenirVariableCssPolice } from "@/features/cv/lib/registre-polices";
import { classeAlignement, tailleResume } from "@/features/cv/components/templates/types";

const TYPES_EN_BADGES = ["COMPETENCES", "LANGUES", "CENTRES_INTERET"];

export function TemplateElegant({ informations, sections, couleurAccent, police, alignementTexte, tailleTexte }: ProprietesTemplate) {
  const nomComplet = [informations.prenom, informations.nom].filter(Boolean).join(" ");

  return (
    <div
      className="bg-white text-[#161B22] w-full aspect-210/297 overflow-hidden"
      style={{ fontFamily: obtenirVariableCssPolice(police) }}
    >
      <header className="relative pt-8 pb-10 px-10 text-white" style={{ backgroundColor: couleurAccent }}>
        <h1 className="text-4xl font-medium leading-tight" style={{ fontFamily: "var(--font-display)" }}>
          {nomComplet || "Votre nom"}
        </h1>
        {informations.titrePoste && (
          <p className="text-base mt-1.5 text-white/85 tracking-wide">{informations.titrePoste}</p>
        )}

        <div className="flex gap-4 mt-4 text-sm text-white/80 flex-wrap">
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

      {informations.photoUrl && (
        <div className="relative -mt-12 ml-10 mb-2">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
            <Image src={informations.photoUrl} alt={nomComplet} fill unoptimized className="object-cover" />
          </div>
        </div>
      )}

      <div className={informations.photoUrl ? "px-10 pt-4" : "px-10 pt-10"}>
        {informations.resume && (
          <p className={`${tailleResume(tailleTexte)} leading-relaxed ${classeAlignement(alignementTexte)} italic mb-7 text-[#3D4B5C] px-4`}>{informations.resume}</p>
        )}

        <div className="space-y-5">
          {sections
            .filter((s) => s.estVisible)
            .map((section) => (
              <section key={section.id}>
                <h2
                  className="text-base font-medium mb-3.5 flex items-center gap-2"
                  style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
                >
                  <span className="w-6 h-px inline-block" style={{ backgroundColor: couleurAccent }} />
                  {section.titre}
                </h2>

                {TYPES_EN_BADGES.includes(section.type) ? (
                  <div className="flex flex-wrap gap-2 pl-8">
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
                  <div className="space-y-4 pl-8">
                    {section.items.map((item) => (
                      <div key={item.id}>
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="text-base font-medium">{item.titre}</span>
                          <span className="text-xs text-[#3D4B5C] shrink-0 whitespace-nowrap">
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
    </div>
  );
}