"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  schemaReinitialisation,
  type DonneesReinitialisation,
} from "@/features/auth/validators/auth.schema";

interface FormulaireReinitialisationProps {
  token: string;
}

export function FormulaireReinitialisation({
  token,
}: FormulaireReinitialisationProps) {
  const router = useRouter();
  const [enChargement, setEnChargement] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DonneesReinitialisation>({
    resolver: zodResolver(schemaReinitialisation),
    defaultValues: { token },
  });

  async function onSubmit(donnees: DonneesReinitialisation) {
    setEnChargement(true);

    try {
      const reponse = await fetch("/api/auth/reinitialiser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donnees),
      });

      const resultat = await reponse.json();

      if (!reponse.ok) {
        toast.error(
          resultat.erreur ?? "Ce lien est invalide ou a expiré"
        );
        setEnChargement(false);
        return;
      }

      toast.success("Mot de passe réinitialisé, connectez-vous");
      router.push("/connexion");
    } catch {
      toast.error("Une erreur est survenue, réessayez");
      setEnChargement(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Champ caché : le code n'est pas modifiable, juste transmis */}
      <input type="hidden" {...register("token")} />

      <div className="space-y-2">
        <Label htmlFor="nouveauMotDePasse">Nouveau mot de passe</Label>
        <Input
          id="nouveauMotDePasse"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.nouveauMotDePasse}
          {...register("nouveauMotDePasse")}
        />
        {errors.nouveauMotDePasse ? (
          <p className="text-sm text-destructive">
            {errors.nouveauMotDePasse.message}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            8 caractères minimum, avec majuscule, minuscule et chiffre
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={enChargement}>
        {enChargement && <Loader2 className="animate-spin" />}
        Valider
      </Button>
    </form>
  );
}