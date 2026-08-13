import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { obtenirParametresSite } from "@/features/admin/api/parametres.service";
import { HeroAnime } from "@/features/home/components/hero-anime";
import { ModelesAnime } from "@/features/home/components/modeles-anime";
import { ComparatifAnime } from "@/features/home/components/comparatif-anime";
import { TarifsAnime } from "@/features/home/components/tarifs-anime";

const ETAPES = [
  { numero: "01", titre: "Créez votre compte", description: "Inscription gratuite en moins d'une minute." },
  { numero: "02", titre: "Remplissez votre CV", description: "Renseignez vos informations et personnalisez le design." },
  { numero: "03", titre: "Téléchargez en PDF", description: "Exportez votre CV prêt à envoyer, à tout moment." },
];

export default async function PageAccueil() {
  let session = null;
  let estConnecte = false;

  try {
    session = await getServerSession(authOptions);
    estConnecte = !!session;
  } catch {
    // En cas d'erreur NextAuth, on considère l'utilisateur non connecté
    // plutôt que de faire planter toute la page
    estConnecte = false;
  }

  let parametres;
  try {
    parametres = await obtenirParametresSite();
  } catch {
    // En cas d'erreur DB, on utilise les paramètres par défaut
    parametres = {
      titreAccueil: null,
      accrocheAccueil: null,
    };
  }

  const titre = parametres.titreAccueil || "Créez un CV qui ouvre des portes";
  const accroche =
    parametres.accrocheAccueil ||
    "Des modèles professionnels, une personnalisation soignée, et un export PDF prêt à envoyer — en quelques minutes.";

  return (
    <div className="min-h-screen bg-papier text-encre">
      {/* En-tête */}
      <header className="flex items-center justify-between px-4 py-4 md:px-12">
        <Link href="/" className="font-display text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>
          CV Auto
        </Link>
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link href="/connexion" className="text-xs sm:text-sm font-medium text-ardoise hover:text-encre">
              Connexion
            </Link>
            <Link
              href="/inscription"
              className="rounded-full bg-primary px-3 py-1.5 text-xs sm:px-5 sm:py-2 sm:text-sm font-medium text-white hover:opacity-90"
            >
              Créer mon CV
            </Link>
          </nav>
      </header>

      <HeroAnime titre={titre} accroche={accroche} />
      <ModelesAnime />
      <ComparatifAnime />
      <TarifsAnime />

      {/* Comment ça marche */}
      <section className="px-6 py-16 md:px-12">
        <h2 className="text-center text-2xl font-medium" style={{ fontFamily: "var(--font-display)" }}>
          Comment ça marche
        </h2>
        <div className="mx-auto mt-10 grid max-w-3xl gap-8 md:grid-cols-3">
          {ETAPES.map((etape) => (
            <div key={etape.numero} className="text-center">
              <span className="text-3xl font-medium" style={{ fontFamily: "var(--font-display)", color: "#E8992D" }}>
                {etape.numero}
              </span>
              <h3 className="mt-2 text-sm font-semibold">{etape.titre}</h3>
              <p className="mt-1 text-xs text-ardoise">{etape.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pied de page */}
      <footer className="border-t border-ardoise/10 px-6 py-6 text-center text-xs text-ardoise md:px-12">
        &copy; {new Date().getFullYear()} ddsNG. Tous droits réservés.
      </footer>
    </div>
  );
}
