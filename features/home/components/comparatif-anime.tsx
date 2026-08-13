"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const AVANTAGES_GRATUIT = [
  "4 modèles professionnels",
  "Personnalisation de la couleur d'accent",
  "Export PDF illimité",
  "Sections et expériences illimitées",
];

const AVANTAGES_PREMIUM = [
  "3 modèles premium exclusifs",
  "6 polices au choix",
  "Alignement et taille du texte réglables",
  "Photo de profil sur votre CV",
];

export function ComparatifAnime() {
  return (
    <section className="bg-encre/[0.03] px-6 py-16 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-center text-2xl font-medium" style={{ fontFamily: "var(--font-display)" }}>
          Gratuit ou Premium
        </h2>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mx-auto mt-10 grid max-w-3xl gap-6 md:grid-cols-2"
      >
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl border border-ardoise/15 bg-papier p-7 shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-semibold">Gratuit</h3>
          <p className="mt-1 text-sm text-ardoise">Pour créer un CV professionnel dès maintenant.</p>
          <ul className="mt-5 flex flex-col gap-3 text-sm">
            {AVANTAGES_GRATUIT.map((avantage, index) => (
              <motion.li
                key={avantage}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start gap-2"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                {avantage}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl border-2 p-7" style={{ borderColor: "#E8992D", backgroundColor: "#E8992D0D" }}
        >
          <h3 className="text-lg font-semibold" style={{ color: "#E8992D" }}>
            Premium
          </h3>
          <p className="mt-1 text-sm text-ardoise">Pour un CV encore plus distinctif.</p>
          <ul className="mt-5 flex flex-col gap-3 text-sm">
            {AVANTAGES_PREMIUM.map((avantage, index) => (
              <motion.li
                key={avantage}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start gap-2"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: "#E8992D" }} />
                {avantage}
              </motion.li>
            ))}
          </ul>
          <div className="mt-4">
            <Link
              href="#tarifs"
              className="text-sm font-medium inline-flex items-center gap-1" style={{ color: "#E8992D" }}
            >
              Voir les formules →
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
