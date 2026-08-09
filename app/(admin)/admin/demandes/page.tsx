import { listerDemandesPremium } from "@/features/admin/api/admin.service";
import { ListeDemandes } from "@/features/admin/components/liste-demandes";

export default async function PageAdminDemandes() {
  const demandes = await listerDemandesPremium();

  const demandesSerialisables = demandes.map((d) => ({
    id: d.id,
    statut: d.statut,
    message: d.message,
    creeLe: d.creeLe.toISOString(),
    utilisateur: d.utilisateur,
  }));

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl font-medium mb-6">
        Demandes Premium
      </h1>
      <ListeDemandes demandesInitiales={demandesSerialisables} />
    </div>
  );
}