"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  schemaDemandeReinitialisation,
  type DonneesDemandeReinitialisation,
} from "@/features/auth/validators/auth.schema";

export function FormulaireMotDePasseOublie() {
  const [enChargement, setEnChargement] = useState(false);
  const [emailEnvoye, setEmailEnvoye] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DonneesDemandeReinitialisation>({
    resolver: zodResolver(schemaDemandeReinitialisation),
  });

  async function onSubmit(donnees: DonneesDemandeReinitialisation) {
    setEnChargement(true);

    try {
      const reponse = await fetch("/api/auth/mot-de-passe-oublie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donnees),
      });

      if (!reponse.ok) {
        toast.error("Une erreur est survenue, réessayez");
        setEnChargement(false);
        return;
      }

      setEmailEnvoye(donnees.email);
    } catch {
      toast.error("Une erreur est survenue, réessayez");
    } finally {
      setEnChargement(false);
    }
  }

  // État de confirmation : remplace le formulaire une fois la demande envoyée
  if (emailEnvoye) {
    return (
      <div className="text-center space-y-3 py-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
          <MailCheck className="w-6 h-6 text-secondary" />
        </div>
        <h2 className="font-display text-xl font-medium">
          Vérifiez votre boîte mail
        </h2>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          Si un compte existe pour <span className="font-medium">{emailEnvoye}</span>,
          un lien de réinitialisation vient d&apos;être envoyé. Il est valable 1 heure.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="vous@exemple.com"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={enChargement}>
        {enChargement && <Loader2 className="animate-spin" />}
        Envoyer le lien de réinitialisation
      </Button>

      <p className="text-sm text-center text-muted-foreground">
        <a href="/connexion" className="text-secondary hover:underline font-medium">
          Retour à la connexion
        </a>
      </p>
    </form>
  );
}