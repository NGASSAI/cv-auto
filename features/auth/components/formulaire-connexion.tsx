"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  schemaConnexion,
  type DonneesConnexion,
} from "@/features/auth/validators/auth.schema";

export function FormulaireConnexion() {

  const [enChargement, setEnChargement] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DonneesConnexion>({
    resolver: zodResolver(schemaConnexion),
  });

  async function onSubmit(donnees: DonneesConnexion) {
    setEnChargement(true);

    try {
      // Récupérer le rôle de l'utilisateur avant la connexion
      const reponseRole = await fetch(`/api/auth/role?email=${encodeURIComponent(donnees.email)}`);
      const donneesRole = await reponseRole.json();

      if (!reponseRole.ok) {
        toast.error("Email ou mot de passe incorrect");
        setEnChargement(false);
        return;
      }

      const callbackUrl = donneesRole.role === "ADMIN" ? "/admin" : "/dashboard";

      const resultat = await signIn("credentials", {
        email: donnees.email,
        motDePasse: donnees.motDePasse,
        redirect: true,
        callbackUrl,
      });

      setEnChargement(false);

      if (!resultat?.ok || resultat?.error) {
        if (resultat?.error === "COMPTE_SUSPENDU") {
          toast.error("Ce compte a été suspendu. Contactez l'administrateur.");
        } else {
          toast.error("Email ou mot de passe incorrect");
        }
        return;
      }

      toast.success("Connexion réussie");
    } catch (error) {
      setEnChargement(false);
      toast.error("Une erreur est survenue lors de la connexion");
    }
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

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="motDePasse">Mot de passe</Label>
          <a
            href="/mot-de-passe-oublie"
            className="text-sm text-secondary hover:underline"
          >
            Mot de passe oublié ?
          </a>
        </div>
        <Input
          id="motDePasse"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!errors.motDePasse}
          {...register("motDePasse")}
        />
        {errors.motDePasse && (
          <p className="text-sm text-destructive">
            {errors.motDePasse.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={enChargement}>
        {enChargement && <Loader2 className="animate-spin" />}
        Se connecter
      </Button>

      <p className="text-sm text-center text-muted-foreground">
        Pas encore de compte ?{" "}
        <a href="/inscription" className="text-secondary hover:underline font-medium">
          Créer un compte
        </a>
      </p>
    </form>
  );
}