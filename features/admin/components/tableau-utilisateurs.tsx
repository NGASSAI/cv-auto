"use client";
import { useState } from "react";
import { Ban, Sparkles, SparklesIcon as SparklesOff, Trash2, Calendar } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FORMULES_PREMIUM, formaterDate } from "@/features/premium/lib/formules-premium";

interface Utilisateur {
  id: string;
  nom: string | null;
  email: string;
  role: string;
  estSuspendu: boolean;
  creeLe: string;
  _count: { cvs: number };
  abonnement: {
    plan: string;
    statut: string;
    formulePremium?: string | null;
    dateDebut?: string | null;
    dateFin?: string | null;
  } | null;
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
  const [utilisateurAActiverPremium, setUtilisateurAActiverPremium] =
    useState<Utilisateur | null>(null);
  const [formuleSelectionnee, setFormuleSelectionnee] = useState<string>("MENSUEL_1500");

  async function togglerPremium(utilisateur: Utilisateur) {
    const estActif = utilisateur.abonnement?.statut === "ACTIF";
    
    if (estActif) {
      // Désactivation directe
      setEnTraitement(utilisateur.id);

      try {
        const reponse = await fetch(`/api/admin/utilisateurs/${utilisateur.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ desactiverPremium: true }),
        });

        if (!reponse.ok) {
          const donnees = await reponse.json();
          toast.error(donnees.erreur ?? "Impossible de désactiver le Premium");
          return;
        }

        toast.success("Premium désactivé");

        setUtilisateurs((precedent) =>
          precedent.map((u) =>
            u.id === utilisateur.id
              ? {
                  ...u,
                  abonnement: {
                    plan: "GRATUIT",
                    statut: "ANNULE",
                    formulePremium: undefined,
                    dateDebut: undefined,
                    dateFin: undefined,
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
    } else {
      // Activation - ouvrir le dialogue de sélection de formule
      setUtilisateurAActiverPremium(utilisateur);
      setFormuleSelectionnee("MENSUEL_1500");
    }
  }

  async function confirmerActivationPremium() {
    if (!utilisateurAActiverPremium) return;

    setEnTraitement(utilisateurAActiverPremium.id);

    try {
      const reponse = await fetch(`/api/admin/utilisateurs/${utilisateurAActiverPremium.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          activerPremium: true,
          formule: formuleSelectionnee,
        }),
      });

      if (!reponse.ok) {
        const donnees = await reponse.json();
        toast.error(donnees.erreur ?? "Impossible d'activer le Premium");
        return;
      }

      toast.success("Premium activé");

      setUtilisateurs((precedent) =>
        precedent.map((u) =>
          u.id === utilisateurAActiverPremium.id
            ? {
                ...u,
                abonnement: {
                  plan: "MENSUEL",
                  statut: "ACTIF",
                  formulePremium: formuleSelectionnee,
                  dateDebut: new Date().toISOString(),
                  dateFin: new Date(Date.now() + FORMULES_PREMIUM.find(f => f.id === formuleSelectionnee)!.dureeJours * 24 * 60 * 60 * 1000).toISOString(),
                },
              }
            : u
        )
      );
      
      setUtilisateurAActiverPremium(null);
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setEnTraitement(null);
    }
  }

  async function togglerSuspension(utilisateur: Utilisateur) {
    setEnTraitement(utilisateur.id);

    try {
      const reponse = await fetch(`/api/admin/utilisateurs/${utilisateur.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suspendre: !utilisateur.estSuspendu }),
      });

      if (!reponse.ok) {
        const donnees = await reponse.json();
        toast.error(donnees.erreur ?? "Impossible de modifier le statut");
        return;
      }

      toast.success(utilisateur.estSuspendu ? "Compte réactivé" : "Compte suspendu");

      setUtilisateurs((precedent) =>
        precedent.map((u) =>
          u.id === utilisateur.id ? { ...u, estSuspendu: !u.estSuspendu } : u
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
                <th className="px-4 py-3 font-medium">Premium</th>
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
                      <div className="flex items-center gap-1.5">
                        {estPremium || estAdmin ? (
                          <span className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary font-medium">
                            Premium
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Gratuit</span>
                        )}
                        {utilisateur.estSuspendu && (
                          <span className="text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive font-medium">
                            Suspendu
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {estPremium && utilisateur.abonnement?.formulePremium && utilisateur.abonnement?.dateFin ? (
                        <div className="text-xs">
                          <div className="font-medium text-secondary">
                            {FORMULES_PREMIUM.find(f => f.id === utilisateur.abonnement?.formulePremium)?.nom}
                          </div>
                          <div className="text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Expire: {formaterDate(new Date(utilisateur.abonnement.dateFin))}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
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
                          onClick={() => togglerSuspension(utilisateur)}
                          title={utilisateur.estSuspendu ? "Réactiver le compte" : "Suspendre temporairement"}
                        >
                          <Ban className={utilisateur.estSuspendu ? "w-4 h-4 text-primary" : "w-4 h-4"} />
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

      <Dialog
        open={!!utilisateurAActiverPremium}
        onOpenChange={(ouvert) => !ouvert && setUtilisateurAActiverPremium(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Activer Premium</DialogTitle>
            <DialogDescription>
              Sélectionnez la formule Premium pour {utilisateurAActiverPremium?.nom ?? utilisateurAActiverPremium?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {FORMULES_PREMIUM.map((formule) => (
              <button
                key={formule.id}
                onClick={() => setFormuleSelectionnee(formule.id)}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  formuleSelectionnee === formule.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{formule.nom}</div>
                    <div className="text-sm text-muted-foreground">{formule.description}</div>
                  </div>
                  <div className="text-lg font-bold text-primary">{formule.prix} FCFA</div>
                </div>
              </button>
            ))}
          </div>
          <DialogFooter>
            <button
              onClick={() => setUtilisateurAActiverPremium(null)}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Annuler
            </button>
            <button
              onClick={confirmerActivationPremium}
              disabled={enTraitement === utilisateurAActiverPremium?.id}
              className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:opacity-90 disabled:opacity-50"
            >
              {enTraitement === utilisateurAActiverPremium?.id ? "Activation..." : "Activer Premium"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}