"use client";

import { useState, useEffect } from "react";
import { Sparkles, MessageCircle, Phone, Send, Clock, CheckCircle2, Download } from "lucide-react";
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
import { FORMULES_PREMIUM } from "@/features/premium/lib/formules-premium";
import type { FormulePremium } from "@/lib/generated/prisma/client";

type StatutDemande = "EN_ATTENTE" | "APPROUVEE" | "REFUSEE" | null;

interface BoutonPremiumProps {
  statutInitial: StatutDemande;
  utilisateurId: string;
  formuleActuelle?: FormulePremium | null;
}

const NUMERO_WHATSAPP = "242066817726";
const NUMERO_TELEPHONE = "+242 06 681 77 26";
const LIEN_TEL = `tel:${NUMERO_TELEPHONE.replace(/\s/g, "")}`;

export function BoutonPremium({ statutInitial, utilisateurId, formuleActuelle }: BoutonPremiumProps) {
  const [statut, setStatut] = useState<StatutDemande>(statutInitial);
  const [dialogueOuvert, setDialogueOuvert] = useState(false);
  const [formuleSelectionnee, setFormuleSelectionnee] = useState<FormulePremium | null>(null);
  const [message, setMessage] = useState("");
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  const lienWhatsapp = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(
    "Bonjour, je souhaite passer en mode Premium sur CV Builder."
  )}`;

  // Polling pour vérifier le statut de la demande quand on est en attente
  useEffect(() => {
    if (statut !== "EN_ATTENTE") return;

    const interval = setInterval(async () => {
      try {
        const reponse = await fetch("/api/premium");
        if (reponse.ok) {
          const donnees = await reponse.json();
          if (donnees.statut && donnees.statut !== statut) {
            setStatut(donnees.statut);
            if (donnees.statut === "APPROUVEE") {
              toast.success("Votre compte est maintenant Premium !");
            } else if (donnees.statut === "REFUSEE") {
              toast.error("Votre demande a été refusée");
            }
          }
        }
      } catch {
        // Erreur silencieuse, on réessaiera au prochain intervalle
      }
    }, 5000); // Vérifier toutes les 5 secondes

    return () => clearInterval(interval);
  }, [statut]);

  async function gererDemandeInterface() {
    if (!formuleSelectionnee) {
      toast.error("Veuillez sélectionner une formule");
      return;
    }

    setEnvoiEnCours(true);

    try {
      const reponse = await fetch("/api/premium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: message || undefined,
          formule: formuleSelectionnee
        }),
      });

      const donnees = await reponse.json();

      if (!reponse.ok) {
        toast.error(donnees.erreur ?? "Impossible d'envoyer la demande");
        return;
      }

      toast.success("Votre demande a été envoyée");
      setStatut("EN_ATTENTE");
      setDialogueOuvert(false);
      setFormuleSelectionnee(null);
      setMessage("");
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

  // Déjà approuvé : afficher la formule active
  if (statut === "APPROUVEE") {
    const formule = FORMULES_PREMIUM.find(f => f.id === formuleActuelle);
    return (
      <div className="flex items-center gap-2 text-sm text-secondary bg-secondary/10 px-3 py-2 rounded-lg">
        <CheckCircle2 className="w-4 h-4" />
        <span>Compte Premium actif{formule ? ` - ${formule.nom}` : ""}</span>
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
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choisir votre abonnement Premium</DialogTitle>
          <DialogDescription>
            Sélectionnez la formule qui correspond à vos besoins. Plus de téléchargements, plus de fonctionnalités.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Formules d'abonnement */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FORMULES_PREMIUM.map((formule) => (
              <button
                key={formule.id}
                type="button"
                onClick={() => setFormuleSelectionnee(formule.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  formuleSelectionnee === formule.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{formule.nom}</h3>
                  <span className="text-lg font-bold text-primary">{formule.prix}F</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{formule.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Download className="w-4 h-4" />
                  <span className="font-medium">
                    {formule.id === "TROIS_JOURS_600" && "1 téléchargement"}
                    {formule.id === "DEUX_SEMAINES_1000" && "3 téléchargements"}
                    {formule.id === "MENSUEL_1500" && "4 téléchargements"}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Contact direct */}
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Ou contactez-nous directement :</p>
            <div className="grid grid-cols-2 gap-3">
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
                  <p className="text-sm font-medium">WhatsApp</p>
                  <p className="text-xs text-muted-foreground">Réponse rapide</p>
                </div>
              </a>

              <a
                href={LIEN_TEL}
                className="flex items-center gap-3 border border-border rounded-lg p-3 hover:bg-muted transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Téléphone</p>
                  <p className="text-xs text-muted-foreground">{NUMERO_TELEPHONE}</p>
                </div>
              </a>
            </div>
          </div>

          {/* Message optionnel */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Message pour l'admin (optionnel)</p>
            <Textarea
              placeholder="Précisez vos besoins ou posez vos questions..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={gererDemandeInterface}
            disabled={envoiEnCours || !formuleSelectionnee}
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