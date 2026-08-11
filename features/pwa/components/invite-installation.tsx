"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

interface EvenementInstallationPwa extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const CLE_STOCKAGE_REFUS = "cv-auto-installation-refusee";
const CLE_STOCKAGE_REFUS_IOS = "cv-auto-installation-refusee-ios";

function estIosSafari(): boolean {
  const uaEstIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const uaEstSafari = /safari/i.test(navigator.userAgent) && !/crios|fxios|edgios/i.test(navigator.userAgent);
  const dejaInstallee = (navigator as { standalone?: boolean }).standalone === true;
  return uaEstIos && uaEstSafari && !dejaInstallee;
}   

export function InviteInstallation() {
  const [evenementInstallation, setEvenementInstallation] = useState<EvenementInstallationPwa | null>(null);

  useEffect(() => {
    function gererEvenement(evenement: Event) {
      evenement.preventDefault();

      const dejaRefuse = localStorage.getItem(CLE_STOCKAGE_REFUS);
      if (dejaRefuse) return;

      setEvenementInstallation(evenement as EvenementInstallationPwa);
    }

    window.addEventListener("beforeinstallprompt", gererEvenement);
    return () => window.removeEventListener("beforeinstallprompt", gererEvenement);
  }, []);

  useEffect(() => {
    const dejaRefuseIos = localStorage.getItem(CLE_STOCKAGE_REFUS_IOS);
    if (dejaRefuseIos || !estIosSafari()) return;

    const idToast = toast("Installez CV Auto sur votre iPhone", {
      description: 'Appuyez sur Partager, puis "Sur l\'écran d\'accueil".',
      duration: Infinity,
      cancel: {
        label: "Plus tard",
        onClick: () => {
          localStorage.setItem(CLE_STOCKAGE_REFUS_IOS, "1");
        },
      },
    });

    return () => {
      toast.dismiss(idToast);
    };
  }, []);

  useEffect(() => {
    if (!evenementInstallation) return;

    const idToast = toast("Installez CV Auto sur votre appareil", {
      description: "Accédez à votre CV plus rapidement depuis l'écran d'accueil.",
      duration: Infinity,
      action: {
        label: "Installer",
        onClick: async () => {
          await evenementInstallation.prompt();
          const choix = await evenementInstallation.userChoice;
          if (choix.outcome === "dismissed") {
            localStorage.setItem(CLE_STOCKAGE_REFUS, "1");
          }
          setEvenementInstallation(null);
        },
      },
      cancel: {
        label: "Plus tard",
        onClick: () => {
          localStorage.setItem(CLE_STOCKAGE_REFUS, "1");
          setEvenementInstallation(null);
        },
      },
    });

    return () => {
      toast.dismiss(idToast);
    };
  }, [evenementInstallation]);

  return null;
}