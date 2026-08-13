// Base de données de suggestions IA basée sur les titres de poste
// Pour éviter les coûts d'API externe, on utilise une base locale enrichie

interface SuggestionsPoste {
  competences: string[];
  competences_specifiques: Record<string, string[]>;
  resume: string;
}

const BASE_DONNEES_SUGGESTIONS: Record<string, SuggestionsPoste> = {
  chef_projet: {
    competences: [
      "Gestion de projet",
      "Agile / Scrum",
      "Leadership",
      "Communication",
      "Gestion d'équipe",
      "Planification",
      "Gestion des risques",
      "Méthodologie",
      "Budgétisation",
      "Reporting",
    ],
    competences_specifiques: {
      informatique: ["Jira", "Trello", "Asana", "Git", "SDLC", "Méthode agile"],
      marketing: ["Google Analytics", "SEO", "SEA", "Marketing digital", "CRM"],
      construction: ["MS Project", "AutoCAD", "Gestion de chantier", "Planning"],
    },
    resume: "Chef de projet expérimenté avec une solide expertise en gestion de projets complexes. Capacité à mener des équipes pluridisciplinaires, à optimiser les processus et à livrer dans les délais. Forte aptitude à la communication et à la résolution de problèmes.",
  },
  
  developpeur: {
    competences: [
      "Développement web",
      "JavaScript / TypeScript",
      "React / Next.js",
      "Node.js",
      "Base de données",
      "Git",
      "API REST",
      "Architecture logicielle",
      "Testing",
      "Debugging",
    ],
    competences_specifiques: {
      frontend: ["React", "Vue.js", "Angular", "CSS/Tailwind", "Responsive design"],
      backend: ["Node.js", "Python", "Java", "PHP", "API", "Microservices"],
      fullstack: ["React", "Node.js", "MongoDB", "PostgreSQL", "DevOps"],
    },
    resume: "Développeur passionné avec expertise en développement d'applications web modernes. Capacité à créer des solutions performantes et évolutives, à travailler en équipe et à respecter les bonnes pratiques de développement. Orienté qualité et utilisateur.",
  },
  
  designer: {
    competences: [
      "Design graphique",
      "Adobe Creative Suite",
      "Figma",
      "UI/UX Design",
      "Direction artistique",
      "Branding",
      "Typographie",
      "Mise en page",
      "Créativité",
      "Gestion de projet créatif",
    ],
    competences_specifiques: {
      ui_ux: ["Figma", "Sketch", "Adobe XD", "Prototypage", "User research"],
      graphique: ["Photoshop", "Illustrator", "InDesign", "Branding", "Print"],
      web: ["Figma", "Tailwind CSS", "Responsive design", "Accessibility"],
    },
    resume: "Designer créatif avec une forte sensibilité esthétique et une excellente compréhension des besoins utilisateurs. Capacité à créer des identités visuelles cohérentes et des interfaces intuitives. Passionné par l'innovation et les tendances du design.",
  },
  
  commercial: {
    competences: [
      "Vente",
      "Négociation",
      "Relation client",
      "Communication",
      "Présentation",
      "Prospection",
      "Closing",
      "CRM",
      "Analyse de marché",
      "Suivi commercial",
    ],
    competences_specifiques: {
      b2b: ["Vente B2B", "Prospection", "Négociation", "Gestion de portefeuille"],
      b2c: ["Vente B2C", "Relation client", "Service client", "Fidélisation"],
      tech: ["Vente logiciels", "SaaS", "Présentation technique", "Demo"],
    },
    resume: "Commercial dynamique avec une forte capacité de persuasion et d'écoute active. Expert en identification des besoins clients et proposition de solutions adaptées. Orienté résultats et satisfaction client.",
  },
  
  marketing: {
    competences: [
      "Marketing digital",
      "SEO / SEA",
      "Social media",
      "Content marketing",
      "Email marketing",
      "Analytics",
      "Stratégie marketing",
      "Communication",
      "Brand management",
      "Campagnes publicitaires",
    ],
    competences_specifiques: {
      digital: ["Google Ads", "Facebook Ads", "SEO", "Analytics", "Growth hacking"],
      content: ["Rédaction", "Storytelling", "Social media", "Email marketing"],
      brand: ["Branding", "Positionnement", "Communication", "Image de marque"],
    },
    resume: "Marketing stratégique avec expertise en acquisition et fidélisation client. Capacité à développer des campagnes percutantes et à analyser les performances pour optimiser le ROI. Créatif et orienté données.",
  },
  
  ressources_humaines: {
    competences: [
      "Gestion RH",
      "Recrutement",
      "Formation",
      "Gestion des talents",
      "Relations employés",
      "Droit du travail",
      "Administration du personnel",
      "Communication interne",
      "Développement organisationnel",
      "Gestion de carrière",
    ],
    competences_specifiques: {
      recrutement: ["Entretien", "Assessment", "Onboarding", "Sourcing", "Coaching"],
      administration: ["Paie", "Contrats", "Droit du travail", "Administratif"],
      development: ["Formation", "GPEC", "Mobilité interne", "Performance"],
    },
    resume: "Professionnel RH avec expertise en recrutement et développement des talents. Capacité à créer un environnement de travail positif et à accompagner les collaborateurs dans leur évolution professionnelle. Orienté bien-être et performance.",
  },
  
  finance: {
    competences: [
      "Comptabilité",
      "Gestion budgétaire",
      "Analyse financière",
      "Reporting",
      "Planification financière",
      "Contrôle de gestion",
      "Audit",
      "Gestion de trésorerie",
      "Fiscalité",
      "Excel avancé",
    ],
    competences_specifiques: {
      comptabilite: ["Comptabilité générale", "Bilan", "Compte de résultat", "TVA"],
      controle: ["Reporting", "Budget", "Analyse des écarts", "KPI financiers"],
      finance: ["Trésorerie", "Investissement", "Financement", "Analyse de rentabilité"],
    },
    resume: "Financier rigoureux avec expertise en gestion budgétaire et analyse financière. Capacité à optimiser les coûts, à garantir la trésorerie et à fournir des rapports fiables. Orienté précision et conformité.",
  },
  
  general: {
    competences: [
      "Communication",
      "Travail en équipe",
      "Organisation",
      "Gestion du temps",
      "Résolution de problèmes",
      "Adaptabilité",
      "Autonomie",
      "Esprit critique",
      "Leadership",
      "Apprentissage continu",
    ],
    competences_specifiques: {},
    resume: "Professionnel motivé avec de solides compétences interpersonnelles et organisationnelles. Capacité à s'adapter rapidement aux nouveaux défis et à travailler efficacement en équipe. Orienté résultats et amélioration continue.",
  },
};

// Fonction pour trouver le titre de poste le plus proche
function trouverTitreProche(titre: string): string {
  const titreNormalise = titre.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "_");

  // Mots-clés pour chaque catégorie
  const motsCles: Record<string, string[]> = {
    chef_projet: ["chef", "projet", "project", "manager", "pm", "scrum", "agile"],
    developpeur: ["developpeur", "developer", "dev", "code", "software", "engineer", "fullstack", "frontend", "backend"],
    designer: ["designer", "design", "graphique", "ui", "ux", "artiste", "creative"],
    commercial: ["commercial", "vente", "sales", "account", "business", "representant"],
    marketing: ["marketing", "market", "communication", "com", "brand", "digital"],
    ressources_humaines: ["rh", "ressource", "humaine", "hr", "recrutement", "talent", "people"],
    finance: ["finance", "financier", "comptable", "compta", "audit", "budget", "treasurer"],
  };

  // Chercher la meilleure correspondance
  for (const [categorie, cles] of Object.entries(motsCles)) {
    for (const cle of cles) {
      if (titreNormalise.includes(cle)) {
        return categorie;
      }
    }
  }

  return "general";
}

// Fonction principale pour obtenir des suggestions
export function obtenirSuggestionsIA(titrePoste: string, domaine?: string): SuggestionsPoste {
  const categorie = trouverTitreProche(titrePoste);
  const suggestions = BASE_DONNEES_SUGGESTIONS[categorie] || BASE_DONNEES_SUGGESTIONS.general;

  // Si un domaine spécifique est demandé et disponible
  if (domaine && suggestions.competences_specifiques[domaine]) {
    return {
      ...suggestions,
      competences: suggestions.competences_specifiques[domaine],
    };
  }

  return suggestions;
}

// Fonction pour générer un résumé personnalisé
export function genererResumeIA(informations: {
  prenom: string | null;
  nom: string | null;
  titrePoste: string | null;
  experiences?: Array<{ titre: string; description?: string }>;
}): string {
  const suggestions = obtenirSuggestionsIA(informations.titrePoste || "");
  const nomComplet = [informations.prenom, informations.nom].filter(Boolean).join(" ") || "Professionnel";

  // Base du résumé
  let resume = `${nomComplet} avec expertise en ${informations.titrePoste || "son domaine"}. `;

  // Ajouter des compétences spécifiques basées sur les expériences
  if (informations.experiences && informations.experiences.length > 0) {
    const competencesDeduites = informations.experiences
      .map(exp => exp.description || "")
      .join(" ")
      .split(" ")
      .filter(mot => mot.length > 3)
      .slice(0, 5); // Prendre les 5 premiers mots significatifs

    if (competencesDeduites.length > 0) {
      resume += `Expérience en ${competencesDeduites.join(", ")}. `;
    }
  }

  // Ajouter les compétences de la base de données
  resume += `Compétences clés : ${suggestions.competences.slice(0, 5).join(", ")}. `;

  // Ajouter une phrase de conclusion
  resume += "Orienté résultats et satisfaction client.";

  return resume;
}

// Fonction pour obtenir des suggestions de compétences
export function obtenirSuggestionsCompetences(titrePoste: string, domaine?: string): string[] {
  const suggestions = obtenirSuggestionsIA(titrePoste, domaine);
  return suggestions.competences;
}

// Fonction pour obtenir les domaines disponibles pour un titre
export function obtenirDomainesDisponibles(titrePoste: string): string[] {
  const categorie = trouverTitreProche(titrePoste);
  const suggestions = BASE_DONNEES_SUGGESTIONS[categorie];
  return suggestions ? Object.keys(suggestions.competences_specifiques) : [];
}
