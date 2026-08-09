import { recupererStatistiquesDetaillees } from "@/features/admin/api/admin.service";
import { GraphiqueInscriptions } from "@/features/admin/components/graphique-inscriptions";

export default async function PageAdminStatistiques() {
  const stats = await recupererStatistiquesDetaillees();

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl font-medium mb-6">
        Statistiques
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-2xl font-display font-medium">{stats.totalUtilisateurs}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Utilisateurs totaux</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-2xl font-display font-medium">{stats.totalPremium}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Comptes Premium</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-2xl font-display font-medium">{stats.tauxConversion}%</p>
          <p className="text-xs text-muted-foreground mt-0.5">Taux de conversion</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-2xl font-display font-medium">{stats.totalCV}</p>
          <p className="text-xs text-muted-foreground mt-0.5">CV créés</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 sm:p-6 mb-8">
        <h2 className="font-medium mb-4">Inscriptions — 8 dernières semaines</h2>
        <GraphiqueInscriptions donnees={stats.inscriptionsParSemaine} />
      </div>

      <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
        <h2 className="font-medium mb-4">Demandes Premium</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl font-display font-medium text-secondary">
              {stats.demandes.approuvees}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Approuvées</p>
          </div>
          <div>
            <p className="text-xl font-display font-medium text-destructive">
              {stats.demandes.refusees}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Refusées</p>
          </div>
          <div>
            <p className="text-xl font-display font-medium text-primary">
              {stats.demandes.enAttente}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">En attente</p>
          </div>
        </div>
      </div>
    </div>
  );
}