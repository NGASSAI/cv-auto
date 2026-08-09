"use client";

import { useState } from "react";
import { Sparkles, MessageCircle, Send, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type StatutDemande = "EN_ATTENTE" | "APPROUVEE" | "REFUSEE" | null;

interface BoutonPremiumProps {
  statutInitial: StatutDemande;
}

const NUMERO_WHATSAPP = "24266817726";

export function BoutonPremium({ statutInitial }: BoutonPremiumProps) {
  const [statut, setStatut] = useState<StatutDemande>(statutInitial);
  const [dialogueOuvert, setDialogueOuvert] = useState(false);
  const [message, setMessage] = useState("");
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  const lienWhatsapp = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(
    "Bonjour, je souhaite passer en mode Premium sur CV Builder."
  )}`;

  async function gererDemandeInterface() {
    setEnvoiEnCours(true);

    try {
      const reponse = await fetch("/api/premium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message || undefined }),
      });

      const donnees = await reponse.json();

      if (!reponse.ok) {
        toast.error(donnees.erreur ?? "Impossible d'envoyer la demande");
        return;
      }

      toast.success("Votre demande a été envoyée");
      setStatut("EN_ATTENTE");
      setDialogueOuvert(false);
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setEnvoiEnCours(false);
    }
  }

  // Déjà en attente : on affiche un badge, pas de nouvelle action possible
  if (statut === "EN_ATTENTE") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-2 rounded-lg">
        <Clock className="w-4 h-4" />
        Demande Premium en attente
      </div>
    );
  }

  // Déjà approuvé : simple confirmation visuelle
  if (statut === "APPROUVEE") {
    return (
      <div className="flex items-center gap-2 text-sm text-secondary bg-secondary/10 px-3 py-2 rounded-lg">
        <CheckCircle2 className="w-4 h-4" />
        Compte Premium actif
      </div>
    );
  }

  return (
    <Dialog open={dialogueOuvert} onOpenChange={setDialogueOuvert}>
      <DialogTrigger
        render={
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <Sparkles className="w-4 h-4" />
            Passer en Premium
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Passer en Premium</DialogTitle>
          <DialogDescription>
            Débloquez les templates premium, l&apos;ajout de photo et plus
            d&apos;options. Deux façons de nous contacter :
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <a
            href={lienWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 border border-border rounded-lg p-3 hover:bg-muted transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium">Contacter via WhatsApp</p>
              <p className="text-xs text-muted-foreground">
                Réponse rapide, discussion directe
              </p>
            </div>
          </a>

          <div className="space-y-2">
            <p className="text-sm font-medium">Ou envoyez une demande ici</p>
            <Textarea
              placeholder="Un message pour l'admin (optionnel)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={gererDemandeInterface}
            disabled={envoiEnCours}
            className="w-full"
          >
            <Send className="w-4 h-4" />
            Envoyer la demande
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}