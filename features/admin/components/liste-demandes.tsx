"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Demande {
  id: string;
  statut: string;
  message: string | null;
  creeLe: string;
  utilisateur: { id: string; nom: string | null; email: string };
}

interface ListeDemandesProps {
  demandesInitiales: Demande[];
}

const LIBELLES_STATUT: Record<string, string> = {
  EN_ATTENTE: "En attente",
  APPROUVEE: "Approuvée",
  REFUSEE: "Refusée",
};

export function ListeDemandes({ demandesInitiales }: ListeDemandesProps) {
  const [demandes, setDemandes] = useState(demandesInitiales);
  const [enTraitement, setEnTraitement] = useState<string | null>(null);

  async function traiter(id: string, decision: "APPROUVEE" | "REFUSEE") {
    setEnTraitement(id);

    try {
      const reponse = await fetch(`/api/admin/demandes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });

      if (!reponse.ok) {
        const donnees = await reponse.json();
        toast.error(donnees.erreur ?? "Impossible de traiter la demande");
        return;
      }

      toast.success(
        decision === "APPROUVEE" ? "Demande approuvée" : "Demande refusée"
      );

      setDemandes((precedent) =>
        precedent.map((d) => (d.id === id ? { ...d, statut: decision } : d))
      );
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setEnTraitement(null);
    }
  }

  if (demandes.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-12 text-center">
        Aucune demande pour l&apos;instant.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {demandes.map((demande) => (
        <div
          key={demande.id}
          className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between"
        >
          <div className="min-w-0">
            <p className="font-medium truncate">
              {demande.utilisateur.nom ?? demande.utilisateur.email}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {demande.utilisateur.email}
            </p>
            {demande.message && (
              <p className="text-sm text-muted-foreground mt-1 italic">
                « {demande.message} »
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {demande.statut === "EN_ATTENTE" ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={enTraitement === demande.id}
                  onClick={() => traiter(demande.id, "REFUSEE")}
                >
                  <X className="w-4 h-4" />
                  Refuser
                </Button>
                <Button
                  size="sm"
                  disabled={enTraitement === demande.id}
                  onClick={() => traiter(demande.id, "APPROUVEE")}
                >
                  <Check className="w-4 h-4" />
                  Approuver
                </Button>
              </>
            ) : (
              <span
                className={cn(
                  "text-xs px-2 py-1 rounded-full font-medium",
                  demande.statut === "APPROUVEE"
                    ? "bg-secondary/10 text-secondary"
                    : "bg-destructive/10 text-destructive"
                )}
              >
                {LIBELLES_STATUT[demande.statut]}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}