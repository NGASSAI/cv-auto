import { listerUtilisateurs } from "@/features/admin/api/admin.service";
import { TableauUtilisateurs } from "@/features/admin/components/tableau-utilisateurs";

export default async function PageAdminUtilisateurs() {
  const utilisateurs = await listerUtilisateurs();

 const utilisateursSerialisables = utilisateurs.map((u) => ({
    id: u.id,
    nom: u.nom,
    email: u.email,
    role: u.role,
    estSuspendu: u.estSuspendu,
    creeLe: u.creeLe.toISOString(),
    _count: u._count,
    abonnement: u.abonnement,
  }));

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl font-medium mb-6">
        Utilisateurs
      </h1>
      <TableauUtilisateurs utilisateursInitiaux={utilisateursSerialisables} />
    </div>
  );
}