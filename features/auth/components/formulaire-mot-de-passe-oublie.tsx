"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, MailCheck, Copy, Check } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";

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
  const [lienReinitialisation, setLienReinitialisation] = useState<string | null>(
    null
  );

  const [copie, setCopie] = useState(false);

  const [jetonTurnstile, setJetonTurnstile] = useState("");

  // Date d'expiration réelle du token
  const [expiration, setExpiration] = useState<number | null>(null);

  // Heure actuelle utilisée uniquement pour rafraîchir l'affichage
  const [maintenant, setMaintenant] = useState(() => Date.now());

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DonneesDemandeReinitialisation>({
    resolver: zodResolver(schemaDemandeReinitialisation),
  });

  /**
   * Met à jour l'horloge chaque seconde lorsqu'un lien existe.
   */
 useEffect(() => {
  if (!expiration) {
    return;
  }

  const intervalle = setInterval(() => {
    setMaintenant((ancienneValeur) => ancienneValeur + 1000);
  }, 1000);

  return () => clearInterval(intervalle);
}, [expiration]);

  /**
   * Calcule le temps restant avant expiration.
   */
  const tempsRestant =
    expiration !== null
      ? Math.max(0, expiration - maintenant)
      : null;

  /**
   * Nombre de minutes restantes.
   */
  const minutesRestantes =
    tempsRestant !== null
      ? Math.floor(tempsRestant / 60000)
      : 0;

  /**
   * Nombre de secondes restantes.
   */
  const secondesRestantes =
    tempsRestant !== null
      ? Math.floor((tempsRestant % 60000) / 1000)
      : 0;

  async function onSubmit(
    donnees: DonneesDemandeReinitialisation
  ) {
    if (!jetonTurnstile) {
      toast.error("Veuillez vérifier le CAPTCHA");
      return;
    }

    setEnChargement(true);

    try {
      const reponse = await fetch(
        "/api/auth/reinitialiser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...donnees,
            jetonTurnstile,
          }),
        }
      );

      const donneesReponse = await reponse.json();

      if (!reponse.ok) {
        toast.error(
          donneesReponse.erreur ??
            "Une erreur est survenue, réessayez"
        );

        setEnChargement(false);
        return;
      }

      setEmailEnvoye(donnees.email);

      setLienReinitialisation(
        donneesReponse.lienSecours
      );

      // Date d'expiration envoyée par le serveur
      setExpiration(
        new Date(donneesReponse.expireLe).getTime()
      );

     

      toast.success(
        "Lien de réinitialisation généré"
      );
    } catch {
      toast.error(
        "Une erreur est survenue, réessayez"
      );
    } finally {
      setEnChargement(false);
    }
  }

  function copierLien() {
    if (!lienReinitialisation) {
      return;
    }

    navigator.clipboard.writeText(
      lienReinitialisation
    );

    setCopie(true);

    toast.success("Lien copié !");

    setTimeout(() => {
      setCopie(false);
    }, 2000);
  }

  /**
   * Affichage après génération du lien.
   */
  if (emailEnvoye) {
    const lienExpire =
      tempsRestant !== null &&
      tempsRestant <= 0;

    return (
      <div className="text-center space-y-4 py-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
          <MailCheck className="w-6 h-6 text-secondary" />
        </div>

        <h2 className="font-display text-xl font-medium">
          Lien de réinitialisation généré
        </h2>

        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          Si un compte existe pour{" "}
          <span className="font-medium">
            {emailEnvoye}
          </span>
          , un lien de réinitialisation a été généré.
        </p>

        {/* COMPTEUR */}
        {tempsRestant !== null && (
          <div
            className={`rounded-lg px-4 py-3 text-sm ${
              lienExpire
                ? "bg-destructive/10"
                : "bg-secondary/10"
            }`}
          >
            {lienExpire ? (
              <span className="text-destructive font-medium">
                ⚠️ Ce lien a expiré.
              </span>
            ) : (
              <>
                ⏱️ Ce lien expire dans{" "}
                <strong className="tabular-nums">
                  {minutesRestantes
                    .toString()
                    .padStart(2, "0")}
                  :
                  {secondesRestantes
                    .toString()
                    .padStart(2, "0")}
                </strong>
              </>
            )}
          </div>
        )}

        {/* BOUTONS */}
        {!lienExpire && (
          <div className="space-y-2">
            <Button
              onClick={copierLien}
              variant="outline"
              className="w-full"
            >
              {copie ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copié !
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copier le lien
                </>
              )}
            </Button>

            <Button
              onClick={() => {
                if (lienReinitialisation) {
                  window.location.href =
                    lienReinitialisation;
                }
              }}
              className="w-full"
            >
              Utiliser le lien maintenant
            </Button>
          </div>
        )}

        {lienExpire && (
          <Button
            onClick={() => {
              setEmailEnvoye(null);
              setLienReinitialisation(null);
              setExpiration(null);
              setMaintenant(Date.now());
            }}
            variant="outline"
            className="w-full"
          >
            Demander un nouveau lien
          </Button>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div className="space-y-2">
        <Label htmlFor="email">
          Email
        </Label>

        <Input
          id="email"
          type="email"
          placeholder="vous@exemple.com"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register("email")}
        />

        {errors.email && (
          <p className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* CAPTCHA CLOUDFLARE TURNSTILE */}
      <div className="flex justify-center">
        <Turnstile
          siteKey={
            process.env
              .NEXT_PUBLIC_TURNSTILE_SITE_KEY!
          }
          onSuccess={(token) => {
            setJetonTurnstile(token);
          }}
          onExpire={() => {
            setJetonTurnstile("");
          }}
          onError={() => {
            setJetonTurnstile("");

            toast.error(
              "Le CAPTCHA n'a pas pu être chargé"
            );
          }}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={enChargement}
      >
        {enChargement && (
          <Loader2 className="animate-spin" />
        )}

        Envoyer le lien de réinitialisation
      </Button>

      <p className="text-sm text-center text-muted-foreground">
        <a
          href="/connexion"
          className="text-secondary hover:underline font-medium"
        >
          Retour à la connexion
        </a>
      </p>
    </form>
  );
}