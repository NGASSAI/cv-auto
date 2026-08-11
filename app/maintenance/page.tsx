import { Wrench } from "lucide-react";
import { obtenirParametresSite } from "@/features/admin/api/parametres.service";

export default async function PageMaintenance() {
  const parametres = await obtenirParametresSite();

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Wrench className="w-6 h-6 text-muted-foreground" />
        </div>
        <h1 className="font-display text-2xl font-medium">Maintenance en cours</h1>
        <p className="text-muted-foreground text-sm mt-2">
          {parametres.messageMaintenance ||
            "Le site est momentanément indisponible pour une opération de maintenance. Merci de revenir un peu plus tard."}
        </p>
      </div>
    </div>
  );
}