import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { listerTemplates } from "@/features/cv/components/templates/registre-templates";
import { obtenirParametresSite } from "@/features/admin/api/parametres.service";
import type {
  InformationsCVAffichage,
  SectionCVAffichage,
} from "@/features/cv/components/templates/types";

const INFORMATIONS_EXEMPLE: InformationsCVAffichage = {
  prenom: "Nathan",
  nom: "Koffi",
  titrePoste: "Chef de Projet Digital",
  email: "amina.koffi@email.com",
  telephone: "+242 06 681 77 26",
  adresse: "Brazzaville, Congo",
  photoUrl: null,
  resume:
    "Chef de projet digital avec 6 ans d'expérience dans le pilotage de produits web et la coordination d'équipes pluridisciplinaires.",
};

const SECTIONS_EXEMPLE: SectionCVAffichage[] = [
  {
    id: "exp",
    type: "EXPERIENCE",
    titre: "Expérience",
    estVisible: true,
    items: [
      {
        id: "exp1",
        titre: "Cheffe de Projet Digital",
        sousTitre: "Atlas Digital",
        lieu: "Brazzaville",
        dateDebut: "2022-01-01",
        dateFin: null,
        description: "Pilotage de la refonte de la plateforme e-commerce, gestion d'une équipe de 5 personnes.",
        donneesJson: null,
      },
      {
        id: "exp2",
        titre: "Chargée de Projet",
        sousTitre: "NovaTech",
        lieu: "Pointe-Noire",
        dateDebut: "2019-03-01",
        dateFin: "2021-12-01",
        description: "Coordination de projets clients et suivi budgétaire.",
        donneesJson: null,
      },
    ],
  },
  {
    id: "for",
    type: "FORMATION",
    titre: "Formation",
    estVisible: true,
    items: [
      {
        id: "for1",
        titre: "Master en Management de Projet",
        sousTitre: "Université Marien Ngouabi",
        lieu: "Brazzaville",
        dateDebut: "2016-09-01",
        dateFin: "2018-06-01",
        description: null,
        donneesJson: null,
      },
    ],
  },
  {
    id: "comp",
    type: "COMPETENCES",
    titre: "Compétences",
    estVisible: true,
    items: [
      { id: "c1", titre: "Gestion de projet", sousTitre: null, lieu: null, dateDebut: null, dateFin: null, description: null, donneesJson: { niveau: 90 } },
      { id: "c2", titre: "Product Management", sousTitre: null, lieu: null, dateDebut: null, dateFin: null, description: null, donneesJson: { niveau: 80 } },
      { id: "c3", titre: "Agile / Scrum", sousTitre: null, lieu: null, dateDebut: null, dateFin: null, description: null, donneesJson: { niveau: 85 } },
    ],
  },
  {
    id: "lang",
    type: "LANGUES",
    titre: "Langues",
    estVisible: true,
    items: [
      { id: "l1", titre: "Français", sousTitre: "Courant", lieu: null, dateDebut: null, dateFin: null, description: null, donneesJson: null },
      { id: "l2", titre: "Anglais", sousTitre: "Professionnel", lieu: null, dateDebut: null, dateFin: null, description: null, donneesJson: null },
    ],
  },
  {
    id: "int",
    type: "CENTRES_INTERET",
    titre: "Centres d'intérêt",
    estVisible: true,
    items: [
      { id: "i1", titre: "Photographie", sousTitre: null, lieu: null, dateDebut: null, dateFin: null, description: null, donneesJson: null },
      { id: "i2", titre: "Course à pied", sousTitre: null, lieu: null, dateDebut: null, dateFin: null, description: null, donneesJson: null },
    ],
  },
];

const PALETTE_APERCU = ["#E8992D", "#2D5A4A", "#1E5F8C", "#8B3A3A"];

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

  const templates = listerTemplates();

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
      <header className="flex items-center justify-between px-6 py-5 md:px-12">
        <Link href="/" className="font-display text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
          CV Auto
        </Link>
          <nav className="flex items-center gap-4">
            <Link href="/connexion" className="text-sm font-medium text-ardoise hover:text-encre">
              Connexion
            </Link>
            <Link
              href="/inscription"
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Créer mon CV
            </Link>
          </nav>
      </header>

      {/* Hero */}
      <section className="px-6 py-16 text-center md:px-12 md:py-24">
       <h1
          className="mx-auto max-w-3xl text-4xl font-medium leading-tight md:text-5xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {titre}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-ardoise">
          {accroche}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href="/inscription"
            className="rounded-full bg-primary px-7 py-3 text-sm font-medium text-white hover:opacity-90"
          >
            Créer mon CV gratuitement
          </Link>
          <a href="#modeles" className="text-sm font-medium text-ardoise underline-offset-4 hover:underline">
            Voir les modèles ↓
          </a>
        </div>
      </section>

      {/* Galerie des modèles */}
      <section id="modeles" className="px-6 py-16 md:px-12">
        <h2 className="text-center text-2xl font-medium" style={{ fontFamily: "var(--font-display)" }}>
          7 modèles, un style pour chaque profil
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-ardoise">
          4 modèles gratuits, 3 modèles premium plus riches visuellement.
        </p>
        <div className="mt-10 grid grid-cols-2 justify-items-center gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {templates.map((template, index) => {
            const Composant = template.composant;
            const couleur = PALETTE_APERCU[index % PALETTE_APERCU.length];
            const largeurApercu = 190;
            const largeurReelle = 800;
            const hauteurApercu = largeurApercu * (297 / 210);
            const hauteurReelle = largeurReelle * (297 / 210);
            const echelle = largeurApercu / largeurReelle;
            return (
              <div key={template.cle} className="flex flex-col items-center gap-2">
                <div
                  className="relative overflow-hidden rounded-lg border border-ardoise/15 shadow-sm"
                  style={{ width: largeurApercu, height: hauteurApercu }}
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
                      transform: `scale(${echelle})`,
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
                </div>
                <span className="text-xs font-medium">{template.nom}</span>
              </div>
            );
          })}
        </div>        
      </section>

      {/* Comparatif Gratuit / Premium */}
      <section className="bg-encre/[0.03] px-6 py-16 md:px-12">
        <h2 className="text-center text-2xl font-medium" style={{ fontFamily: "var(--font-display)" }}>
          Gratuit ou Premium
        </h2>
        <div className="mx-auto mt-10 grid max-w-3xl gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-ardoise/15 bg-papier p-7">
            <h3 className="text-lg font-semibold">Gratuit</h3>
            <p className="mt-1 text-sm text-ardoise">Pour créer un CV professionnel dès maintenant.</p>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              {AVANTAGES_GRATUIT.map((avantage) => (
                <li key={avantage} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                  {avantage}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border-2 p-7" style={{ borderColor: "#E8992D", backgroundColor: "#E8992D0D" }}>
            <h3 className="text-lg font-semibold" style={{ color: "#E8992D" }}>
              Premium
            </h3>
            <p className="mt-1 text-sm text-ardoise">Pour un CV encore plus distinctif.</p>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              {AVANTAGES_PREMIUM.map((avantage) => (
                <li key={avantage} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: "#E8992D" }} />
                  {avantage}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-ardoise">
              Le passage en Premium s&apos;active manuellement après votre demande depuis l&apos;application.
            </p>
          </div>
        </div>
      </section>

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