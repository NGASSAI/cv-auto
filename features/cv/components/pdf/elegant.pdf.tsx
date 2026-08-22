import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import type { ProprietesTemplate } from "@/features/cv/components/templates/types";
import { obtenirFamillePolicePdf } from "@/features/cv/components/pdf/registre-polices-pdf";

const styles = StyleSheet.create({
  page: { fontSize: 10, color: "#161B22" },
  bandeau: { paddingTop: 24, paddingBottom: 28, paddingHorizontal: 36, color: "#FFFFFF" },
  nom: { fontSize: 26, fontWeight: 700 },
  poste: { fontSize: 10, marginTop: 4, opacity: 0.9 },
  contactRow: { flexDirection: "row", gap: 12, marginTop: 12 },
  contactItem: { fontSize: 8.5, opacity: 0.85 },
  photoWrap: { marginTop: -40, marginLeft: 36, marginBottom: 8 },
  photo: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    borderStyle: "solid",
    borderColor: "#FFFFFF",
  },
  contenu: { paddingHorizontal: 36, paddingTop: 16 },
  resume: { color: "#3D4B5C", marginBottom: 20, lineHeight: 1.5, maxWidth: 380 },
  section: { marginBottom: 12 },
  sectionTitreRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  trait: { width: 18, height: 1 },
  sectionTitre: { fontSize: 10.5, fontStyle: "italic" },
  itemsWrap: { paddingLeft: 26 },
  item: { marginBottom: 10 },
  itemHeader: { flexDirection: "row", justifyContent: "space-between" },
  itemTitre: { fontSize: 10, fontWeight: 700 },
  itemDate: { fontSize: 8, color: "#3D4B5C" },
  itemSousTitre: { fontSize: 8.5, color: "#3D4B5C", marginTop: 2 },
  itemDescription: { fontSize: 8.5, marginTop: 4, lineHeight: 1.4 },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  badge: { fontSize: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
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

export function ElegantPdf({ informations, sections, couleurAccent, police, alignementTexte, tailleTexte }: ProprietesTemplate) {
  const nomComplet = [informations.prenom, informations.nom].filter(Boolean).join(" ");
  const familleTexte = obtenirFamillePolicePdf(police);

  return (
    <Document>
      <Page size="A4" style={[styles.page, { fontFamily: familleTexte }]}>
        <View style={[styles.bandeau, { backgroundColor: couleurAccent }]}>
          <Text style={styles.nom}>{nomComplet || "Votre nom"}</Text>
          {informations.titrePoste && <Text style={styles.poste}>{informations.titrePoste}</Text>}
          <View style={styles.contactRow}>
            {informations.email && <Text style={styles.contactItem}>{informations.email}</Text>}
            {informations.telephone && <Text style={styles.contactItem}>{informations.telephone}</Text>}
            {informations.adresse && <Text style={styles.contactItem}>{informations.adresse}</Text>}
          </View>
        </View>
        {informations.photoUrl && (
          <View style={styles.photoWrap}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- Image de @react-pdf/renderer, pas de HTML : pas de prop alt disponible */}
            <Image src={informations.photoUrl} style={styles.photo} />
          </View>
        )}

        <View style={styles.contenu}>
          {informations.resume && (
            <Text style={[styles.resume, { textAlign: alignementPdf(alignementTexte), fontSize: taillePdf(tailleTexte) }]}>
              {informations.resume}
            </Text>
          )}

          {sections.filter((s) => s.estVisible).map((section) => (
            <View key={section.id} style={styles.section}>
              <View style={styles.sectionTitreRow}>
                <View style={[styles.trait, { backgroundColor: couleurAccent }]} />
                <Text style={styles.sectionTitre}>{section.titre}</Text>
              </View>

              {TYPES_EN_BADGES.includes(section.type) ? (
                <View style={[styles.badgeRow, styles.itemsWrap]}>
                  {section.items.map((item) => (
                    <Text key={item.id} style={[styles.badge, { backgroundColor: `${couleurAccent}20`, color: couleurAccent }]}>
                      {item.titre}
                    </Text>
                  ))}
                </View>
              ) : (
                <View style={styles.itemsWrap}>
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
              )}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
