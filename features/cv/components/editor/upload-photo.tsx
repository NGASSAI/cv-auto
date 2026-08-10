"use client";

import { useRef, useState } from "react";
import { Camera, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useEditeurCVStore } from "@/features/cv/stores/cv-editor.store";

const TAILLE_MAX_PIXELS = 400;
const QUALITE_JPEG = 0.8;

/**
 * Redimensionne et recadre une image en carré via un canvas,
 * puis retourne le résultat en base64 (JPEG compressé).
 * Évite de stocker des images énormes en base de données.
 */
function compresserImage(fichier: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const lecteur = new FileReader();
    lecteur.onload = (evenement) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = TAILLE_MAX_PIXELS;
        canvas.height = TAILLE_MAX_PIXELS;
        const contexte = canvas.getContext("2d");
        if (!contexte) {
          reject(new Error("Impossible de traiter l'image"));
          return;
        }

        // Recadrage carré centré (crop "cover")
        const tailleSource = Math.min(image.width, image.height);
        const decalageX = (image.width - tailleSource) / 2;
        const decalageY = (image.height - tailleSource) / 2;

        contexte.drawImage(
          image,
          decalageX, decalageY, tailleSource, tailleSource,
          0, 0, TAILLE_MAX_PIXELS, TAILLE_MAX_PIXELS
        );

        resolve(canvas.toDataURL("image/jpeg", QUALITE_JPEG));
      };
      image.onerror = () => reject(new Error("Image invalide"));
      image.src = evenement.target?.result as string;
    };
    lecteur.onerror = () => reject(new Error("Impossible de lire le fichier"));
    lecteur.readAsDataURL(fichier);
  });
}

export function UploadPhoto() {
  const cv = useEditeurCVStore((etat) => etat.cv);
  const mettreAJourInformations = useEditeurCVStore((etat) => etat.mettreAJourInformations);
  const inputRef = useRef<HTMLInputElement>(null);
  const [enCours, setEnCours] = useState(false);

  if (!cv) return null;

  async function gererSelection(evenement: React.ChangeEvent<HTMLInputElement>) {
    const fichier = evenement.target.files?.[0];
    if (!fichier) return;

    if (!fichier.type.startsWith("image/")) {
      toast.error("Merci de choisir un fichier image");
      return;
    }

    if (fichier.size > 8 * 1024 * 1024) {
      toast.error("L'image est trop volumineuse (max 8 Mo)");
      return;
    }

    setEnCours(true);
    try {
      const base64 = await compresserImage(fichier);
      mettreAJourInformations("photoUrl", base64);
    } catch {
      toast.error("Impossible de traiter cette image");
    } finally {
      setEnCours(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function retirerPhoto() {
    mettreAJourInformations("photoUrl", "");
  }

  return (
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-muted overflow-hidden flex items-center justify-center shrink-0 border border-border">
        {cv.informations.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- data URI base64, next/image n'apporte rien ici
          <img src={cv.informations.photoUrl} alt="Photo de profil" className="w-full h-full object-cover" />
        ) : (
          <Camera className="w-5 h-5 text-muted-foreground" />
        )}
      </div>

      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={gererSelection}
          className="hidden"
          id="upload-photo-input"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={enCours}
          onClick={() => inputRef.current?.click()}
        >
          {enCours ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
          {cv.informations.photoUrl ? "Changer" : "Ajouter une photo"}
        </Button>

        {cv.informations.photoUrl && (
          <Button type="button" variant="ghost" size="sm" onClick={retirerPhoto}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}