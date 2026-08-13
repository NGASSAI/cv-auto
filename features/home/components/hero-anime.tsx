"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface HeroAnimeProps {
  titre: string;
  accroche: string;
}

export function HeroAnime({ titre, accroche }: HeroAnimeProps) {
  return (
    <section className="px-6 py-16 text-center md:px-12 md:py-24 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1
          className="mx-auto max-w-3xl text-4xl font-medium leading-tight md:text-5xl bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {titre}
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mx-auto mt-5 max-w-xl text-ardoise"
        >
          {accroche}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-8 flex flex-col items-center gap-3"
        >
          <Link
            href="/inscription"
            className="rounded-full bg-primary px-7 py-3 text-sm font-medium text-white hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Créer mon CV gratuitement
          </Link>
          <div className="flex gap-4">
            <a href="#modeles" className="text-sm font-medium text-ardoise underline-offset-4 hover:underline hover:text-primary transition-colors">
              Voir les modèles ↓
            </a>
            <a href="#tarifs" className="text-sm font-medium text-ardoise underline-offset-4 hover:underline hover:text-primary transition-colors">
              Voir les tarifs ↓
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
