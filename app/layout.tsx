import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces, Merriweather, Playfair_Display, Manrope, Lora } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { obtenirParametresSite } from "@/features/admin/api/parametres.service";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  // Fraunces est une police variable avec un axe optique :
  // on charge une gamme de graisses pour les titres (400 à 600 suffit,
  // pas besoin d'aller jusqu'à 900 pour notre usage)
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "CV Builder",
  description: "Créez un CV professionnel en quelques minutes",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const parametres = await obtenirParametresSite();

  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${merriweather.variable} ${playfair.variable} ${manrope.variable} ${lora.variable} h-full antialiased`}
      style={{
        ...(parametres.couleurPrimaire && { "--primary": parametres.couleurPrimaire } as React.CSSProperties),
        ...(parametres.couleurSecondaire && { "--secondary": parametres.couleurSecondaire } as React.CSSProperties),
      }}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}