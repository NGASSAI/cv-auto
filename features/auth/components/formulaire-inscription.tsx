"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  schemaInscription,
  type DonneesInscription,
} from "@/features/auth/validators/auth.schema";

export function FormulaireInscription() {
  const router = useRouter();
  const [enChargement, setEnChargement] = useState(false);
  const [jetonTurnstile, setJetonTurnstile] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DonneesInscription>({
    resolver: zodResolver(schemaInscription),
  });

  async function onSubmit(donnees: DonneesInscription) {
    if (!jetonTurnstile) {
      toast.error("Veuillez vérifier le CAPTCHA");
      return;
    }

    setEnChargement(true);

    try {
      const reponse = await fetch("/api/auth/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...donnees,
          jetonTurnstile,
        }),
      });

      const resultat = await reponse.json();

      if (!reponse.ok) {
        toast.error(resultat.erreur ?? "Une erreur est survenue");
        setEnChargement(false);
        return;
      }

      const connexion = await signIn("credentials", {
        email: donnees.email,
        motDePasse: donnees.motDePasse,
        redirect: false,
      });

      setEnChargement(false);

      if (connexion?.error) {
        toast.success("Compte créé, connectez-vous pour continuer");
        router.push("/connexion");
        return;
      }

      toast.success("Bienvenue sur CV Builder");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setEnChargement(false);
      toast.error("Impossible de créer le compte, réessayez");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="nom">Nom complet</Label>
        <Input
          id="nom"
          type="text"
          placeholder="Amara Nkosi"
          autoComplete="name"
          aria-invalid={!!errors.nom}
          {...register("nom")}
        />
        {errors.nom && (
          <p className="text-sm text-destructive">{errors.nom.message}</p>
        )}
      </div>

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
        <Label htmlFor="motDePasse">Mot de passe</Label>
        <Input
          id="motDePasse"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.motDePasse}
          {...register("motDePasse")}
        />
        {errors.motDePasse ? (
          <p className="text-sm text-destructive">
            {errors.motDePasse.message}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            8 caractères minimum, avec majuscule, minuscule, et chiffre
          </p>
        )}
      </div>

      {/* CAPTCHA Cloudflare Turnstile */}
      <div className="flex justify-center">
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          onSuccess={(token) => setJetonTurnstile(token)}
          onExpire={() => setJetonTurnstile("")}
          onError={() => {
            setJetonTurnstile("");
            toast.error("Le CAPTCHA n'a pas pu être chargé");
          }}
        />
      </div>

      <Button type="submit" className="w-full" disabled={enChargement}>
        {enChargement && <Loader2 className="animate-spin" />}
        Créer mon compte
      </Button>

      <p className="text-sm text-center text-muted-foreground">
        Déjà un compte ?{" "}
        <a
          href="/connexion"
          className="text-secondary hover:underline font-medium"
        >
          Se connecter
        </a>
      </p>
    </form>
  );
}