import { obtenirParametresSite } from "@/features/admin/api/parametres.service";
import { PanneauParametres } from "@/features/admin/components/panneau-parametres";

export default async function PageAdminParametres() {
  const parametres = await obtenirParametresSite();

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl font-medium mb-6">
        Paramètres du site
      </h1>
      <PanneauParametres parametresInitiaux={parametres} />
    </div>
  );
}