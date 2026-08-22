import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import type { ProprietesTemplate } from "@/features/cv/components/templates/types";
import { obtenirFamillePolicePdf } from "@/features/cv/components/pdf/registre-polices-pdf";

const styles = StyleSheet.create({
  page: { fontSize: 10, color: "#161B22", paddingHorizontal: 44, paddingVertical: 44 },
  cadre: { borderWidth: 1.5, padding: 18, flexDirection: "row", alignItems: "center", gap: 14 },
  photo: { width: 64, height: 64, borderRadius: 4 },
  nom: { fontSize: 20, fontWeight: 700 },
  poste: { fontSize: 9.5, fontWeight: 700, marginTop: 3 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 6 },
  contactItem: { fontSize: 8, color: "#3D4B5C" },
  resume: { color: "#3D4B5C", marginTop: 24, marginBottom: 8, lineHeight: 1.5 },
  section: { flexDirection: "row", gap: 10, marginTop: 22 },
  numero: { fontSize: 16, fontWeight: 700, width: 22 },
  contenuSection: { flex: 1, borderLeftWidth: 1, borderLeftColor: "#3D4B5C33", paddingLeft: 12 },
  sectionTitre: { fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  badge: { fontSize: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  item: { marginBottom: 10 },
  itemHeader: { flexDirection: "row", justifyContent: "space-between" },
  itemTitre: { fontSize: 9.5, fontWeight: 700 },
  itemDate: { fontSize: 8, color: "#3D4B5C" },
  itemSousTitre: { fontSize: 8.5, color: "#3D4B5C", marginTop: 2 },
  itemDescription: { fontSize: 8.5, marginTop: 4, lineHeight: 1.4 },
});

const TYPES_EN_BADGES = ["COMPETENCES", "LANGUES", "CENTRES_INTERET"];

function numeroSection(index: number): string {
  return String(index + 1).padStart(2, "0");
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

export function DossierStructurePdf({ informations, sections, couleurAccent, police, alignementTexte, tailleTexte }: ProprietesTemplate) {
  const nomComplet = [informations.prenom, informations.nom].filter(Boolean).join(" ");
  const familleTexte = obtenirFamillePolicePdf(police);
  const sectionsVisibles = sections.filter((s) => s.estVisible);

  return (
    <Document>
      <Page size="A4" style={[styles.page, { fontFamily: familleTexte }]}>
        <View style={[styles.cadre, { borderColor: couleurAccent, backgroundColor: `${couleurAccent}12` }]}>
          {informations.photoUrl && (
            /* eslint-disable-next-line jsx-a11y/alt-text -- Image de @react-pdf/renderer, pas de HTML : pas de prop alt disponible */
            <Image src={informations.photoUrl} style={styles.photo} />
          )}
          <View>
            <Text style={[styles.nom, { color: couleurAccent }]}>{nomComplet || "Votre nom"}</Text>
            {informations.titrePoste && <Text style={[styles.poste, { color: couleurAccent }]}>{informations.titrePoste}</Text>}
            <View style={styles.contactRow}>
              {informations.email && <Text style={styles.contactItem}>{informations.email}</Text>}
              {informations.telephone && <Text style={styles.contactItem}>{informations.telephone}</Text>}
              {informations.adresse && <Text style={styles.contactItem}>{informations.adresse}</Text>}
            </View>
          </View>
        </View>

        {informations.resume && (
          <Text style={[styles.resume, { textAlign: alignementPdf(alignementTexte), fontSize: taillePdf(tailleTexte) }]}>
            {informations.resume}
          </Text>
        )}

        {sectionsVisibles.map((section, index) => (
          <View key={section.id} style={styles.section}>
            <Text style={[styles.numero, { color: couleurAccent }]}>{numeroSection(index)}</Text>
            <View style={styles.contenuSection}>
              <Text style={styles.sectionTitre}>{section.titre}</Text>

              {TYPES_EN_BADGES.includes(section.type) ? (
                <View style={styles.badgeRow}>
                  {section.items.map((item) => (
                    <Text key={item.id} style={[styles.badge, { backgroundColor: `${couleurAccent}18`, color: couleurAccent }]}>
                      {item.titre}
                    </Text>
                  ))}
                </View>
              ) : (
                <View>
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
          </View>
        ))}
      </Page>
    </Document>
  );
}
