import { FileText, Users, Clock, Sparkles } from "lucide-react";
import { recupererStatistiques } from "@/features/admin/api/admin.service";

export default async function PageAdminAccueil() {
  const stats = await recupererStatistiques();

  const cartes = [
    {
      label: "Utilisateurs",
      valeur: stats.totalUtilisateurs,
      icone: Users,
    },
    {
      label: "CV créés",
      valeur: stats.totalCV,
      icone: FileText,
    },
    {
      label: "Demandes en attente",
      valeur: stats.demandesEnAttente,
      icone: Clock,
      alerte: stats.demandesEnAttente > 0,
    },
    {
      label: "Comptes Premium",
      valeur: stats.totalPremium,
      icone: Sparkles,
    },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl font-medium mb-6">
        Vue d&apos;ensemble
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cartes.map((carte) => {
          const Icone = carte.icone;
          return (
            <div
              key={carte.label}
              className="bg-card border border-border rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <Icone className="w-4 h-4 text-muted-foreground" />
                {carte.alerte && (
                  <span className="w-2 h-2 rounded-full bg-primary" />
                )}
              </div>
              <p className="text-2xl font-display font-medium">{carte.valeur}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{carte.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}