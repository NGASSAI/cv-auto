"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreVertical, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface CarteCVProps {
  id: string;
  titre: string;
  misAJourLe: string;
  onSupprime: (id: string) => void;
}

export function CarteCV({ id, titre, misAJourLe, onSupprime }: CarteCVProps) {
  const [dialogueOuvert, setDialogueOuvert] = useState(false);
  const [suppressionEnCours, setSuppressionEnCours] = useState(false);

  const dateFormatee = new Date(misAJourLe).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  async function gererSuppression() {
    setSuppressionEnCours(true);

    try {
      const reponse = await fetch(`/api/cv/${id}`, { method: "DELETE" });

      if (!reponse.ok) {
        toast.error("Impossible de supprimer ce CV");
        return;
      }

      toast.success("CV supprimé");
      onSupprime(id);
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setSuppressionEnCours(false);
      setDialogueOuvert(false);
    }
  }

  return (
    <>
      <div className="group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
        <Link href={`/editor/${id}`} className="block">
          {/* Aperçu miniature — placeholder pour l'instant, sera remplacé
              par un vrai rendu du CV une fois l'éditeur construit */}
          <div className="aspect-3/4 bg-muted flex items-center justify-center">
            <span className="text-xs text-muted-foreground font-mono">
              Aperçu à venir
            </span>
          </div>
        </Link>

        <div className="p-4 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-medium truncate">{titre}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Modifié le {dateFormatee}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="shrink-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                render={
                  <Link href={`/editor/${id}`}>
                    <Pencil className="w-4 h-4" />
                    Modifier
                  </Link>
                }
              />
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => setDialogueOuvert(true)}
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog open={dialogueOuvert} onOpenChange={setDialogueOuvert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce CV ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est définitive. « {titre} » sera supprimé
              ainsi que tout son contenu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={gererSuppression}
              disabled={suppressionEnCours}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}