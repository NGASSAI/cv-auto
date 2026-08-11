import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/shared/lib/auth";
import { recupererCVComplet, ErreurCV } from "@/features/cv/api/cv.service";
import { aAccesPremium } from "@/features/premium/lib/acces-premium";
import { prisma } from "@/shared/lib/prisma";
import { EditeurCV } from "@/features/cv/components/editor/editeur-cv";

export default async function PageEditeur({
  params,
}: {
  params: Promise<{ cvId: string }>;
}) {
  const session = await getServerSession(authOptions);

 if (!session) {
    redirect("/connexion");
  }

  const utilisateurFrais = await prisma.utilisateur.findUnique({
    where: { id: session.user.id },
    select: { estSuspendu: true },
  });

  if (utilisateurFrais?.estSuspendu) {
    redirect("/compte-suspendu");
  }
  const { cvId } = await params;

  let cv;
  try {
    cv = await recupererCVComplet(cvId, session.user.id);
  } catch (erreur) {
    if (erreur instanceof ErreurCV) {
      notFound();
    }
    throw erreur;
  }

  const utilisateur = await prisma.utilisateur.findUnique({
    where: { id: session.user.id },
    select: { role: true, abonnement: { select: { statut: true } } },
  });

  const estPremium = utilisateur ? aAccesPremium(utilisateur) : false;

  // Sérialisation : Prisma renvoie des objets Date, il faut les convertir
  // en string pour les transmettre à un composant client sans erreur
  const cvSerialise = {
  id: cv.id,
  titre: cv.titre,
  templateId: cv.templateId,
  couleurAccent: cv.couleurAccent,
  police: cv.police,
   alignementTexte: cv.alignementTexte,
tailleTexte: cv.tailleTexte,
  informations: cv.informations
      ? {
          prenom: cv.informations.prenom,
          nom: cv.informations.nom,
          titrePoste: cv.informations.titrePoste,
          email: cv.informations.email,
          telephone: cv.informations.telephone,
          adresse: cv.informations.adresse,
          photoUrl: cv.informations.photoUrl,
          resume: cv.informations.resume,
        }
      : {
          prenom: null,
          nom: null,
          titrePoste: null,
          email: null,
          telephone: null,
          adresse: null,
          photoUrl: null,
          resume: null,
        },
    sections: cv.sections.map((section) => ({
      id: section.id,
      type: section.type,
      titre: section.titre,
      ordre: section.ordre,
      estVisible: section.estVisible,
      items: section.items.map((item) => ({
        id: item.id,
        ordre: item.ordre,
        titre: item.titre,
        sousTitre: item.sousTitre,
        lieu: item.lieu,
        dateDebut: item.dateDebut?.toISOString() ?? null,
        dateFin: item.dateFin?.toISOString() ?? null,
        description: item.description,
        donneesJson: item.donneesJson,
      })),
    })),
  };

  return <EditeurCV cvInitial={cvSerialise} estPremium={estPremium} />;
}