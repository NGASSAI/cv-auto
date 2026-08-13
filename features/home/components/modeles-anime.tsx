"use client";

import { motion } from "framer-motion";
import { GalerieTemplates } from "@/features/cv/components/galerie-templates";

export function ModelesAnime() {
  return (
    <section id="modeles" className="px-6 py-16 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-center text-2xl font-medium" style={{ fontFamily: "var(--font-display)" }}>
          7 modèles, un style pour chaque profil
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-ardoise">
          4 modèles gratuits, 3 modèles premium plus riches visuellement.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-10"
      >
        <GalerieTemplates />
      </motion.div>
    </section>
  );
}
