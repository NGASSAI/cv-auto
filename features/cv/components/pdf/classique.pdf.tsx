import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { ProprietesTemplate } from "@/features/cv/components/templates/types";
import { obtenirFamillePolicePdf } from "@/features/cv/components/pdf/registre-polices-pdf";

const styles = StyleSheet.create({
  page: { paddingTop: 32, paddingHorizontal: 40, paddingBottom: 40, fontSize: 10, color: "#161B22" },
  header: {
    textAlign: "center",
    paddingBottom: 12,
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomStyle: "solid",
  },
  nom: { fontSize: 22, fontWeight: 700, marginBottom: 4 },
  poste: { fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: "#3D4B5C" },
  contactRow: { flexDirection: "row", justifyContent: "center", gap: 10, marginTop: 8 },
  contactItem: { fontSize: 9, color: "#3D4B5C" },
  resume: { fontStyle: "italic", color: "#3D4B5C", marginBottom: 20, paddingHorizontal: 20 },
  section: { marginBottom: 12 },
  sectionTitre: {
    fontSize: 9,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    paddingBottom: 4,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
  },
  item: { marginBottom: 10, paddingLeft: 8, borderLeftWidth: 2, borderLeftStyle: "solid" },
  itemHeader: { flexDirection: "row", justifyContent: "space-between" },
  itemTitre: { fontSize: 10.5, fontWeight: 700 },
  itemDate: { fontSize: 8.5, color: "#3D4B5C" },
  itemSousTitre: { fontSize: 9, color: "#3D4B5C", marginTop: 2 },
  itemDescription: { fontSize: 9, color: "#161B22", marginTop: 4, lineHeight: 1.4 },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  badge: { fontSize: 8.5, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
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

export function ClassiquePdf({ informations, sections, couleurAccent, police, alignementTexte, tailleTexte }: ProprietesTemplate) {
  const nomComplet = [informations.prenom, informations.nom].filter(Boolean).join(" ");
  const familleTexte = obtenirFamillePolicePdf(police);

  return (
    <Document>
      <Page size="A4" style={[styles.page, { fontFamily: familleTexte }]}>
        <View style={[styles.header, { borderBottomColor: couleurAccent }]}>
          <Text style={styles.nom}>{nomComplet || "Votre nom"}</Text>
          {informations.titrePoste && <Text style={styles.poste}>{informations.titrePoste}</Text>}
          <View style={styles.contactRow}>
            {informations.email && <Text style={styles.contactItem}>{informations.email}</Text>}
            {informations.telephone && <Text style={styles.contactItem}>· {informations.telephone}</Text>}
            {informations.adresse && <Text style={styles.contactItem}>· {informations.adresse}</Text>}
          </View>
        </View>

        {informations.resume && (
          <Text style={[styles.resume, { textAlign: alignementPdf(alignementTexte), fontSize: taillePdf(tailleTexte) }]}>
            {informations.resume}
          </Text>
        )}

        {sections.filter((s) => s.estVisible).map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={[styles.sectionTitre, { color: couleurAccent, borderBottomColor: couleurAccent }]}>
              {section.titre}
            </Text>

            {TYPES_EN_BADGES.includes(section.type) ? (
              <View style={styles.badgeRow}>
                {section.items.map((item) => (
                  <Text key={item.id} style={[styles.badge, { backgroundColor: `${couleurAccent}20`, color: couleurAccent }]}>
                    {item.titre}
                  </Text>
                ))}
              </View>
            ) : (
              section.items.map((item) => (
                <View key={item.id} style={[styles.item, { borderLeftColor: `${couleurAccent}60` }]}>
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
              ))
            )}
          </View>
        ))}
      </Page>
    </Document>
  );
}
