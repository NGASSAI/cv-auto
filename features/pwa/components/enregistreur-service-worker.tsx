"use client";

import { useEffect } from "react";

export function EnregistreurServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((erreur) => {
        console.error("Échec de l'enregistrement du service worker :", erreur);
      });
    }
  }, []);

  return null;
}