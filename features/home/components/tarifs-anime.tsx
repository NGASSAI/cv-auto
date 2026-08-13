"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const FORMULES_PREMIUM = [
  {
    nom: "Mensuel",
    prix: "1500 FCFA",
    duree: "30 jours",
    description: "Accès Premium complet pendant 1 mois",
    populaire: true,
  },
  {
    nom: "2 semaines",
    prix: "1000 FCFA",
    duree: "14 jours",
    description: "Accès Premium pour une courte période",
    populaire: false,
  },
  {
    nom: "3 jours",
    prix: "600 FCFA",
    duree: "3 jours",
    description: "Testez Premium pour quelques jours",
    populaire: false,
  },
];

export function TarifsAnime() {
  return (
    <section id="tarifs" className="px-6 py-16 md:px-12 bg-muted/30">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-center text-2xl font-medium" style={{ fontFamily: "var(--font-display)" }}>
          Formules Premium
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-ardoise">
          Choisissez la formule qui correspond à vos besoins
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3"
      >
        {FORMULES_PREMIUM.map((formule, index) => (
          <motion.div
            key={formule.nom}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -10 }}
            className={`rounded-xl border p-6 transition-all duration-300 ${
              formule.populaire
                ? "border-primary bg-primary/5 shadow-lg hover:shadow-xl"
                : "border-ardoise/15 bg-papier shadow-sm hover:shadow-md"
            }`}
          >
            {formule.populaire && (
              <div className="text-center mb-4">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-primary text-white rounded-full animate-pulse">
                  Plus populaire
                </span>
              </div>
            )}
            <h3 className="text-xl font-semibold text-center">{formule.nom}</h3>
            <div className="mt-2 text-center">
              <span className="text-3xl font-bold" style={{ color: "#E8992D" }}>
                {formule.prix}
              </span>
            </div>
            <p className="mt-1 text-center text-sm text-ardoise">{formule.duree}</p>
            <p className="mt-4 text-sm text-center">{formule.description}</p>
            <div className="mt-6">
              <Link
                href="/inscription"
                className="block w-full text-center py-2 rounded-full bg-primary text-white text-sm font-medium hover:opacity-90 hover:scale-105 transition-all duration-300"
              >
                Commencer
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
