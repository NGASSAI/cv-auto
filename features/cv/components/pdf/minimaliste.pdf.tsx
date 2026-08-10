import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { ProprietesTemplate } from "@/features/cv/components/templates/types";

const styles = StyleSheet.create({
  page: { paddingTop: 36, paddingHorizontal: 48, paddingBottom: 48, fontSize: 10, fontFamily: "Helvetica", color: "#161B22" },
  header: { marginBottom: 24 },
  nom: { fontSize: 26, fontWeight: 400 },
  poste: { fontSize: 10, color: "#3D4B5C", marginTop: 6 },
  contactRow: { flexDirection: "row", gap: 14, marginTop: 12 },
  contactItem: { fontSize: 8.5, color: "#3D4B5C" },
resume: { color: "#161B22", marginBottom: 30, lineHeight: 1.5, maxWidth: 340 },
  section: { marginBottom: 18 },
  sectionTitre: { fontSize: 8.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 },
  itemRow: { flexDirection: "row", gap: 14, marginBottom: 14 },
  itemDate: { fontSize: 8, color: "#3D4B5C", width: 70 },
  itemTitre: { fontSize: 10, fontWeight: 700 },
  itemSousTitre: { fontSize: 8.5, color: "#3D4B5C", marginTop: 2 },
  itemDescription: { fontSize: 8.5, color: "#161B22", marginTop: 4, lineHeight: 1.4 },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  badge: { fontSize: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  barre: { height: 2, width: 40, marginTop: 20 },
});

const TYPES_EN_BADGES = ["COMPETENCES", "LANGUES", "CENTRES_INTERET"];

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
export function MinimalistePdf({ informations, sections, couleurAccent, alignementTexte, tailleTexte }: ProprietesTemplate) {
  const nomComplet = [informations.prenom, informations.nom].filter(Boolean).join(" ");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.nom}>{nomComplet || "Votre nom"}</Text>
          {informations.titrePoste && <Text style={styles.poste}>{informations.titrePoste}</Text>}
          <View style={styles.contactRow}>
            {informations.email && <Text style={styles.contactItem}>{informations.email}</Text>}
            {informations.telephone && <Text style={styles.contactItem}>{informations.telephone}</Text>}
            {informations.adresse && <Text style={styles.contactItem}>{informations.adresse}</Text>}
          </View>
        </View>

        {informations.resume && (
  <Text style={[styles.resume, { textAlign: alignementPdf(alignementTexte), fontSize: taillePdf(tailleTexte) }]}>
    {informations.resume}
  </Text>
)}

        {sections.filter((s) => s.estVisible).map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitre}>{section.titre}</Text>

            {TYPES_EN_BADGES.includes(section.type) ? (
              <View style={styles.badgeRow}>
                {section.items.map((item) => (
                  <Text key={item.id} style={[styles.badge, { border: `1px solid ${couleurAccent}`, color: couleurAccent }]}>
                    {item.titre}
                  </Text>
                ))}
              </View>
            ) : (
              section.items.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <Text style={styles.itemDate}>{formaterPeriodePdf(item.dateDebut, item.dateFin)}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitre}>{item.titre}</Text>
                    {(item.sousTitre || item.lieu) && (
                      <Text style={styles.itemSousTitre}>
                        {[item.sousTitre, item.lieu].filter(Boolean).join(", ")}
                      </Text>
                    )}
                    {item.description && <Text style={styles.itemDescription}>{item.description}</Text>}
                  </View>
                </View>
              ))
            )}
          </View>
        ))}

        <View style={[styles.barre, { backgroundColor: couleurAccent }]} />
      </Page>
    </Document>
  );
}