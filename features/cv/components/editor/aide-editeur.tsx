"use client";

import { useState } from "react";
import { HelpCircle, X, Download, Plus, Trash2, Eye, EyeOff, Sparkles, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AideEditeur() {
  const [ouvert, setOuvert] = useState(false);

  return (
    <Dialog open={ouvert} onOpenChange={setOuvert}>
      <DialogTrigger className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
        <HelpCircle className="w-4 h-4" />
        Aide
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <HelpCircle className="w-6 h-6 text-primary" />
            Guide d'utilisation simple
          </DialogTitle>
          <DialogDescription>
            Suivez ces étapes pour créer votre CV facilement
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Section 1: Informations personnelles */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                1
              </div>
              <h3 className="font-semibold text-lg">Vos informations personnelles</h3>
            </div>
            <div className="pl-10 space-y-2 text-sm text-muted-foreground">
              <p>• Remplissez votre <strong>nom</strong>, <strong>prénom</strong> et <strong>titre du poste</strong> souhaité</p>
              <p>• Ajoutez votre <strong>email</strong> et <strong>téléphone</strong> pour être contacté</p>
              <p>• Écrivez un <strong>résumé</strong> court de qui vous êtes (2-3 phrases)</p>
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <p className="text-blue-800 text-xs">
                  <strong>Astuce :</strong> Cliquez sur "Suggestions IA" pour obtenir des idées de compétences automatiquement
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Ajouter des sections */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                2
              </div>
              <h3 className="font-semibold text-lg">Ajouter des sections</h3>
            </div>
            <div className="pl-10 space-y-2 text-sm text-muted-foreground">
              <p>• Cliquez sur le bouton <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs border rounded-md"><Plus className="w-3 h-3" />Ajouter une section</span></p>
              <p>• Choisissez le type de section dans la liste :</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Expérience professionnelle</strong> : vos jobs précédents</li>
                <li><strong>Formation</strong> : vos diplômes et études</li>
                <li><strong>Compétences</strong> : ce que vous savez faire</li>
                <li><strong>Langues</strong> : les langues que vous parlez</li>
                <li><strong>Projets</strong> : vos projets personnels ou professionnels</li>
              </ul>
            </div>
          </div>

          {/* Section 3: Remplir les sections */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                3
              </div>
              <h3 className="font-semibold text-lg">Remplir chaque section</h3>
            </div>
            <div className="pl-10 space-y-3 text-sm text-muted-foreground">
              <p>Pour chaque section, utilisez les boutons :</p>
              
              <div className="grid gap-2">
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <Plus className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-purple-900">Bouton "Ajouter"</p>
                    <p className="text-xs text-purple-700">Cliquez pour ajouter un nouvel élément (une expérience, une formation, etc.)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <Eye className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-900">Bouton "Œil"</p>
                    <p className="text-xs text-orange-700">Cliquez pour masquer ou afficher la section dans le CV final</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <Trash2 className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">Bouton "Poubelle"</p>
                    <p className="text-xs text-red-700">Cliquez pour supprimer toute la section (attention, irréversible !)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Personnalisation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold">
                4
              </div>
              <h3 className="font-semibold text-lg">Personnaliser votre CV</h3>
            </div>
            <div className="pl-10 space-y-2 text-sm text-muted-foreground">
              <p>• Choisissez un <strong>template</strong> (modèle) de CV dans le menu à droite</p>
              <p>• Changez la <strong>couleur</strong> pour personnaliser l'apparence</p>
              <p>• Sélectionnez une <strong>police</strong> d'écriture que vous aimez</p>
              <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <ImageIcon className="w-4 h-4 text-yellow-600" />
                <p className="text-yellow-800 text-xs">
                  <strong>Premium :</strong> Vous pouvez ajouter votre photo de profil
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Téléchargement - AVERTISSEMENT */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                5
              </div>
              <h3 className="font-semibold text-lg text-red-600">⚠️ Télécharger votre CV</h3>
            </div>
            <div className="pl-10 space-y-2 text-sm">
              <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg">
                <div className="flex items-start gap-3">
                  <Download className="w-6 h-6 text-red-600 shrink-0" />
                  <div className="space-y-2">
                    <p className="font-bold text-red-900">ATTENTION - Quota limité !</p>
                    <p className="text-red-800">
                      Vous avez un <strong>nombre limité de téléchargements PDF</strong>. 
                      Ne téléchargez pas votre CV à chaque petite modification !
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-red-700 ml-2">
                      <li>Vérifiez bien votre CV avant de télécharger</li>
                      <li>Utilisez l'aperçu à droite pour voir le résultat</li>
                      <li>Téléchargez uniquement quand vous êtes satisfait</li>
                    </ul>
                    <p className="text-red-700 font-medium mt-2">
                      💡 Conseil : Faites toutes vos modifications d'abord, puis téléchargez une seule fois à la fin.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Résumé rapide */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              En résumé, c'est facile :
            </h4>
            <ol className="text-sm space-y-1 text-muted-foreground">
              <li>1. Remplissez vos informations</li>
              <li>2. Ajoutez les sections nécessaires</li>
              <li>3. Remplissez chaque section avec vos infos</li>
              <li>4. Choisissez votre style (template, couleur, police)</li>
              <li>5. Vérifiez le résultat dans l'aperçu</li>
              <li>6. Téléchargez SEULEMENT quand vous êtes satisfait</li>
            </ol>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => setOuvert(false)}>
            J'ai compris, merci !
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
