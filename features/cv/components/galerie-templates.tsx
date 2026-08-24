"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { listerTemplates } from "@/features/cv/components/templates/registre-templates";
import { ModaleApercuTemplate } from "@/features/cv/components/modale-apercu-template";
import {
  INFORMATIONS_EXEMPLE,
  SECTIONS_EXEMPLE,
} from "@/features/cv/lib/donnees-exemple";

const PALETTE_APERCU = ["#E8992D", "#2D5A4A", "#1E5F8C", "#8B3A3A"];

export function GalerieTemplates() {
  const templates = listerTemplates();

  type Template = (typeof templates)[number];

  const [templateSelectionne, setTemplateSelectionne] =
    useState<Template | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 justify-items-center gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {templates.map((template, index) => {
          const Composant = template.composant;
          const couleur = PALETTE_APERCU[index % PALETTE_APERCU.length];

          const largeurApercuMobile = 190;
          const largeurApercuDesktop = 280;
          const largeurReelle = 800;

          const hauteurApercuMobile =
            largeurApercuMobile * (297 / 210);

          const hauteurApercuDesktop =
            largeurApercuDesktop * (297 / 210);

          const hauteurReelle = largeurReelle * (297 / 210);

          const echelleMobile =
            largeurApercuMobile / largeurReelle;

          const echelleDesktop =
            largeurApercuDesktop / largeurReelle;

          return (
            <motion.div
              key={template.cle}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center gap-2"
            >
              <motion.button
                onClick={() => setTemplateSelectionne(template)}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="relative block cursor-pointer overflow-hidden rounded-lg border border-ardoise/15 shadow-sm transition-all duration-300 hover:border-primary hover:shadow-xl md:hidden"
                style={{
                  width: largeurApercuMobile,
                  height: hauteurApercuMobile,
                }}
              >
                {template.estPremium && (
                  <span className="absolute right-1.5 top-1.5 z-10 rounded-full bg-primary px-2 py-0.5 text-[9px] font-medium text-white">
                    Premium
                  </span>
                )}

                <div
                  style={{
                    width: largeurReelle,
                    height: hauteurReelle,
                    transform: `scale(${echelleMobile})`,
                    transformOrigin: "top left",
                    overflow: "hidden",
                  }}
                >
                  <Composant
                    informations={INFORMATIONS_EXEMPLE}
                    sections={SECTIONS_EXEMPLE}
                    couleurAccent={couleur}
                    police="geist"
                    alignementTexte="gauche"
                    tailleTexte="moyenne"
                  />
                </div>
              </motion.button>

              <motion.button
                onClick={() => setTemplateSelectionne(template)}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="relative hidden cursor-pointer overflow-hidden rounded-lg border border-ardoise/15 shadow-sm transition-all duration-300 hover:border-primary hover:shadow-xl md:block"
                style={{
                  width: largeurApercuDesktop,
                  height: hauteurApercuDesktop,
                }}
              >
                {template.estPremium && (
                  <span className="absolute right-1.5 top-1.5 z-10 rounded-full bg-primary px-2 py-0.5 text-[9px] font-medium text-white">
                    Premium
                  </span>
                )}

                <div
                  style={{
                    width: largeurReelle,
                    height: hauteurReelle,
                    transform: `scale(${echelleDesktop})`,
                    transformOrigin: "top left",
                    overflow: "hidden",
                  }}
                >
                  <Composant
                    informations={INFORMATIONS_EXEMPLE}
                    sections={SECTIONS_EXEMPLE}
                    couleurAccent={couleur}
                    police="geist"
                    alignementTexte="gauche"
                    tailleTexte="moyenne"
                  />
                </div>
              </motion.button>

              <span className="text-xs text-ardoise">
                {template.nom}
              </span>
            </motion.div>
          );
        })}
      </div>

      {templateSelectionne && (
        <ModaleApercuTemplate
          ouvert={!!templateSelectionne}
          onFermer={() => setTemplateSelectionne(null)}
          template={templateSelectionne}
          couleur={
            PALETTE_APERCU[
              templates.indexOf(templateSelectionne) %
                PALETTE_APERCU.length
            ]
          }
        />
      )}
    </>
  );
}