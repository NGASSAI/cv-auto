import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { ProprietesTemplate, formaterPeriode } from "@/features/cv/components/templates/types";
import { obtenirVariableCssPolice } from "@/features/cv/lib/registre-polices";
import { classeAlignement, tailleResume } from "@/features/cv/components/templates/types";

const TYPES_COLONNE_LATERALE = ["COMPETENCES", "LANGUES", "CENTRES_INTERET", "CERTIFICATIONS"];

export function TemplateModerne({ informations, sections, couleurAccent, police, alignementTexte, tailleTexte }: ProprietesTemplate) {
  const nomComplet = [informations.prenom, informations.nom].filter(Boolean).join(" ");

  const sectionsVisibles = sections.filter((s) => s.estVisible);
  const sectionsLaterales = sectionsVisibles.filter((s) => TYPES_COLONNE_LATERALE.includes(s.type));
  const sectionsPrincipales = sectionsVisibles.filter((s) => !TYPES_COLONNE_LATERALE.includes(s.type));

  return (
    <div
      className="bg-white text-[#161B22] w-full aspect-210/297 overflow-hidden flex"
      style={{ fontFamily: obtenirVariableCssPolice(police) }}
    >
      <aside className="w-[34%] p-6 text-white flex flex-col" style={{ backgroundColor: couleurAccent }}>
        {informations.photoUrl && (
          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-5 border-2 border-white/40 relative">
            <Image src={informations.photoUrl} alt={nomComplet} fill unoptimized className="object-cover" />
          </div>
        )}

        <h1 className="text-lg font-medium text-center leading-tight" style={{ fontFamily: "var(--font-display)" }}>
          {nomComplet || "Votre nom"}
        </h1>
        {informations.titrePoste && (
          <p className="text-[11px] text-center mt-1 text-white/80 uppercase tracking-wide">
            {informations.titrePoste}
          </p>
        )}

        <div className="mt-6 space-y-2 text-[10px] text-white/90">
          {informations.email && (
            <p className="flex items-center gap-1.5 wrap-break-word">
              <Mail className="w-3 h-3 shrink-0" /> {informations.email}
            </p>
          )}
          {informations.telephone && (
            <p className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 shrink-0" /> {informations.telephone}
            </p>
          )}
          {informations.adresse && (
            <p className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 shrink-0" /> {informations.adresse}
            </p>
          )}
        </div>

        <div className="mt-8 space-y-6">
          {sectionsLaterales.map((section) => (
            <div key={section.id}>
              <h2 className="text-[10px] font-semibold uppercase tracking-widest mb-2.5 text-white/95">
                {section.titre}
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {section.items.map((item) => (
                  <span
                    key={item.id}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-white/15 text-white"
                  >
                    {item.titre}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 pt-5 px-7 pb-7">
        {informations.resume && (
          <p className={`${tailleResume(tailleTexte)} leading-relaxed ${classeAlignement(alignementTexte)} italic mb-7 text-[#3D4B5C] px-4`}>{informations.resume}</p>
        )}

        <div className="space-y-4">
          {sectionsPrincipales.map((section) => (
            <section key={section.id}>
              <h2
                className="text-xs font-semibold uppercase tracking-widest mb-3 pb-1"
                style={{ color: couleurAccent, borderBottom: `2px solid ${couleurAccent}` }}
              >
                {section.titre}
              </h2>

              <div className="space-y-3.5">
                {section.items.map((item) => (
                  <div key={item.id}>
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="text-sm font-medium">{item.titre}</span>
                      <span className="text-[10px] text-[#3D4B5C] shrink-0 whitespace-nowrap">
                        {formaterPeriode(item.dateDebut, item.dateFin)}
                      </span>
                    </div>
                    {(item.sousTitre || item.lieu) && (
                      <p className="text-xs text-[#3D4B5C] mt-0.5">
                        {[item.sousTitre, item.lieu].filter(Boolean).join(" — ")}
                      </p>
                    )}
                    {item.description && (
                      <p className="text-xs leading-relaxed mt-1.5 text-[#161B22]/85 whitespace-pre-line">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}