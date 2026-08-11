import { prisma } from "@/shared/lib/prisma";

const ID_PARAMETRES = "parametres";

const PARAMETRES_PAR_DEFAUT = {
  id: ID_PARAMETRES,
  modeMaintenance: false,
  messageMaintenance: null,
  numeroWhatsapp: null,
  titreAccueil: null,
  descriptionAccueil: null,
  accrocheAccueil: null,
  couleurPrimaire: null,
  couleurSecondaire: null,
  emailSupport: null,
  inscriptionActivee: true,
  exportPdfActif: true,
};

export async function obtenirParametresSite() {
  const parametres = await prisma.parametresSite.findUnique({
    where: { id: ID_PARAMETRES },
  });

  return parametres ?? PARAMETRES_PAR_DEFAUT;
}

export type DonneesParametresSite = Partial<
  Omit<typeof PARAMETRES_PAR_DEFAUT, "id">
>;

export async function mettreAJourParametresSite(donnees: DonneesParametresSite) {
  return prisma.parametresSite.upsert({
    where: { id: ID_PARAMETRES },
    create: { id: ID_PARAMETRES, ...donnees },
    update: donnees,
  });
}   