import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { listerCVUtilisateur } from "@/features/cv/api/cv.service";
import { recupererDerniereDemandePremium } from "@/features/premium/api/premium.service";
import { aAccesPremium } from "@/features/premium/lib/acces-premium";
import { prisma } from "@/shared/lib/prisma";
import { TableauDeBordCV } from "@/features/dashboard/components/tableau-de-bord-cv";
import { BoutonPremium } from "@/features/premium/components/bouton-premium";

export default async function PageDashboard() {
  const session = await getServerSession(authOptions);

  const [cvs, derniereDemande, utilisateurAvecAbonnement] = await Promise.all([
    listerCVUtilisateur(session!.user.id),
    recupererDerniereDemandePremium(session!.user.id),
    prisma.utilisateur.findUnique({
      where: { id: session!.user.id },
      select: { role: true, abonnement: { select: { statut: true } } },
    }),
  ]);

  const estPremium = utilisateurAvecAbonnement
    ? aAccesPremium(utilisateurAvecAbonnement)
    : false;

  const statutInitial = estPremium
    ? "APPROUVEE"
    : derniereDemande?.statut === "EN_ATTENTE"
    ? "EN_ATTENTE"
    : null;

  const cvsSerialisables = cvs.map((cv) => ({
    id: cv.id,
    titre: cv.titre,
    misAJourLe: cv.misAJourLe.toISOString(),
  }));

  return (
    <div>
      <div className="flex justify-end mb-6">
        <BoutonPremium statutInitial={statutInitial} />
      </div>

      <TableauDeBordCV cvsInitiaux={cvsSerialisables} />
    </div>
  );
}