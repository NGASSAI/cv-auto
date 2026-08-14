"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, MailCheck, Copy, Check } from "lucide-react";

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
  const [code, setCode] = useState<string | null>(null);
  const [lien, setLien] = useState<string | null>(null);
  const [copie, setCopie] = useState(false);

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

      const resultat = await reponse.json();
      setEmailEnvoye(donnees.email);
      
      // Si le code est disponible (en développement), l'afficher
      if (resultat.token) {
        setCode(resultat.token);
        setLien(resultat.lien);
      }
    } catch {
      toast.error("Une erreur est survenue, réessayez");
    } finally {
      setEnChargement(false);
    }
  }

  function copierCode() {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopie(true);
      toast.success("Code copié !");
      setTimeout(() => setCopie(false), 2000);
    }
  }

  // État de confirmation : remplace le formulaire une fois la demande envoyée
  if (emailEnvoye) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
          <MailCheck className="w-6 h-6 text-secondary" />
        </div>
        <h2 className="font-display text-xl font-medium">
          Code de réinitialisation
        </h2>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          Pour l&apos;email <span className="font-medium">{emailEnvoye}</span>
        </p>

        {code && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Votre code :</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-background px-3 py-2 rounded text-sm break-all">
                  {code}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copierCode}
                  className="shrink-0"
                >
                  {copie ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>1. Copiez le code ci-dessus</p>
              <p>2. Cliquez sur le bouton ci-dessous</p>
              <p>3. Choisissez votre nouveau mot de passe</p>
            </div>

            <Button
              className="w-full"
              size="sm"
              onClick={() => window.location.href = lien || `/reinitialiser/${code}`}
            >
              Continuer
            </Button>
          </div>
        )}
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
        Obtenir mon code
      </Button>

      <p className="text-sm text-center text-muted-foreground">
        <a href="/connexion" className="text-secondary hover:underline font-medium">
          Retour à la connexion
        </a>
      </p>
    </form>
  );
}
