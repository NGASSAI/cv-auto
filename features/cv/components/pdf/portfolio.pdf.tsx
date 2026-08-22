import { Document, Page, View, Text, Image, StyleSheet, Svg, Path, Circle, Polyline } from "@react-pdf/renderer";
import type { ProprietesTemplate } from "@/features/cv/components/templates/types";
import { obtenirFamillePolicePdf } from "@/features/cv/components/pdf/registre-polices-pdf";

const styles = StyleSheet.create({
  page: { fontSize: 10, color: "#161B22", paddingHorizontal: 40, paddingVertical: 40 },
  header: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 20 },
  photo: { width: 64, height: 64, borderRadius: 32 },
  nom: { fontSize: 20, fontWeight: 700 },
  poste: { fontSize: 9.5, fontWeight: 700, marginTop: 3 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 6 },
  contactItem: { flexDirection: "row", alignItems: "center", gap: 3 },
  contactTexte: { fontSize: 8, color: "#3D4B5C" },
  resume: { color: "#3D4B5C", marginBottom: 20, lineHeight: 1.5 },
  badgesBloc: { marginBottom: 24, gap: 8 },
  badgeGroupe: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 6, marginBottom: 6 },
  badgeLabel: { fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#3D4B5C", marginRight: 4 },
  badge: { fontSize: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  competencesBloc: { marginBottom: 24 },
  competencesTitre: { fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 },
  grilleCompetences: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  carteCompetence: {
    width: "31%",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#3D4B5C22",
    borderRadius: 6,
    padding: 6,
  },
  nomCompetence: { fontSize: 7.5, fontWeight: 700 },
  section: { marginBottom: 18 },
  sectionTitre: { fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 },
  item: { marginBottom: 10, paddingLeft: 14, position: "relative" },
  pastilleItem: { position: "absolute", left: 0, top: 3, width: 6, height: 6, borderRadius: 3 },
  itemHeader: { flexDirection: "row", justifyContent: "space-between" },
  itemTitre: { fontSize: 9.5, fontWeight: 700 },
  itemDate: { fontSize: 8, color: "#3D4B5C" },
  itemSousTitre: { fontSize: 8.5, color: "#3D4B5C", marginTop: 2 },
  itemDescription: { fontSize: 8.5, marginTop: 4, lineHeight: 1.4 },
});

const TYPES_EN_BADGES = ["LANGUES", "CENTRES_INTERET"];
// Circonférence d'un cercle de rayon 15 (2 * PI * 15), identique au calcul du template HTML
const CIRCONFERENCE_ANNEAU = 94.2;

function IconeMail() {
  return (
    <Svg viewBox="0 0 24 24" style={{ width: 8, height: 8 }}>
      <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#3D4B5C" strokeWidth={2} fill="none" />
      <Polyline points="22,6 12,13 2,6" stroke="#3D4B5C" strokeWidth={2} fill="none" />
    </Svg>
  );
}

function IconeTelephone() {
  return (
    <Svg viewBox="0 0 24 24" style={{ width: 8, height: 8 }}>
      <Path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
        stroke="#3D4B5C"
        strokeWidth={2}
        fill="none"
      />
    </Svg>
  );
}

function IconeLieu() {
  return (
    <Svg viewBox="0 0 24 24" style={{ width: 8, height: 8 }}>
      <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#3D4B5C" strokeWidth={2} fill="none" />
      <Circle cx={12} cy={10} r={3} stroke="#3D4B5C" strokeWidth={2} fill="none" />
    </Svg>
  );
}

/**
 * Anneau de progression de compétence — équivalent PDF de l'anneau SVG
 * du template HTML (cercle avec stroke-dasharray proportionnel au niveau).
 * Remplace l'ancienne version PDF qui utilisait un carré à opacité
 * variable, ce qui ne correspondait pas du tout au design du template.
 */
function AnneauCompetence({ niveau, couleurAccent }: { niveau: number; couleurAccent: string }) {
  const longueurRemplie = (niveau / 100) * CIRCONFERENCE_ANNEAU;
  return (
    <Svg viewBox="0 0 36 36" style={{ width: 20, height: 20 }}>
      <Circle cx={18} cy={18} r={15} fill="none" stroke={`${couleurAccent}25`} strokeWidth={4} />
      <Circle
        cx={18}
        cy={18}
        r={15}
        fill="none"
        stroke={couleurAccent}
        strokeWidth={4}
        strokeDasharray={`${longueurRemplie} ${CIRCONFERENCE_ANNEAU}`}
        strokeLinecap="round"
        transform="rotate(-90 18 18)"
      />
    </Svg>
  );
}

interface DonneesNiveau {
  niveau?: number;
}

function obtenirNiveau(donneesJson: unknown): number {
  if (!donneesJson || typeof donneesJson !== "object") return 75;
  const donnees = donneesJson as DonneesNiveau;
  return typeof donnees.niveau === "number" ? donnees.niveau : 75;
}

function formaterPeriodePdf(dateDebut: string | null, dateFin: string | null): string {
  if (!dateDebut) return "";
  const options: Intl.DateTimeFormatOptions = { month: "short", year: "numeric" };
  const debut = new Date(dateDebut).toLocaleDateString("fr-FR", options);
  if (!dateFin) return `${debut} — Présent`;
  return `${debut} — ${new Date(dateFin).toLocaleDateString("fr-FR", options)}`;
}

function alignementPdf(alignement: string): "left" | "center" | "right" | "justify" {
  const correspondances: Record<string, "left" | "center" | "right" | "justify"> = {
    gauche: "left", centre: "center", droite: "right", justifie: "justify",
  };
  return correspondances[alignement] ?? "left";
}

function taillePdf(taille: string): number {
  const correspondances: Record<string, number> = { petite: 8.5, moyenne: 10, grande: 11.5 };
  return correspondances[taille] ?? 10;
}

export function PortfolioPdf({ informations, sections, couleurAccent, police, alignementTexte, tailleTexte }: ProprietesTemplate) {
  const nomComplet = [informations.prenom, informations.nom].filter(Boolean).join(" ");
  const familleTexte = obtenirFamillePolicePdf(police);
  const sectionsVisibles = sections.filter((s) => s.estVisible);
  const sectionCompetences = sectionsVisibles.find((s) => s.type === "COMPETENCES");
  const sectionsBadges = sectionsVisibles.filter((s) => TYPES_EN_BADGES.includes(s.type));
  const sectionsChronologiques = sectionsVisibles.filter(
    (s) => s.type !== "COMPETENCES" && !TYPES_EN_BADGES.includes(s.type)
  );

  return (
    <Document>
      <Page size="A4" style={[styles.page, { fontFamily: familleTexte }]}>
        <View style={styles.header}>
          {informations.photoUrl && (
            /* eslint-disable-next-line jsx-a11y/alt-text -- Image de @react-pdf/renderer, pas de HTML : pas de prop alt disponible */
            <Image src={informations.photoUrl} style={styles.photo} />
          )}
          <View>
            <Text style={styles.nom}>{nomComplet || "Votre nom"}</Text>
            {informations.titrePoste && <Text style={[styles.poste, { color: couleurAccent }]}>{informations.titrePoste}</Text>}
            <View style={styles.contactRow}>
              {informations.email && (
                <View style={styles.contactItem}>
                  <IconeMail />
                  <Text style={styles.contactTexte}>{informations.email}</Text>
                </View>
              )}
              {informations.telephone && (
                <View style={styles.contactItem}>
                  <IconeTelephone />
                  <Text style={styles.contactTexte}>{informations.telephone}</Text>
                </View>
              )}
              {informations.adresse && (
                <View style={styles.contactItem}>
                  <IconeLieu />
                  <Text style={styles.contactTexte}>{informations.adresse}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {informations.resume && (
          <Text style={[styles.resume, { textAlign: alignementPdf(alignementTexte), fontSize: taillePdf(tailleTexte) }]}>
            {informations.resume}
          </Text>
        )}

        {sectionsBadges.length > 0 && (
          <View style={styles.badgesBloc}>
            {sectionsBadges.map((section) => (
              <View key={section.id} style={styles.badgeGroupe}>
                <Text style={styles.badgeLabel}>{section.titre}</Text>
                {section.items.map((item) => (
                  <Text key={item.id} style={[styles.badge, { backgroundColor: `${couleurAccent}18`, color: couleurAccent }]}>
                    {item.titre}
                    {section.type === "LANGUES" && item.sousTitre ? ` — ${item.sousTitre}` : ""}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {sectionCompetences && sectionCompetences.items.length > 0 && (
          <View style={styles.competencesBloc}>
            <Text style={styles.competencesTitre}>{sectionCompetences.titre}</Text>
            <View style={styles.grilleCompetences}>
              {sectionCompetences.items.map((item) => {
                const niveau = obtenirNiveau(item.donneesJson);
                return (
                  <View key={item.id} style={styles.carteCompetence}>
                    <AnneauCompetence niveau={niveau} couleurAccent={couleurAccent} />
                    <Text style={styles.nomCompetence}>{item.titre}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {sectionsChronologiques.map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitre}>{section.titre}</Text>
            {section.items.map((item) => (
              <View key={item.id} style={styles.item}>
                <View style={[styles.pastilleItem, { backgroundColor: couleurAccent }]} />
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitre}>{item.titre}</Text>
                  <Text style={styles.itemDate}>{formaterPeriodePdf(item.dateDebut, item.dateFin)}</Text>
                </View>
                {(item.sousTitre || item.lieu) && (
                  <Text style={styles.itemSousTitre}>
                    {[item.sousTitre, item.lieu].filter(Boolean).join(" — ")}
                  </Text>
                )}
                {item.description && <Text style={styles.itemDescription}>{item.description}</Text>}
              </View>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
}
