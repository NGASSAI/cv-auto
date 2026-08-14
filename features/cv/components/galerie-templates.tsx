"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Star } from "lucide-react";
import { listerTemplates } from "@/features/cv/components/templates/registre-templates";
import { ModaleApercuTemplate } from "@/features/cv/components/modale-apercu-template";
import { INFORMATIONS_EXEMPLE, SECTIONS_EXEMPLE } from "@/features/cv/lib/donnees-exemple";
import { Button } from "@/components/ui/button";

const PALETTE_APERCU = ["#E8992D", "#2D5A4A", "#1E5F8C", "#8B3A3A", "#6B21A8", "#0891B2"];

export function GalerieTemplates() {
  const [templateSelectionne, setTemplateSelectionne] = useState<any>(null);
  const templates = listerTemplates();

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
        {templates.map((template, index) => {
          const Composant = template.composant;
          const couleur = PALETTE_APERCU[index % PALETTE_APERCU.length];
          const largeurApercuMobile = 200;
          const largeurApercuDesktop = 260;
          const largeurReelle = 800;
          const hauteurApercuMobile = largeurApercuMobile * (297 / 210);
          const hauteurApercuDesktop = largeurApercuDesktop * (297 / 210);
          const hauteurReelle = largeurReelle * (297 / 210);
          const echelleMobile = largeurApercuMobile / largeurReelle;
          const echelleDesktop = largeurApercuDesktop / largeurReelle;
          
          return (
            <motion.div
              key={template.cle}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
              className="flex flex-col items-center gap-4 w-full max-w-[280px]"
            >
              <motion.div
                className="relative group"
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <motion.button
                  onClick={() => setTemplateSelectionne(template)}
                  whileTap={{ scale: 0.97 }}
                  className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-transparent hover:border-primary/30"
                  style={{ 
                    width: largeurApercuDesktop, 
                    height: hauteurApercuDesktop,
                    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
                  }}
                >
                  {template.estPremium && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute right-3 top-3 z-20 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 shadow-lg"
                    >
                      <Sparkles className="w-3 h-3 text-white" />
                      <span className="text-[10px] font-bold text-white tracking-wide">Premium</span>
                    </motion.div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
                  
                  <motion.div
                    className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  
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
                  
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <div className="bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-xl">
                      <span className="text-sm font-semibold text-slate-900">Aperçu</span>
                    </div>
                  </motion.div>
                </motion.button>
              </motion.div>
              
              <motion.div 
                className="text-center space-y-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.08 + 0.2 }}
              >
                <h3 className="text-sm font-semibold text-slate-800">{template.nom}</h3>
                <div className="flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-3 h-3 ${star <= 4 ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {templateSelectionne && (
        <ModaleApercuTemplate
          ouvert={!!templateSelectionne}
          onFermer={() => setTemplateSelectionne(null)}
          template={templateSelectionne}
          couleur={PALETTE_APERCU[templates.indexOf(templateSelectionne) % PALETTE_APERCU.length]}
        />
      )}
    </>
  );
}
