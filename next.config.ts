import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Empêche Next.js d'essayer de bundler ces paquets natifs/binaires
  // via webpack — ils doivent rester de vrais modules Node chargés à
  // l'exécution (nécessaire pour puppeteer-core + @sparticuz/chromium).
  serverExternalPackages: ["puppeteer-core", "@sparticuz/chromium", "puppeteer"],
};

export default nextConfig;