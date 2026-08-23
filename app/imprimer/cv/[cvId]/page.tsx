import { notFound } from "next/navigation";
import { verifierTokenImpression } from "@/features/cv/lib/token-impression";
import { recupererCVComplet, ErreurCV } from "@/features/cv/api/cv.service";
import { obtenirTemplate } from "@/features/cv/components/templates/registre-templates";

interface PageImpressionProps {
  params: Promise<{ cvId: string }>;
  searchParams: Promise<{ token?: string }>;
}

/**
 * Page interne, non liée dans la navigation, utilisée uniquement par
 * Puppeteer pour générer le PDF (voir app/api/cv/[cvId]/export/route.tsx).
 *
 * Accès protégé par un token signé à courte durée de vie (pas par la
 * session NextAuth habituelle, puisque Puppeteer n'a pas de cookie de
 * navigateur) — voir features/cv/lib/token-impression.ts.
 *
 * IMPORTANT : ne PAS mettre de balises <html>/<body> ici — le layout
 * racine (app/layout.tsx) les fournit déjà, avec l'import de
 * globals.css et les variables de police. Les dupliquer casse le CSS
 * (HTML invalide) et empêche Tailwind de s'appliquer correctement.
 *
 * Affiche EXACTEMENT le même composant de template que l'aperçu live
 * de l'éditeur (apercu-live.tsx) : c'est ce qui garantit que le PDF
 * est pixel-perfect identique à ce que l'utilisateur voit à l'écran.
 */
export default async function PageImpressionCV({ params, searchParams }: PageImpressionProps) {
  const { cvId } = await params;
  const { token } = await searchParams;

  const charge = verifierTokenImpression(token);
  if (!charge || charge.cvId !== cvId) {
    notFound();
  }

  let cv;
  try {
    cv = await recupererCVComplet(cvId, charge.userId);
  } catch (erreur) {
    if (erreur instanceof ErreurCV) {
      notFound();
    }
    throw erreur;
  }

  const sectionsFormatees = cv.sections.map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      dateDebut: item.dateDebut ? item.dateDebut.toISOString().split("T")[0] : null,
      dateFin: item.dateFin ? item.dateFin.toISOString().split("T")[0] : null,
    })),
  }));

  const informations = cv.informations ?? {
    prenom: null,
    nom: null,
    titrePoste: null,
    email: null,
    telephone: null,
    adresse: null,
    photoUrl: null,
    resume: null,
  };

  const { composant: ComposantTemplate } = obtenirTemplate(cv.templateId);

  return (
    <>
      {/*
        @page force Puppeteer (avec preferCSSPageSize: true) à générer
        une page PDF exactement au format A4, sans marge — le template
        gère lui-même son padding interne.
      */}
      <style>{`
        @page { size: A4; margin: 0; }
        body { margin: 0; padding: 0; }
      `}</style>
      <ComposantTemplate
        informations={informations}
        sections={sectionsFormatees}
        couleurAccent={cv.couleurAccent}
        police={cv.police}
        alignementTexte={cv.alignementTexte}
        tailleTexte={cv.tailleTexte}
      />
    </>
  );
}