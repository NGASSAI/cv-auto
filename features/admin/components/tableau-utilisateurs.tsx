"use client";

import { useState } from "react";
import { Sparkles, SparklesIcon as SparklesOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Utilisateur {
  id: string;
  nom: string | null;
  email: string;
  role: string;
  creeLe: string;
  _count: { cvs: number };
  abonnement: { plan: string; statut: string } | null;
}

interface TableauUtilisateursProps {
  utilisateursInitiaux: Utilisateur[];
}

export function TableauUtilisateurs({
  utilisateursInitiaux,
}: TableauUtilisateursProps) {
  const [utilisateurs, setUtilisateurs] = useState(utilisateursInitiaux);
  const [enTraitement, setEnTraitement] = useState<string | null>(null);
  const [utilisateurASupprimer, setUtilisateurASupprimer] =
    useState<Utilisateur | null>(null);

  async function togglerPremium(utilisateur: Utilisateur) {
    const estActif = utilisateur.abonnement?.statut === "ACTIF";
    setEnTraitement(utilisateur.id);

    try {
      const reponse = await fetch(`/api/admin/utilisateurs/${utilisateur.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activerPremium: !estActif }),
      });

      if (!reponse.ok) {
        const donnees = await reponse.json();
        toast.error(donnees.erreur ?? "Impossible de modifier le Premium");
        return;
      }

      toast.success(estActif ? "Premium désactivé" : "Premium activé");

      setUtilisateurs((precedent) =>
        precedent.map((u) =>
          u.id === utilisateur.id
            ? {
                ...u,
                abonnement: {
                  plan: estActif ? "GRATUIT" : "MENSUEL",
                  statut: estActif ? "ANNULE" : "ACTIF",
                },
              }
            : u
        )
      );
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setEnTraitement(null);
    }
  }

  async function confirmerSuppression() {
    if (!utilisateurASupprimer) return;

    setEnTraitement(utilisateurASupprimer.id);

    try {
      const reponse = await fetch(
        `/api/admin/utilisateurs/${utilisateurASupprimer.id}`,
        { method: "DELETE" }
      );

      if (!reponse.ok) {
        const donnees = await reponse.json();
        toast.error(donnees.erreur ?? "Impossible de supprimer ce compte");
        return;
      }

      toast.success("Compte supprimé");
      setUtilisateurs((precedent) =>
        precedent.filter((u) => u.id !== utilisateurASupprimer.id)
      );
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setEnTraitement(null);
      setUtilisateurASupprimer(null);
    }
  }

  return (
    <>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Rôle</th>
                <th className="px-4 py-3 font-medium">CV</th>
                <th className="px-4 py-3 font-medium">Abonnement</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {utilisateurs.map((utilisateur) => {
                const estPremium = utilisateur.abonnement?.statut === "ACTIF";
                const estAdmin = utilisateur.role === "ADMIN";

                return (
                  <tr key={utilisateur.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {utilisateur.nom ?? "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {utilisateur.email}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          estAdmin
                            ? "text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium"
                            : "text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground font-medium"
                        }
                      >
                        {utilisateur.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">{utilisateur._count.cvs}</td>
                    <td className="px-4 py-3">
                      {estPremium || estAdmin ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary font-medium">
                          Premium
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Gratuit</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={enTraitement === utilisateur.id || estAdmin}
                          onClick={() => togglerPremium(utilisateur)}
                          title={estAdmin ? "Les admins sont déjà Premium" : undefined}
                        >
                          {estPremium ? (
                            <SparklesOff className="w-4 h-4" />
                          ) : (
                            <Sparkles className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={enTraitement === utilisateur.id || estAdmin}
                          onClick={() => setUtilisateurASupprimer(utilisateur)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog
        open={!!utilisateurASupprimer}
        onOpenChange={(ouvert) => !ouvert && setUtilisateurASupprimer(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce compte ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le compte de « {utilisateurASupprimer?.nom ?? utilisateurASupprimer?.email} »
              et tous ses CV seront supprimés définitivement. Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmerSuppression}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}