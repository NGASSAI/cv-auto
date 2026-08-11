"use client";

import { useState } from "react";
import { PaletteCouleurSite } from "./palette-couleur-site";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ParametresSite {
  modeMaintenance: boolean;
  messageMaintenance: string | null;
  numeroWhatsapp: string | null;
  titreAccueil: string | null;
  descriptionAccueil: string | null;
  accrocheAccueil: string | null;
  couleurPrimaire: string | null;
  couleurSecondaire: string | null;
  emailSupport: string | null;
  inscriptionActivee: boolean;
  exportPdfActif: boolean;
}

export function PanneauParametres({ parametresInitiaux }: { parametresInitiaux: ParametresSite }) {
  const [parametres, setParametres] = useState(parametresInitiaux);
  const [enCours, setEnCours] = useState(false);

  function majChamp<K extends keyof ParametresSite>(champ: K, valeur: ParametresSite[K]) {
    setParametres((precedent) => ({ ...precedent, [champ]: valeur }));
  }

  async function enregistrer(donneesPartielles?: Partial<ParametresSite>) {
    setEnCours(true);
    const aEnvoyer = donneesPartielles ?? parametres;

    try {
      const reponse = await fetch("/api/admin/parametres", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aEnvoyer),
      });

      if (!reponse.ok) {
        toast.error("Impossible d'enregistrer les paramètres");
        return;
      }

      toast.success("Paramètres enregistrés");
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setEnCours(false);
    }
  }

  return (
   <Tabs defaultValue="general" className="max-w-2xl w-full">
      <TabsList className="w-full flex-wrap h-auto gap-1 p-1.5 justify-start">
        <TabsTrigger value="general">Général</TabsTrigger>
        <TabsTrigger value="accueil">Page d&apos;accueil</TabsTrigger>
        <TabsTrigger value="branding">Apparence</TabsTrigger>
        <TabsTrigger value="fonctionnalites">Fonctionnalités</TabsTrigger>
        <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
      </TabsList>

      <TabsContent value="branding" className="space-y-6 mt-6 border border-border rounded-lg p-5 sm:p-6">
        <div className="space-y-3">
          <Label>Couleur principale du site</Label>
          <p className="text-xs text-muted-foreground -mt-1">
            Utilisée pour les boutons, liens et accents visuels sur tout le site
          </p>
          <PaletteCouleurSite
            valeur={parametres.couleurPrimaire ?? "#E8992D"}
            onChange={(couleur: string) => majChamp("couleurPrimaire", couleur)}
          />
        </div>

        <div className="space-y-3">
          <Label>Couleur secondaire</Label>
          <p className="text-xs text-muted-foreground -mt-1">
            Utilisée pour les éléments complémentaires (liens, badges de succès)
          </p>
          <PaletteCouleurSite
            valeur={parametres.couleurSecondaire ?? "#2D5A4A"}
            onChange={(couleur: string) => majChamp("couleurSecondaire", couleur)}
          />
        </div>

        <Button size="sm" disabled={enCours} onClick={() => enregistrer()}>
          Enregistrer
        </Button>
      </TabsContent>
      <TabsContent value="accueil" className="space-y-5 mt-6 border border-border rounded-lg p-5 sm:p-6">
        <div className="space-y-2">
          <Label>Titre principal</Label>
          <Input
            placeholder="Créez un CV qui vous ressemble"
            value={parametres.titreAccueil ?? ""}
            onChange={(e) => majChamp("titreAccueil", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Accroche courte</Label>
          <Input
            placeholder="Un CV professionnel en quelques minutes"
            value={parametres.accrocheAccueil ?? ""}
            onChange={(e) => majChamp("accrocheAccueil", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            rows={4}
            placeholder="Description plus longue de l'application..."
            value={parametres.descriptionAccueil ?? ""}
            onChange={(e) => majChamp("descriptionAccueil", e.target.value)}
          />
        </div>
        <Button size="sm" disabled={enCours} onClick={() => enregistrer()}>
          Enregistrer
        </Button>
      </TabsContent>

      <TabsContent value="branding" className="space-y-5 mt-6 border border-border rounded-lg p-5 sm:p-6">
        <div className="space-y-2">
          <Label>Couleur primaire</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={parametres.couleurPrimaire ?? "#E8992D"}
              onChange={(e) => majChamp("couleurPrimaire", e.target.value)}
              className="w-10 h-10 rounded border border-border cursor-pointer"
            />
            <Input
              value={parametres.couleurPrimaire ?? ""}
              onChange={(e) => majChamp("couleurPrimaire", e.target.value)}
              placeholder="#E8992D"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Couleur secondaire</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={parametres.couleurSecondaire ?? "#2D5A4A"}
              onChange={(e) => majChamp("couleurSecondaire", e.target.value)}
              className="w-10 h-10 rounded border border-border cursor-pointer"
            />
            <Input
              value={parametres.couleurSecondaire ?? ""}
              onChange={(e) => majChamp("couleurSecondaire", e.target.value)}
              placeholder="#2D5A4A"
            />
          </div>
        </div>
        <Button size="sm" disabled={enCours} onClick={() => enregistrer()}>
          Enregistrer
        </Button>
      </TabsContent>

      <TabsContent value="fonctionnalites" className="space-y-5 mt-6 border border-border rounded-lg p-5 sm:p-6">
        <div className="flex items-center justify-between border border-border rounded-lg p-4">
          <div>
            <p className="font-medium text-sm">Inscriptions ouvertes</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Désactive pour bloquer temporairement les nouvelles inscriptions
            </p>
          </div>
          <Switch
            checked={parametres.inscriptionActivee}
            disabled={enCours}
            onCheckedChange={(coche: boolean) => {
              majChamp("inscriptionActivee", coche);
              enregistrer({ inscriptionActivee: coche });
            }}
          />
        </div>
        <div className="flex items-center justify-between border border-border rounded-lg p-4">
          <div>
            <p className="font-medium text-sm">Export PDF</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Désactive pour bloquer temporairement le téléchargement des CV
            </p>
          </div>
          <Switch
            checked={parametres.exportPdfActif}
            disabled={enCours}
            onCheckedChange={(coche: boolean) => {
              majChamp("exportPdfActif", coche);
              enregistrer({ exportPdfActif: coche });
            }}
          />
        </div>
      </TabsContent>

      <TabsContent value="maintenance" className="space-y-5 mt-6 border border-border rounded-lg p-5 sm:p-6">
        <div className="flex items-center justify-between border border-border rounded-lg p-4">
          <div>
            <p className="font-medium text-sm">Mode maintenance</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Bloque l&apos;accès au site pour tous, sauf toi
            </p>
          </div>
          <Switch
            checked={parametres.modeMaintenance}
            disabled={enCours}
            onCheckedChange={(coche: boolean) => {
              majChamp("modeMaintenance", coche);
              enregistrer({ modeMaintenance: coche });
            }}
          />
        </div>
        <div className="space-y-2">
          <Label>Message affiché aux visiteurs</Label>
          <Textarea
            rows={3}
            value={parametres.messageMaintenance ?? ""}
            onChange={(e) => majChamp("messageMaintenance", e.target.value)}
            placeholder="Le site est en maintenance, merci de revenir plus tard..."
          />
          <Button
            size="sm"
            variant="outline"
            disabled={enCours}
            onClick={() => enregistrer({ messageMaintenance: parametres.messageMaintenance })}
          >
            Enregistrer le message
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}