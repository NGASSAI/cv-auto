"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function BoutonCreationCV() {
  const router = useRouter();
  const [creationEnCours, setCreationEnCours] = useState(false);

  async function gererCreation() {
    setCreationEnCours(true);

    try {
      const reponse = await fetch("/api/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titre: "Mon CV" }),
      });

      if (!reponse.ok) {
        const donnees = await reponse.json();
        console.error("Erreur création CV:", donnees);
        
        if (reponse.status === 401) {
          toast.error("Session expirée. Veuillez vous reconnecter.");
          router.push("/connexion");
          return;
        }

        toast.error(donnees.erreur ?? "Impossible de créer le CV");
        return;
      }

      const donnees = await reponse.json();
      console.log("CV créé:", donnees);
      router.push(`/editor/${donnees.cv.id}`);
    } catch (erreur) {
      console.error("Erreur catch création CV:", erreur);
      toast.error("Une erreur est survenue lors de la création du CV");
    } finally {
      setCreationEnCours(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={gererCreation}
      disabled={creationEnCours}
    >
      {creationEnCours ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
      <span className="ml-2">Créer un CV</span>
    </Button>
  );
}
