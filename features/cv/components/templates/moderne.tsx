import { Mail, MapPin, Phone } from "lucide-react";
import {
  ProprietesTemplate,
  classeAlignement,
  formaterPeriode,
  tailleResume,
} from "@/features/cv/components/templates/types";
import { obtenirVariableCssPolice } from "@/features/cv/lib/registre-polices";

const TYPES_COLONNE_LATERALE = ["COMPETENCES", "LANGUES", "CENTRES_INTERET", "CERTIFICATIONS"];

function couleurAvecAlpha(couleur: string, alpha: number) {
  if (couleur.startsWith("#") && couleur.length === 7) {
    const hex = couleur.slice(1);
    const r = Number.parseInt(hex.slice(0, 2), 16);
    const g = Number.parseInt(hex.slice(2, 4), 16);
    const b = Number.parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return couleur;
}

export function TemplateModerne({ informations, sections, couleurAccent, police, alignementTexte, tailleTexte }: ProprietesTemplate) {
  const nomComplet = [informations.prenom, informations.nom].filter(Boolean).join(" ");
  const sectionsVisibles = sections.filter((s) => s.estVisible);
  const sectionsLaterales = sectionsVisibles.filter((s) => TYPES_COLONNE_LATERALE.includes(s.type));
  const sectionsPrincipales = sectionsVisibles.filter((s) => !TYPES_COLONNE_LATERALE.includes(s.type));

  return (
    <div
      className="bg-white text-slate-900 w-full aspect-210-297 overflow-hidden"
      style={{ fontFamily: obtenirVariableCssPolice(police) }}
    >
      <div className="h-full flex flex-col">
        <header
          className="px-7 pt-7 pb-6 text-white"
          style={{ background: `linear-gradient(135deg, ${couleurAccent} 0%, ${couleurAvecAlpha(couleurAccent, 0.8)} 100%)` }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/75 mb-2">Profil professionnel</p>
              <h1 className="text-[28px] font-semibold leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                {nomComplet || "Votre nom"}
              </h1>
              {informations.titrePoste && (
                <p className="mt-2 text-sm uppercase tracking-[0.18em] text-white/85">
                  {informations.titrePoste}
                </p>
              )}
            </div>

            {informations.photoUrl && (
              <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-white/70 bg-white/10 shadow-lg shrink-0">
                <img src={informations.photoUrl} alt={nomComplet} className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-2 text-[11px]">
            {informations.email && (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-white/90">
                <Mail className="h-3.5 w-3.5" /> {informations.email}
              </span>
            )}
            {informations.telephone && (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-white/90">
                <Phone className="h-3.5 w-3.5" /> {informations.telephone}
              </span>
            )}
            {informations.adresse && (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-white/90">
                <MapPin className="h-3.5 w-3.5" /> {informations.adresse}
              </span>
            )}
          </div>
        </header>

        <div className="flex flex-1 min-h-0">
          <aside className="w-[34%] bg-slate-100 border-r border-slate-200 p-6">
            {sectionsLaterales.length > 0 && (
              <div className="space-y-6">
                {sectionsLaterales.map((section) => (
                  <div key={section.id}>
                    <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                      {section.titre}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {section.items.map((item) => (
                        <span
                          key={item.id}
                          className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-sm"
                          style={{ borderColor: couleurAvecAlpha(couleurAccent, 0.2) }}
                        >
                          {item.titre}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>

          <main className="flex-1 bg-white p-6">
            {informations.resume && (
              <div
                className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                style={{ borderColor: couleurAvecAlpha(couleurAccent, 0.18) }}
              >
                <p className={`${tailleResume(tailleTexte)} leading-relaxed ${classeAlignement(alignementTexte)} text-slate-700`}>
                  {informations.resume}
                </p>
              </div>
            )}

            <div className="space-y-5">
              {sectionsPrincipales.map((section) => (
                <section key={section.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: couleurAccent }} />
                    <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-700">
                      {section.titre}
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {section.items.map((item) => (
                      <div key={item.id} className="border-l border-slate-200 pl-3.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-base font-semibold text-slate-900">{item.titre}</p>
                            {(item.sousTitre || item.lieu) && (
                              <p className="mt-1 text-[12px] text-slate-600">
                                {[item.sousTitre, item.lieu].filter(Boolean).join(" • ")}
                              </p>
                            )}
                          </div>
                          {item.dateDebut && (
                            <span className="shrink-0 text-[11px] text-slate-500">
                              {formaterPeriode(item.dateDebut, item.dateFin)}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="mt-2 text-[12px] leading-relaxed text-slate-700 whitespace-pre-line">
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
      </div>
    </div>
  );
}