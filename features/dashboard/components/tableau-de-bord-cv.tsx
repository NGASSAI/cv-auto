"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CarteCV } from "@/features/dashboard/components/carte-cv";
import { EtatVide } from "@/features/dashboard/components/etat-vide";

interface CV {
  id: string;
  titre: string;
  misAJourLe: string;
}

interface TableauDeBordCVProps {
  cvsInitiaux: CV[];
}

export function TableauDeBordCV({ cvsInitiaux }: TableauDeBordCVProps) {
  const router = useRouter();
  const [cvs, setCvs] = useState<CV[]>(cvsInitiaux);
  const [creationEnCours, setCreationEnCours] = useState(false);

  async function gererCreation() {
    setCreationEnCours(true);

    try {
      const reponse = await fetch("/api/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titre: "Mon CV" }),
      });

      const donnees = await reponse.json();

      if (!reponse.ok) {
        if (reponse.status === 401) {
          toast.error("Session expirée. Veuillez vous reconnecter.");
          router.push("/connexion");
          return;
        }

        toast.error(donnees?.erreur ?? "Impossible de créer le CV");
        return;
      }

      router.push(`/editor/${donnees.cv.id}`);
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setCreationEnCours(false);
    }
  }

  function gererSuppression(id: string) {
    setCvs((precedent) => precedent.filter((cv) => cv.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-medium">
            Mes CV
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {cvs.length} {cvs.length > 1 ? "dossiers" : "dossier"}
          </p>
        </div>

        <Button onClick={gererCreation} disabled={creationEnCours}>
          {creationEnCours ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">Nouveau CV</span>
        </Button>
      </div>

      {cvs.length === 0 ? (
        <EtatVide />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {cvs.map((cv) => (
            <CarteCV
              key={cv.id}
              id={cv.id}
              titre={cv.titre}
              misAJourLe={cv.misAJourLe}
              onSupprime={gererSuppression}
            />
          ))}
        </div>
      )}
    </div>
  );
}