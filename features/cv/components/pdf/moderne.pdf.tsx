import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import type { ProprietesTemplate } from "@/features/cv/components/templates/types";
import { obtenirFamillePolicePdf } from "@/features/cv/components/pdf/registre-polices-pdf";

const styles = StyleSheet.create({
  page: { fontSize: 10, color: "#161B22", flexDirection: "row" },
  aside: { width: "34%", padding: 20, color: "#FFFFFF" },
  photo: { width: 80, height: 80, borderRadius: 40, alignSelf: "center", marginBottom: 16 },
  photoFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: "center",
    marginBottom: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  photoFallbackTexte: { fontSize: 24, fontWeight: 700, color: "#FFFFFF" },
  asideNom: { fontSize: 14, fontWeight: 700, textAlign: "center" },
  asidePoste: { fontSize: 8.5, textAlign: "center", marginTop: 4, textTransform: "uppercase", letterSpacing: 1, opacity: 0.85 },
  asideContact: { marginTop: 20, fontSize: 8 },
  asideSection: { marginTop: 24 },
  asideSectionTitre: { fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 },
  asideBadge: { fontSize: 7.5, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.15)", marginBottom: 4, alignSelf: "flex-start" },
  main: { flex: 1, paddingTop: 18, paddingHorizontal: 24, paddingBottom: 24 },
  resume: { color: "#3D4B5C", marginBottom: 18, lineHeight: 1.4 },
  section: { marginBottom: 12 },
  sectionTitre: {
    fontSize: 9,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    paddingBottom: 4,
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomStyle: "solid",
  },
  item: { marginBottom: 10 },
  itemHeader: { flexDirection: "row", justifyContent: "space-between" },
  itemTitre: { fontSize: 10, fontWeight: 700 },
  itemDate: { fontSize: 8, color: "#3D4B5C" },
  itemSousTitre: { fontSize: 8.5, color: "#3D4B5C", marginTop: 2 },
  itemDescription: { fontSize: 8.5, marginTop: 4, lineHeight: 1.4 },
});

const TYPES_COLONNE_LATERALE = ["COMPETENCES", "LANGUES", "CENTRES_INTERET", "CERTIFICATIONS"];

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

export function ModernePdf({ informations, sections, couleurAccent, police, alignementTexte, tailleTexte }: ProprietesTemplate) {
  const nomComplet = [informations.prenom, informations.nom].filter(Boolean).join(" ");
  const familleTexte = obtenirFamillePolicePdf(police);
  const sectionsVisibles = sections.filter((s) => s.estVisible);
  const sectionsLaterales = sectionsVisibles.filter((s) => TYPES_COLONNE_LATERALE.includes(s.type));
  const sectionsPrincipales = sectionsVisibles.filter((s) => !TYPES_COLONNE_LATERALE.includes(s.type));
  const initiale = (informations.prenom?.[0] ?? informations.nom?.[0] ?? "?").toUpperCase();

  return (
    <Document>
      <Page size="A4" style={[styles.page, { fontFamily: familleTexte }]}>
        <View style={[styles.aside, { backgroundColor: couleurAccent }]}>
          {informations.photoUrl ? (
            // eslint-disable-next-line jsx-a11y/alt-text -- Image de @react-pdf/renderer, pas de HTML : pas de prop alt disponible
            <Image src={informations.photoUrl} style={styles.photo} />
          ) : (
            <View style={styles.photoFallback}>
              <Text style={styles.photoFallbackTexte}>{initiale}</Text>
            </View>
          )}
          <Text style={styles.asideNom}>{nomComplet || "Votre nom"}</Text>
          {informations.titrePoste && <Text style={styles.asidePoste}>{informations.titrePoste}</Text>}

          <View style={styles.asideContact}>
            {informations.email && <Text style={{ marginBottom: 3 }}>{informations.email}</Text>}
            {informations.telephone && <Text style={{ marginBottom: 3 }}>{informations.telephone}</Text>}
            {informations.adresse && <Text>{informations.adresse}</Text>}
          </View>

          {sectionsLaterales.map((section) => (
            <View key={section.id} style={styles.asideSection}>
              <Text style={styles.asideSectionTitre}>{section.titre}</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
                {section.items.map((item) => (
                  <Text key={item.id} style={styles.asideBadge}>{item.titre}</Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.main}>
          {informations.resume && (
            <Text style={[styles.resume, { textAlign: alignementPdf(alignementTexte), fontSize: taillePdf(tailleTexte) }]}>
              {informations.resume}
            </Text>
          )}

          {sectionsPrincipales.map((section) => (
            <View key={section.id} style={styles.section}>
              <Text style={[styles.sectionTitre, { color: couleurAccent, borderBottomColor: couleurAccent }]}>
                {section.titre}
              </Text>
              {section.items.map((item) => (
                <View key={item.id} style={styles.item}>
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
        </View>
      </Page>
    </Document>
  );
}
