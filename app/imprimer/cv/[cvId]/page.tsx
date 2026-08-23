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
 * Browserless pour générer le PDF (voir app/api/cv/[cvId]/export/route.tsx).
 *
 * Accès protégé par un token signé à courte durée de vie — voir
 * features/cv/lib/token-impression.ts.
 *
 * IMPORTANT : ne PAS mettre de balises <html>/<body> ici — le layout
 * racine (app/layout.tsx) les fournit déjà. Les dupliquer casse le CSS.
 *
 * IMPORTANT #2 : la largeur du <body> DOIT être fixée à 210mm (largeur
 * physique d'une page A4). Sans ça, le navigateur headless de
 * Browserless rend la page à sa largeur de fenêtre par défaut (souvent
 * plus large qu'un A4), et le moteur d'impression compresse ensuite
 * tout le contenu — y compris le texte — pour tenir dans une page A4,
 * ce qui donne un texte visuellement trop petit dans le PDF final.
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
      <style>{`
        @page { 
          size: A4; 
          margin: 0.5cm;
        }
        body {
          margin: 0;
          padding: 0;
          width: 210mm;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-smooth: always;
        }
        .bg-papier {
          background-color: #ffffff;
        }
        .text-encre {
          color: #1a1a1a;
        }
        .text-ardoise {
          color: #4a5568;
        }
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