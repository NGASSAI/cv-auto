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

  data_scientist: {
    competences: [
      "Python",
      "Machine Learning",
      "Data Analysis",
      "SQL",
      "Statistiques",
      "Data Visualization",
      "Deep Learning",
      "Big Data",
      "NLP",
      "Modélisation",
    ],
    competences_specifiques: {
      ml: ["Scikit-learn", "TensorFlow", "PyTorch", "Keras", "XGBoost"],
      analytics: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "Jupyter"],
      engineering: ["Spark", "Hadoop", "Airflow", "Kafka", "Docker"],
    },
    resume: "Data Scientist passionné avec expertise en analyse de données et machine learning. Capacité à transformer des données complexes en insights actionnables et à développer des modèles prédictifs performants. Orienté innovation et précision.",
  },

  ingenieur: {
    competences: [
      "Ingénierie",
      "CAO / DAO",
      "Résolution de problèmes",
      "Analyse technique",
      "Gestion de projet",
      "Normes et réglementations",
      "Optimisation",
      "Maintenance",
      "Innovation",
      "Sécurité",
    ],
    competences_specifiques: {
      civil: ["AutoCAD", "Revit", "Calcul de structures", "Béton armé", "Génie civil"],
      mecanique: ["SolidWorks", "CATIA", "Mécanique des fluides", "Thermodynamique", "Fabrication"],
      logiciel: ["Architecture logicielle", "Design patterns", "Clean code", "DevOps", "Cloud"],
    },
    resume: "Ingénieur rigoureux avec solide expertise technique et capacité d'analyse. Compétent en conception, optimisation et gestion de projets complexes. Orienté qualité et innovation technique.",
  },

  consultant: {
    competences: [
      "Conseil stratégique",
      "Analyse organisationnelle",
      "Gestion de projet",
      "Communication",
      "Présentation",
      "Résolution de problèmes",
      "Adaptabilité",
      "Relation client",
      "Reporting",
      "Optimisation processus",
    ],
    competences_specifiques: {
      strategy: ["Stratégie d'entreprise", "Transformation digitale", "Business plan", "Due diligence"],
      management: ["Management de transition", "Organisation", "Processus", "Performance"],
      it: ["Conseil SI", "Architecture", "Digitalisation", "Cloud"],
    },
    resume: "Consultant stratégique avec expertise en transformation organisationnelle et optimisation des processus. Capacité à diagnostiquer les problématiques business et proposer des solutions innovantes. Orienté résultats et valeur ajoutée.",
  },

  enseignant: {
    competences: [
      "Pédagogie",
      "Communication",
      "Gestion de classe",
      "Préparation de cours",
      "Évaluation",
      "Adaptabilité",
      "Patience",
      "Animation",
      "Mentorat",
      "Technologies éducatives",
    ],
    competences_specifiques: {
      primaire: ["Pédagogie adaptée", "Apprentissage lecture", "Mathématiques élémentaires", "Créativité"],
      secondaire: ["Enseignement spécialisé", "Préparation examens", "Suivi élève", "Discipline"],
      superieur: ["Recherche", "Publication", "Encadrement thèse", "Conférence"],
    },
    resume: "Enseignant passionné avec solide expertise pédagogique et capacité d'adaptation aux différents publics. Compétent en conception de cours et évaluation des apprentissages. Orienté réussite des étudiants et innovation pédagogique.",
  },

  juriste: {
    competences: [
      "Droit",
      "Rédaction juridique",
      "Analyse contractuelle",
      "Conseil juridique",
      "Négociation",
      "Recherche juridique",
      "Plaidoirie",
      "Gestion des risques",
      "Conformité",
      "Rédaction d'actes",
    ],
    competences_specifiques: {
      corporate: ["Droit des sociétés", "Fusions-acquisitions", "Gouvernance", "Contrats"],
      labour: ["Droit du travail", "Relations sociales", "Négociation collective", "Conflits"],
      ip: ["Propriété intellectuelle", "Brevets", "Marques", "Licences"],
    },
    resume: "Juriste expérimenté avec expertise en conseil juridique et rédaction de contrats. Capacité à analyser les situations juridiques complexes et à proposer des solutions conformes. Orienté précision et protection des intérêts.",
  },

  chef_equipe: {
    competences: [
      "Leadership",
      "Gestion d'équipe",
      "Communication",
      "Motivation",
      "Développement des talents",
      "Résolution de conflits",
      "Planification",
      "Reporting",
      "Coaching",
      "Performance",
    ],
    competences_specifiques: {
      technique: ["Management technique", "Code review", "Architecture", "Best practices"],
      operationnel: ["Gestion opérationnelle", "KPI", "Processus", "Optimisation"],
      commercial: ["Management équipe vente", "Objectifs", "Formation", "Animation"],
    },
    resume: "Chef d'équipe dynamique avec solide expérience en management et développement des talents. Capacité à fédérer une équipe autour d'objectifs communs et à optimiser la performance collective. Orienté résultats et bien-être équipe.",
  },

  analyste: {
    competences: [
      "Analyse",
      "Recherche",
      "Data analysis",
      "Reporting",
      "Excel avancé",
      "Communication",
      "Résolution de problèmes",
      "Synthèse",
      "Présentation",
      "Modélisation",
    ],
    competences_specifiques: {
      business: ["Analyse business", "KPI", "Tableaux de bord", "Reporting financier"],
      data: ["SQL", "Python", "Statistiques", "Data visualization", "Machine Learning"],
      system: ["Analyse système", "Requirements", "UML", "Documentation"],
    },
    resume: "Analyste rigoureux avec expertise en analyse de données et synthèse d'informations. Capacité à transformer des données complexes en insights clairs et actionnables. Orienté précision et prise de décision éclairée.",
  },

  architecte: {
    competences: [
      "Architecture",
      "Design",
      "CAO / DAO",
      "Normes construction",
      "Gestion de projet",
      "Créativité",
      "Communication",
      "Résolution de problèmes",
      "Durabilité",
      "Innovation",
    ],
    competences_specifiques: {
      interieur: ["SketchUp", "AutoCAD", "3D", "Aménagement", "Matériaux"],
      paysagiste: ["Design extérieur", "Végétation", "Topographie", "Écologie", "Aménagement"],
      logiciel: ["Architecture logicielle", "Microservices", "Cloud", "DevOps", "Sécurité"],
    },
    resume: "Architecte créatif avec solide expertise en conception et design. Capacité à créer des espaces fonctionnels et esthétiques tout en respectant les contraintes techniques et réglementaires. Orienté innovation et durabilité.",
  },

  comptable: {
    competences: [
      "Comptabilité générale",
      "Comptabilité analytique",
      "Fiscalité",
      "Gestion budgétaire",
      "Audit",
      "Logiciels comptables",
      "Rigueur",
      "Analyse financière",
      "Reporting",
      "Conformité",
    ],
    competences_specifiques: {
      general: ["Sage", "QuickBooks", "Cegid", "Balance", "Déclarations fiscales"],
      audit: ["Audit interne", "Audit externe", "Normes IFRS", "Risk management", "Compliance"],
      gestion: ["Contrôle de gestion", "Budget", "Tableaux de bord", "KPI", "Forecast"],
    },
    resume: "Comptable rigoureux avec expertise en comptabilité, fiscalité et gestion financière. Capacité à garantir la conformité comptable et à fournir des analyses financières précises. Orienté précision et optimisation fiscale.",
  },

  redacteur: {
    competences: [
      "Rédaction",
      "Écriture",
      "Grammaire",
      "Orthographe",
      "Créativité",
      "SEO",
      "Recherche",
      "Adaptation ton",
      "Storytelling",
      "Communication",
    ],
    competences_specifiques: {
      web: ["SEO", "Rédaction web", "Blog", "Content marketing", "Copywriting"],
      technique: ["Documentation technique", "Manuels", "Tutoriels", "API docs", "Guides"],
      creatif: ["Storytelling", "Scénario", "Publicité", "Brand content", "Social media"],
    },
    resume: "Rédacteur talentueux avec expertise en création de contenu et adaptation de style. Capacité à produire des textes engageants et optimisés pour différents supports et audiences. Orienté qualité et impact.",
  },

  community_manager: {
    competences: [
      "Social media",
      "Community management",
      "Création de contenu",
      "Animation",
      "Modération",
      "Analytics",
      "SEO",
      "Copywriting",
      "Relation client",
      "Tendance",
    ],
    competences_specifiques: {
      social: ["Facebook", "Instagram", "Twitter", "LinkedIn", "TikTok"],
      content: ["Canva", "Adobe", "Vidéo", "Photo", "Design"],
      strategy: ["Stratégie social media", "KPI", "Reporting", "Influence", "Partenariats"],
    },
    resume: "Community Manager dynamique avec expertise en gestion de communautés et création de contenu. Capacité à engager les audiences et à développer la présence digitale des marques. Orienté croissance et interaction.",
  },

  graphiste: {
    competences: [
      "Design graphique",
      "Adobe Creative Suite",
      "Illustration",
      "Mise en page",
      "Typographie",
      "Créativité",
      "Direction artistique",
      "Branding",
      "Print",
      "Digital",
    ],
    competences_specifiques: {
      print: ["InDesign", "Illustrator", "Photoshop", "Prépresse", "Impression"],
      digital: ["Photoshop", "Illustrator", "XD", "Web design", "Social media"],
      motion: ["After Effects", "Premiere", "Animation", "Motion design", "Vidéo"],
    },
    resume: "Graphiste créatif avec solide expertise en design visuel et direction artistique. Capacité à créer des identités visuelles cohérentes et des communications percutantes. Orienté innovation et esthétique.",
  },

  secretaire: {
    competences: [
      "Secrétariat",
      "Gestion administrative",
      "Communication",
      "Organisation",
      "Rédaction",
      "Accueil",
      "Planning",
      "Logiciels bureautiques",
      "Discrétion",
      "Polyvalence",
    ],
    competences_specifiques: {
      medical: ["Terminologie médicale", "Gestion rendez-vous", "Dossier patient", "Confidentialité"],
      juridique: ["Terminologie juridique", "Rédaction actes", "Gestion dossiers", "Procédures"],
      general: ["Office", "Excel", "Outlook", "Gestion agenda", "Accueil"],
    },
    resume: "Secrétaire organisée avec expertise en gestion administrative et accueil. Capacité à assurer le bon fonctionnement du bureau et à gérer multiples tâches avec efficacité. Orienté service et professionnalisme.",
  },

  technicien: {
    competences: [
      "Technique",
      "Maintenance",
      "Dépannage",
      "Diagnostic",
      "Résolution de problèmes",
      "Sécurité",
      "Documentation",
      "Communication",
      "Adaptabilité",
      "Précision",
    ],
    competences_specifiques: {
      informatique: ["Hardware", "Software", "Réseau", "Windows", "Linux", "Mac"],
      industriel: ["Mécanique", "Électricité", "Automatisme", "PLC", "Hydraulique"],
      telecom: ["Réseaux", "Fibre", "Téléphonie", "Installation", "Configuration"],
    },
    resume: "Technicien compétent avec solide expertise technique et capacité de diagnostic. Compétent en maintenance, dépannage et résolution de problèmes techniques. Orienté efficacité et qualité de service.",
  },

  assistant: {
    competences: [
      "Assistance",
      "Organisation",
      "Gestion administrative",
      "Communication",
      "Planning",
      "Rédaction",
      "Relationnel",
      "Polyvalence",
      "Adaptabilité",
      "Discrétion",
    ],
    competences_specifiques: {
      direction: ["Agenda", "Déplacements", "Rapports", "Préparation réunions", "Suivi dossiers"],
      rh: ["Recrutement", "Onboarding", "Dossiers personnel", "Formation", "Administration"],
      communication: ["Correspondance", "Accueil", "Transmission", "Coordination", "Relais"],
    },
    resume: "Assistant polyvalent avec expertise en organisation et gestion administrative. Capacité à soutenir efficacement les équipes et à optimiser les processus quotidiens. Orienté service et efficacité.",
  },

  medecin: {
    competences: [
      "Médecine",
      "Diagnostic",
      "Traitement",
      "Relation patient",
      "Éthique",
      "Communication",
      "Rigueur",
      "Analyse",
      "Prise de décision",
      "Formation continue",
    ],
    competences_specifiques: {
      generaliste: ["Médecine générale", "Suivi patient", "Prévention", "Orientation", "Urgences"],
      specialiste: ["Cardiologie", "Dermatologie", "Pédiatrie", "Gynécologie", "Ophtalmologie"],
      chirurgien: ["Chirurgie", "Bloc opératoire", "Anesthésie", "Réanimation", "Suivi post-op"],
    },
    resume: "Médecin compétent avec solide expertise médicale et relation patient. Capacité à diagnostiquer et traiter avec précision tout en maintenant une relation de confiance. Orienté santé et bien-être patient.",
  },

  infirmier: {
    competences: [
      "Soins infirmiers",
      "Hygiène",
      "Protocol",
      "Relation patient",
      "Communication",
      "Rigueur",
      "Organisation",
      "Urgences",
      "Travail d'équipe",
      "Empathie",
    ],
    competences_specifiques: {
      general: ["Soins de base", "Injection", "Pansement", "Hygiène", "Surveillance"],
      specialise: ["Réanimation", "Psychiatrie", "Pédiatrie", "Gériatrie", "Domicile"],
      bloc: ["Bloc opératoire", "Stérilisation", "Assistance chirurgie", "Anesthésie", "Réveil"],
    },
    resume: "Infirmier dévoué avec expertise en soins infirmiers et relation patient. Capacité à prodiguer des soins de qualité tout en assurant le confort et la sécurité des patients. Orienté bien-être et professionnalisme.",
  },

  psychologue: {
    competences: [
      "Psychologie",
      "Écoute active",
      "Analyse",
      "Diagnostic",
      "Thérapie",
      "Communication",
      "Empathie",
      "Confidentialité",
      "Rigueur",
      "Adaptation",
    ],
    competences_specifiques: {
      clinique: ["Thérapie cognitive", "Psychanalyse", "Thérapie comportementale", "Suivi", "Évaluation"],
      travail: ["Psychologie du travail", "Recrutement", "Coaching", "Bilan", "Formation"],
      scolaire: ["Psychologie scolaire", "Orientation", "Difficultés apprentissage", "Enfance", "Adolescence"],
    },
    resume: "Psychologue compétent avec expertise en analyse comportementale et thérapie. Capacité à accompagner les patients vers le bien-être et le développement personnel. Orienté écoute et progression.",
  },

  traducteur: {
    competences: [
      "Traduction",
      "Interprétation",
      "Langues",
      "Culture",
      "Rédaction",
      "Terminologie",
      "Précision",
      "Recherche",
      "Adaptation",
      "Communication",
    ],
    competences_specifiques: {
      technique: ["Traduction technique", "Manuels", "Documentation", "Spécialisé", "Industriel"],
      litteraire: ["Traduction littéraire", "Livres", "Articles", "Essais", "Poésie"],
      juridique: ["Traduction juridique", "Contrats", "Actes", "Légal", "Certifié"],
    },
    resume: "Traducteur expert avec maîtrise de plusieurs langues et cultures. Capacité à transmettre avec précision les nuances et le sens des textes originaux. Orienté qualité et fidélité.",
  },

  journaliste: {
    competences: [
      "Journalisme",
      "Rédaction",
      "Investigation",
      "Interview",
      "Recherche",
      "Analyse",
      "Communication",
      "Éthique",
      "Vérification",
      "Storytelling",
    ],
    competences_specifiques: {
      presse: ["Presse écrite", "Article", "Reportage", "Enquête", "Éditorial"],
      tv: ["Télévision", "Présentation", "Reportage", "Direct", "Montage"],
      radio: ["Radio", "Animation", "Reportage sonore", "Interview", "Podcast"],
    },
    resume: "Journaliste rigoureux avec expertise en investigation et communication. Capacité à informer avec précision et impartialité tout en captivant l'audience. Orienté vérité et qualité de l'information.",
  },

  photographe: {
    competences: [
      "Photographie",
      "Composition",
      "Éclairage",
      "Post-traitement",
      "Créativité",
      "Technique",
      "Direction artistique",
      "Édition",
      "Portfolio",
      "Client",
    ],
    competences_specifiques: {
      portrait: ["Portrait", "Studio", "Éclairage", "Posing", "Retouche"],
      event: ["Événementiel", "Mariage", "Reportage", "Rapide", "Adaptatif"],
      commercial: ["Produit", "Publicité", "E-commerce", "Studio", "Créatif"],
    },
    resume: "Photographe artistique avec expertise technique et vision créative. Capacité à capturer des moments uniques et à créer des images percutantes. Orienté esthétique et satisfaction client.",
  },

  videaste: {
    competences: [
      "Vidéo",
      "Montage",
      "Réalisation",
      "Scénario",
      "Éclairage",
      "Son",
      "Post-production",
      "Créativité",
      "Technique",
      "Direction",
    ],
    competences_specifiques: {
      montage: ["Premiere", "After Effects", "DaVinci", "Final Cut", "Color grading"],
      realisation: ["Réalisation", "Mise en scène", "Direction acteurs", "Script", "Storyboard"],
      drone: ["Drone", "Aérien", "FPV", "Cinématique", "Vol"],
    },
    resume: "Vidéaste créatif avec expertise en réalisation et montage vidéo. Capacité à raconter des histoires visuelles engageantes et à produire des contenus de haute qualité. Orienté innovation et impact visuel.",
  },

  musicien: {
    competences: [
      "Musique",
      "Instrument",
      "Composition",
      "Théorie",
      "Interprétation",
      "Créativité",
      "Enregistrement",
      "Travail d'équipe",
      "Discipline",
      "Scène",
    ],
    competences_specifiques: {
      classique: ["Classique", "Orchestre", "Soliste", "Partition", "Technique"],
      moderne: ["Rock", "Pop", "Jazz", "Improvisation", "Groupe"],
      producteur: ["Production", "MAO", "Mixage", "Mastering", "Studio"],
    },
    resume: "Musicien passionné avec expertise technique et artistique. Capacité à créer et interpréter de la musique avec émotion et précision. Orienté expression et excellence musicale.",
  },

  cuisinier: {
    competences: [
      "Cuisine",
      "Techniques culinaires",
      "Hygiène",
      "Gestion",
      "Créativité",
      "Organisation",
      "Rigueur",
      "Travail d'équipe",
      "Rapidité",
      "Qualité",
    ],
    competences_specifiques: {
      chef: ["Gastronomie", "Création", "Management", "Coût", "Menu"],
      pastry: ["Pâtisserie", "Boulangerie", "Chocolaterie", "Décoration", "Précision"],
      service: ["Service", "Plonge", "Organisation", "Rapidité", "Polyvalence"],
    },
    resume: "Cuisinier passionné avec expertise en techniques culinaires et créativité. Capacité à créer des plats savoureux et à gérer efficacement le service en cuisine. Orienté qualité et satisfaction client.",
  },

  serveur: {
    competences: [
      "Service",
      "Accueil",
      "Communication",
      "Connaissance menu",
      "Vente",
      "Organisation",
      "Rapidité",
      "Relation client",
      "Travail d'équipe",
      "Polyvalence",
    ],
    competences_specifiques: {
      restaurant: ["Service à table", "Vins", "Menu", "Recommandations", "Ambiance"],
      bar: ["Bar", "Cocktails", "Vins", "Bières", "Animation"],
      evenement: ["Événementiel", "Banquet", "Groupe", "Organisation", "Adaptabilité"],
    },
    resume: "Serveur dynamique avec expertise en service client et accueil. Capacité à offrir une expérience mémorable aux clients tout en assurant un service fluide. Orienté satisfaction et professionnalisme.",
  },

  agent_securite: {
    competences: [
      "Sécurité",
      "Surveillance",
      "Prévention",
      "Intervention",
      "Règlement",
      "Communication",
      "Rigueur",
      "Gestion conflits",
      "Premiers secours",
      "Observation",
    ],
    competences_specifiques: {
      magasin: ["Surveillance", "Vol", "Accès", "Client", "Rapport"],
      evenement: ["Événementiel", "Foule", "Accès", "Urgence", "Coordination"],
      industriel: ["Site industriel", "Protocole", "Incendie", "Évacuation", "Sécurité"],
    },
    resume: "Agent de sécurité vigilant avec expertise en prévention et gestion des risques. Capacité à assurer la sécurité des personnes et des biens avec professionnalisme. Orienté protection et prévention.",
  },

  chauffeur: {
    competences: [
      "Conduite",
      "Sécurité",
      "Navigation",
      "Entretien véhicule",
      "Relation client",
      "Ponctualité",
      "Rigueur",
      "Adaptabilité",
      "Gestion trajets",
      "Service",
    ],
    competences_specifiques: {
      livreur: ["Livraison", "Itinéraire", "Colis", "Client", "Rapide"],
      taxi: ["Taxi", "VTC", "Client", "Navigation", "Service"],
      poids_lourd: ["Poids lourd", "Long trajet", "Logistique", "Reglementation", "Sécurité"],
    },
    resume: "Chauffeur expérimenté avec expertise en conduite sécurisée et service client. Capacité à assurer des trajets fiables et confortables tout en respectant les délais. Orienté sécurité et satisfaction.",
  },

  electricien: {
    competences: [
      "Électricité",
      "Installation",
      "Maintenance",
      "Diagnostic",
      "Sécurité",
      "Normes",
      "Rigueur",
      "Résolution problèmes",
      "Lecture plans",
      "Travail hauteur",
    ],
    competences_specifiques: {
      residentiel: ["Domestique", "Tableau", "Prises", "Éclairage", "Mise aux normes"],
      industriel: ["Industriel", "Automatisme", "Puissance", "Moteur", "Armoire"],
      tertiaire: ["Tertiaire", "Bureau", "Éclairage", "Sécurité", "Maintenance"],
    },
    resume: "Électricien qualifié avec expertise en installation et maintenance électrique. Capacité à réaliser des travaux conformes aux normes avec souci du détail et de la sécurité. Orienté qualité et conformité.",
  },

  plombier: {
    competences: [
      "Plomberie",
      "Installation",
      "Maintenance",
      "Diagnostic",
      "Soudure",
      "Hydraulique",
      "Sécurité",
      "Rigueur",
      "Résolution problèmes",
      "Service client",
    ],
    competences_specifiques: {
      residentiel: ["Domestique", "Robinetterie", "Chauffe-eau", "Canalisation", "Fuite"],
      industriel: ["Industriel", "Tuyauterie", "Pompe", "Vanne", "Système"],
      chauffage: ["Chauffage", "Chaudière", "Radiateur", "Plancher chauffant", "Maintenance"],
    },
    resume: "Plombier compétent avec expertise en installation et maintenance plomberie. Capacité à résoudre rapidement les problèmes et à assurer le bon fonctionnement des installations. Orienté efficacité et qualité.",
  },

  menuisier: {
    competences: [
      "Menuiserie",
      "Bois",
      "Découpe",
      "Assemblage",
      "Finition",
      "Lecture plans",
      "Précision",
      "Sécurité",
      "Créativité",
      "Rigueur",
    ],
    competences_specifiques: {
      agencement: ["Agencement", "Meuble", "Placard", "Cuisine", "Aménagement"],
      charpente: ["Charpente", "Toiture", "Structure", "Bois massif", "Traditionnel"],
      industriel: ["Industriel", "Série", "Machine", "Prototype", "Production"],
    },
    resume: "Menuisier artisan avec expertise en travail du bois et création sur mesure. Capacité à réaliser des ouvrages de qualité avec précision et souci du détail. Orienté tradition et excellence.",
  },

  peintre: {
    competences: [
      "Peinture",
      "Préparation support",
      "Application",
      "Finition",
      "Couleur",
      "Décoration",
      "Rigueur",
      "Propreté",
      "Rapidité",
      "Esthétique",
    ],
    competences_specifiques: {
      batiment: ["Bâtiment", "Intérieur", "Extérieur", "Finition", "Enduit"],
      decoratif: ["Décoratif", "Faux fini", "Stucco", "Patine", "Créatif"],
      industriel: ["Industriel", "Anticorrosion", "Métal", "Sol", "Spécifique"],
    },
    resume: "Peintre qualifié avec expertise en application et finition. Capacité à transformer les espaces avec soin et précision tout en respectant les délais. Orienté qualité et esthétique.",
  },

  jardinier: {
    competences: [
      "Jardinage",
      "Plantes",
      "Entretien",
      "Taille",
      "Plantation",
      "Connaissance",
      "Sécurité",
      "Machines",
      "Créativité",
      "Saisons",
    ],
    competences_specifiques: {
      paysagiste: ["Paysagiste", "Design", "Création", "Aménagement", "Projet"],
      entretien: ["Entretien", "Tonte", "Taille", "Désherbage", "Saison"],
      espaces_verts: ["Espaces verts", "Collectivité", "Parc", "Public", "Équipe"],
    },
    resume: "Jardinier passionné avec expertise en entretien et création d'espaces verts. Capacité à maintenir et embellir les jardons avec connaissance des plantes et des saisons. Orienté nature et esthétique.",
  },

  agent_entretien: {
    competences: [
      "Entretien",
      "Nettoyage",
      "Hygiène",
      "Organisation",
      "Rigueur",
      "Produits",
      "Sécurité",
      "Polyvalence",
      "Rapidité",
      "Service",
    ],
    competences_specifiques: {
      bureau: ["Bureau", "Nettoyage", "Poussière", "Vitre", "Désinfection"],
      industriel: ["Industriel", "Machine", "Sol", "Protocole", "Sécurité"],
      medical: ["Médical", "Stérilisation", "Protocole", "Désinfection", "Normes"],
    },
    resume: "Agent d'entretien rigoureux avec expertise en nettoyage et hygiène. Capacité à maintenir les espaces propres et sécurisés avec efficacité et professionnalisme. Orienté qualité et satisfaction.",
  },

  vendeur: {
    competences: [
      "Vente",
      "Relation client",
      "Communication",
      "Négociation",
      "Connaissance produit",
      "Merchandising",
      "Caisse",
      "Rigueur",
      "Dynamisme",
      "Service",
    ],
    competences_specifiques: {
      retail: ["Retail", "Magasin", "Client", "Conseil", "Vente"],
      luxe: ["Luxe", "Haut de gamme", "Clientèle", "Personnalisation", "Service"],
      technique: ["Technique", "Produit", "Démonstration", "Conseil", "Spécialisé"],
    },
    resume: "Vendeur dynamique avec expertise en relation client et vente. Capacité à conseiller et vendre avec conviction tout en assurant une expérience client positive. Orienté résultats et satisfaction.",
  },

  gerant_magasin: {
    competences: [
      "Management",
      "Gestion",
      "Vente",
      "Équipe",
      "Stock",
      "Caisse",
      "Reporting",
      "Relation client",
      "Stratégie",
      "Performance",
    ],
    competences_specifiques: {
      retail: ["Retail", "Magasin", "KPI", "Objectifs", "Équipe"],
      franchise: ["Franchise", "Charte", "Reporting", "Relation siège", "Respect"],
      concept: ["Concept", "Image", "Merchandising", "Animation", "Lancement"],
    },
    resume: "Gérant de magasin expérimenté avec expertise en management et performance commerciale. Capacité à diriger une équipe et à atteindre les objectifs de vente. Orienté résultats et développement.",
  },

  recruteur: {
    competences: [
      "Recrutement",
      "Entretien",
      "Sourcing",
      "Évaluation",
      "Relation candidat",
      "Communication",
      "Analyse CV",
      "Network",
      "Marché emploi",
      "Processus",
    ],
    competences_specifiques: {
      interim: ["Intérim", "Volume", "Rapidité", "Client", "Candidat"],
      cadre: ["Cadre", "Chasseur", "Headhunting", "Senior", "Spécialisé"],
      tech: ["Tech", "IT", "Développeur", "Compétences techniques", "Évaluation"],
    },
    resume: "Recruteur expert avec expertise en sourcing et évaluation de talents. Capacité à identifier les meilleurs candidats et à gérer le processus de recrutement avec efficacité. Orienté qualité et matching.",
  },

  coach_sportif: {
    competences: [
      "Coaching",
      "Sport",
      "Physiologie",
      "Planification",
      "Motivation",
      "Communication",
      "Sécurité",
      "Pédagogie",
      "Adaptation",
      "Performance",
    ],
    competences_specifiques: {
      fitness: ["Fitness", "Musculation", "Cardio", "Perte poids", "Mise en forme"],
      collectif: ["Collectif", "Football", "Basket", "Handball", "Stratégie"],
      individuel: ["Individuel", "Tennis", "Athlétisme", "Natation", "Performance"],
    },
    resume: "Coach sportif passionné avec expertise en préparation physique et motivation. Capacité à accompagner les sportifs vers leurs objectifs avec pédagogie et sécurité. Orienté performance et bien-être.",
  },

  estheticienne: {
    competences: [
      "Esthétique",
      "Soins visage",
      "Soins corps",
      "Maquillage",
      "Relation client",
      "Hygiène",
      "Conseil",
      "Vente",
      "Rigueur",
      "Douleur",
    ],
    competences_specifiques: {
      visage: ["Visage", "Nettoyage", "Hydratation", "Anti-âge", "Acné"],
      corps: ["Corps", "Massage", "Gommage", "Drainage", "Modelage"],
      onglerie: ["Onglerie", "Manucure", "Pédicure", "Vernis", "Semi-permanent"],
    },
    resume: "Esthéticienne qualifiée avec expertise en soins du visage et du corps. Capacité à offrir des soins personnalisés et à conseiller les clients sur leur routine beauté. Orienté bien-être et satisfaction.",
  },

  coiffeur: {
    competences: [
      "Coiffure",
      "Coupe",
      "Coloration",
      "Brushing",
      "Relation client",
      "Créativité",
      "Tendances",
      "Conseil",
      "Rigueur",
      "Vente",
    ],
    competences_specifiques: {
      homme: ["Homme", "Barbe", "Coupe classique", "Tendance", "Rasage"],
      femme: ["Femme", "Coupe", "Coloration", "Balayage", "Coiffure soirée"],
      coloriste: ["Coloration", "Ombre", "Balayage", "Patine", "Correction"],
    },
    resume: "Coiffeur créatif avec expertise en coupe, coloration et coiffure. Capacité à créer des looks personnalisés et à conseiller les clients sur les tendances. Orienté style et satisfaction client.",
  },

  agent_immobilier: {
    competences: [
      "Immobilier",
      "Vente",
      "Location",
      "Estimation",
      "Relation client",
      "Négociation",
      "Marché",
      "Visite",
      "Dossier",
      "Réglementation",
    ],
    competences_specifiques: {
      vente: ["Vente", "Mandat", "Estimation", "Négociation", "Signature"],
      location: ["Location", "Bail", "État des lieux", "Caution", "Gestion"],
      neuf: ["Neuf", "VEFA", "Programme", "Constructeur", "Promoteur"],
    },
    resume: "Agent immobilier dynamique avec expertise en vente et location de biens. Capacité à accompagner les clients dans leurs projets immobiliers avec professionnalisme. Orienté service et réussite transaction.",
  },

  architecte_interieur: {
    competences: [
      "Architecture intérieure",
      "Design",
      "Aménagement",
      "CAO / DAO",
      "Créativité",
      "Relation client",
      "Budget",
      "Matériaux",
      "Normes",
      "Coordination",
    ],
    competences_specifiques: {
      residentiel: ["Résidentiel", "Appartement", "Maison", "Rénovation", "Aménagement"],
      commercial: ["Commercial", "Bureau", "Boutique", "Restaurant", "Concept"],
      hotel: ["Hôtellerie", "Chambre", "Lobby", "Restaurant", "Ambiance"],
    },
    resume: "Architecte d'intérieur créatif avec expertise en aménagement et design d'espace. Capacité à transformer les intérieurs en lieux fonctionnels et esthétiques. Orienté innovation et confort.",
  },

  createur_mode: {
    competences: [
      "Mode",
      "Design",
      "Couture",
      "Tissage",
      "Tendances",
      "Créativité",
      "Collection",
      "Matériaux",
      "Sketch",
      "Production",
    ],
    competences_specifiques: {
      pret_a_porter: ["Prêt-à-porter", "Collection", "Tendance", "Production", "Commercial"],
      haute_couture: ["Haute couture", "Sur mesure", "Luxe", "Finition", "Exclusivité"],
      accessory: ["Accessoire", "Sac", "Chaussure", "Bijou", "Maroquinerie"],
    },
    resume: "Créateur de mode talentueux avec expertise en design et création de collections. Capacité à imaginer des pièces originales et à suivre les tendances. Orienté créativité et qualité.",
  },

  animateur: {
    competences: [
      "Animation",
      "Communication",
      "Gestion groupe",
      "Pédagogie",
      "Créativité",
      "Adaptabilité",
      "Sécurité",
      "Relationnel",
      "Organisation",
      "Dynamisme",
    ],
    competences_specifiques: {
      enfants: ["Enfants", "Colo", "Centre de loisirs", "Activités", "Sécurité"],
      seniors: ["Seniors", "EHPAD", "Activités adaptées", "Bienveillance", "Animation"],
      evenement: ["Événementiel", "Soirée", "Team building", "Animation", "Fête"],
    },
    resume: "Animateur dynamique avec expertise en gestion de groupe et animation. Capacité à créer des activités engageantes et à maintenir une ambiance positive. Orienté plaisir et participation.",
  },

  guide_touristique: {
    competences: [
      "Tourisme",
      "Histoire",
      "Culture",
      "Communication",
      "Langues",
      "Animation",
      "Organisation",
      "Sécurité",
      "Adaptabilité",
      "Accueil",
    ],
    competences_specifiques: {
      ville: ["Ville", "Patrimoine", "Architecture", "Musée", "Quartier"],
      nature: ["Nature", "Randonnée", "Environnement", "Faune", "Flore"],
      thematique: ["Thématique", "Gastronomie", "Art", "Histoire", "Spécialisé"],
    },
    resume: "Guide touristique passionné avec expertise en histoire et culture locale. Capacité à faire découvrir les richesses d'une région avec enthousiasme et précision. Orienté partage et expérience.",
  },

  expert_comptable: {
    competences: [
      "Comptabilité",
      "Audit",
      "Fiscalité",
      "Conseil",
      "Gestion",
      "Réglementation",
      "Analyse",
      "Reporting",
      "Rigueur",
      "Relation client",
    ],
    competences_specifiques: {
      social: ["Social", "Commissaire aux comptes", "Audit légal", "Rapport", "Conformité"],
      fiscal: ["Fiscalité", "IS", "IR", "TVA", "Optimisation"],
      conseil: ["Conseil", "Stratégie", "Transmission", "Création", "Accompagnement"],
    },
    resume: "Expert-comptable rigoureux avec expertise en comptabilité, audit et fiscalité. Capacité à conseiller les entreprises et à garantir la conformité comptable. Orienté précision et accompagnement.",
  },

  notaire: {
    competences: [
      "Droit",
      "Rédaction d'actes",
      "Conseil juridique",
      "Immobilier",
      "Succession",
      "Famille",
      "Rigueur",
      "Confidentialité",
      "Relation client",
      "Réglementation",
    ],
    competences_specifiques: {
      immobilier: ["Immobilier", "Vente", "Achat", "Hypothèque", "Acte"],
      famille: ["Famille", "Mariage", "Pacs", "Succession", "Donation"],
      entreprise: ["Entreprise", "Société", "Statut", "Transmission", "Formalité"],
    },
    resume: "Notaire expérimenté avec expertise en droit immobilier et familial. Capacité à rédiger des actes authentiques et à conseiller les clients sur leurs projets. Orienté sécurité juridique et service.",
  },

  avocat: {
    competences: [
      "Droit",
      "Plaidoirie",
      "Négociation",
      "Rédaction",
      "Analyse",
      "Communication",
      "Stratégie",
      "Rigueur",
      "Relation client",
      "Éthique",
    ],
    competences_specifiques: {
      penal: ["Pénal", "Défense", "Audience", "Instruction", "Plaidoirie"],
      civil: ["Civil", "Contrat", "Responsabilité", "Litige", "Négociation"],
      affaires: ["Affaires", "Entreprise", "Fusion", "Acquisition", "Droit des sociétés"],
    },
    resume: "Avocat compétent avec expertise en plaidoirie et conseil juridique. Capacité à défendre les intérêts des clients avec conviction et stratégie. Orienté justice et réussite.",
  },

  diplomate: {
    competences: [
      "Diplomatie",
      "Relations internationales",
      "Négociation",
      "Communication",
      "Langues",
      "Analyse politique",
      "Rédaction",
      "Protocole",
      "Réseaux",
      "Stratégie",
    ],
    competences_specifiques: {
      politique: ["Politique", "Relations bilatérales", "Négociation", "Accord", "Protocole"],
      economique: ["Économique", "Commerce", "Investissement", "Développement", "Coopération"],
      culturel: ["Culturel", "Coopération", "Échange", "Promotion", "Rayonnement"],
    },
    resume: "Diplomate expérimenté avec expertise en relations internationales et négociation. Capacité à représenter et défendre les intérêts avec diplomatie et stratégie. Orienté dialogue et coopération.",
  },

  chercheur: {
    competences: [
      "Recherche",
      "Analyse",
      "Méthodologie",
      "Publication",
      "Communication",
      "Rigueur",
      "Innovation",
      "Collaboration",
      "Financement",
      "Expertise",
    ],
    competences_specifiques: {
      scientifique: ["Scientifique", "Laboratoire", "Expérimentation", "Données", "Publication"],
      social: ["Social", "Enquête", "Qualitatif", "Quantitatif", "Terrain"],
      medical: ["Médical", "Clinique", "Essai", "Protocole", "Éthique"],
    },
    resume: "Chercheur passionné avec expertise en recherche scientifique et innovation. Capacité à mener des projets de recherche rigoureux et à publier des résultats significatifs. Orienté découverte et avancement des connaissances.",
  },

  entrepreneur: {
    competences: [
      "Entrepreneuriat",
      "Stratégie",
      "Gestion",
      "Leadership",
      "Innovation",
      "Finance",
      "Marketing",
      "Vente",
      "Résolution problèmes",
      "Vision",
    ],
    competences_specifiques: {
      startup: ["Startup", "Lean startup", "Pitch", "Investissement", "Croissance"],
      ecommerce: ["E-commerce", "Dropshipping", "Logistique", "Marketing digital", "Conversion"],
      traditionnel: ["Traditionnel", "Commerce", "Local", "Service", "Fidélisation"],
    },
    resume: "Entrepreneur visionnaire avec expertise en création et développement d'entreprise. Capacité à transformer des idées en projets concrets et à les faire croître. Orienté innovation et succès.",
  },

  freelance: {
    competences: [
      "Freelance",
      "Autonomie",
      "Gestion client",
      "Facturation",
      "Marketing personnel",
      "Time management",
      "Adaptabilité",
      "Réseau",
      "Compétences métier",
      "Polyvalence",
    ],
    competences_specifiques: {
      digital: ["Digital", "Web", "SEO", "Social media", "Content"],
      creatif: ["Créatif", "Design", "Rédaction", "Photo", "Vidéo"],
      technique: ["Technique", "Développement", "IT", "Système", "Support"],
    },
    resume: "Freelance autonome avec expertise en gestion de clientèle et livraison de services. Capacité à gérer plusieurs projets et à s'adapter aux besoins des clients. Orienté qualité et relation client.",
  },

  formateur: {
    competences: [
      "Formation",
      "Pédagogie",
      "Communication",
      "Animation",
      "Connaissance sujet",
      "Adaptation",
      "Évaluation",
      "Création contenu",
      "Relationnel",
      "Motivation",
    ],
    competences_specifiques: {
      professionnel: ["Professionnel", "Entreprise", "Compétences", "Soft skills", "Management"],
      technique: ["Technique", "IT", "Logiciel", "Procédure", "Outil"],
      langues: ["Langues", "Anglais", "Espagnol", "Méthode", "Communication"],
    },
    resume: "Formateur pédagogue avec expertise en transmission de connaissances. Capacité à adapter la formation aux besoins des apprenants et à créer un environnement d'apprentissage positif. Orienté réussite et progression.",
  },

  mentor: {
    competences: [
      "Mentorat",
      "Coaching",
      "Écoute",
      "Conseil",
      "Expérience",
      "Accompagnement",
      "Développement",
      "Réseau",
      "Motivation",
      "Objectifs",
    ],
    competences_specifiques: {
      business: ["Business", "Entrepreneuriat", "Stratégie", "Croissance", "Réseau"],
      carrière: ["Carrière", "Évolution", "Orientation", "Compétences", "Opportunité"],
      personnel: ["Personnel", "Développement", "Confiance", "Équilibre", "Bien-être"],
    },
    resume: "Mentor expérimenté avec expertise en accompagnement et développement personnel. Capacité à guider les mentores vers leurs objectifs avec bienveillance et partage d'expérience. Orienté croissance et réussite.",
  },

  product_manager: {
    competences: [
      "Product management",
      "Stratégie produit",
      "Roadmap",
      "Priorisation",
      "Analyse marché",
      "Communication",
      "Agile",
      "KPI",
      "User research",
      "Leadership",
    ],
    competences_specifiques: {
      tech: ["Tech", "SaaS", "API", "Platform", "B2B"],
      mobile: ["Mobile", "App", "iOS", "Android", "User experience"],
      ecommerce: ["E-commerce", "Marketplace", "Conversion", "UX", "Growth"],
    },
    resume: "Product Manager stratégique avec expertise en développement produit et gestion de roadmap. Capacité à aligner les besoins utilisateurs avec les objectifs business. Orienté innovation et croissance.",
  },

  scrum_master: {
    competences: [
      "Scrum",
      "Agile",
      "Facilitation",
      "Coaching",
      "Résolution conflits",
      "Amélioration continue",
      "Communication",
      "Leadership serviteur",
      "Méthodologie",
      "Équipe",
    ],
    competences_specifiques: {
      software: ["Software", "Développement", "Sprint", "Backlog", "Ceremonies"],
      hardware: ["Hardware", "Produit physique", "R&D", "Prototype", "Lancement"],
      service: ["Service", "IT", "Support", "Processus", "Amélioration"],
    },
    resume: "Scrum Master certifié avec expertise en méthodologie Agile et facilitation d'équipe. Capacité à guider les équipes vers l'excellence et l'amélioration continue. Orienté collaboration et performance.",
  },

  devops: {
    competences: [
      "DevOps",
      "CI/CD",
      "Cloud",
      "Docker",
      "Kubernetes",
      "Infrastructure as code",
      "Monitoring",
      "Automation",
      "Scripting",
      "Security",
    ],
    competences_specifiques: {
      aws: ["AWS", "EC2", "S3", "Lambda", "CloudFormation"],
      azure: ["Azure", "DevOps", "AKS", "Functions", "ARM"],
      gcp: ["GCP", "Compute", "Storage", "Cloud Build", "Anthos"],
    },
    resume: "Ingénieur DevOps expert avec expertise en automatisation et infrastructure cloud. Capacité à optimiser les processus de développement et de déploiement. Orienté efficacité et fiabilité.",
  },

  security_engineer: {
    competences: [
      "Cybersécurité",
      "Pentest",
      "Audit sécurité",
      "Compliance",
      "Incident response",
      "Network security",
      "Application security",
      "Risk management",
      "Encryption",
      "Monitoring",
    ],
    competences_specifiques: {
      offensive: ["Offensive", "Pentest", "Red team", "Exploit", "Vulnerability"],
      defensive: ["Defensive", "Blue team", "SOC", "SIEM", "Threat hunting"],
      cloud: ["Cloud security", "AWS", "Azure", "GCP", "Container security"],
    },
    resume: "Ingénieur sécurité expert avec expertise en cybersécurité et protection des systèmes. Capacité à identifier et corriger les vulnérabilités tout en assurant la conformité. Orienté protection et résilience.",
  },

  ux_designer: {
    competences: [
      "UX design",
      "User research",
      "Wireframing",
      "Prototyping",
      "User testing",
      "Information architecture",
      "Design thinking",
      "Analytics",
      "Accessibility",
      "Collaboration",
    ],
    competences_specifiques: {
      mobile: ["Mobile", "iOS", "Android", "App design", "Touch"],
      web: ["Web", "Responsive", "Desktop", "Navigation", "Conversion"],
      enterprise: ["Enterprise", "B2B", "Complex workflow", "Dashboard", "Data"],
    },
    resume: "UX Designer centré sur l'utilisateur avec expertise en recherche et design d'expérience. Capacité à créer des interfaces intuitives et engageantes basées sur les besoins utilisateurs. Orienté satisfaction et conversion.",
  },

  ui_designer: {
    competences: [
      "UI design",
      "Visual design",
      "Design system",
      "Typography",
      "Color theory",
      "Layout",
      "Figma",
      "Sketch",
      "Adobe XD",
      "Prototyping",
    ],
    competences_specifiques: {
      mobile: ["Mobile", "iOS", "Android", "Material", "Human interface"],
      web: ["Web", "Responsive", "CSS", "Component", "Library"],
      brand: ["Brand", "Identity", "Guidelines", "Consistency", "Style"],
    },
    resume: "UI Designer créatif avec expertise en design visuel et systèmes de design. Capacité à créer des interfaces esthétiques et cohérentes qui renforcent l'identité de marque. Orienté beauté et utilisabilité.",
  },

  qa_engineer: {
    competences: [
      "QA",
      "Testing",
      "Test automation",
      "Manual testing",
      "Performance testing",
      "API testing",
      "Bug tracking",
      "CI/CD",
      "Documentation",
      "Communication",
    ],
    competences_specifiques: {
      automation: ["Automation", "Selenium", "Cypress", "Playwright", "Framework"],
      performance: ["Performance", "Load testing", "JMeter", "K6", "Monitoring"],
      security: ["Security testing", "OWASP", "Vulnerability", "Penetration", "Compliance"],
    },
    resume: "QA Engineer rigoureux avec expertise en assurance qualité et automatisation de tests. Capacité à garantir la qualité des produits tout en optimisant les processus de test. Orienté excellence et fiabilité.",
  },

  business_analyst: {
    competences: [
      "Business analysis",
      "Requirements gathering",
      "Process modeling",
      "Stakeholder management",
      "Data analysis",
      "Documentation",
      "Communication",
      "Problem solving",
      "Agile",
      "SQL",
    ],
    competences_specifiques: {
      finance: ["Finance", "Banking", "Trading", "Risk", "Compliance"],
      healthcare: ["Healthcare", "EHR", "HIPAA", "Clinical", "Regulatory"],
      retail: ["Retail", "E-commerce", "Supply chain", "Inventory", "POS"],
    },
    resume: "Business Analyst analytique avec expertise en analyse business et collecte de besoins. Capacité à traduire les besoins métier en solutions techniques viables. Orienté valeur ajoutée et alignement.",
  },

  project_manager: {
    competences: [
      "Project management",
      "Planning",
      "Budget",
      "Risk management",
      "Stakeholder management",
      "Communication",
      "Leadership",
      "Agile",
      "Waterfall",
      "Reporting",
    ],
    competences_specifiques: {
      it: ["IT", "Software", "Développement", "Infrastructure", "Migration"],
      construction: ["Construction", "Bâtiment", "Génie civil", "Architecte", "Chantier"],
      marketing: ["Marketing", "Campagne", "Lancement", "Événement", "Digital"],
    },
    resume: "Chef de projet expérimenté avec expertise en gestion de projets complexes. Capacité à coordonner les équipes et livrer dans les délais et budgets. Orienté succès et satisfaction client.",
  },

  operations_manager: {
    competences: [
      "Operations management",
      "Process optimization",
      "Supply chain",
      "Logistics",
      "Inventory",
      "Quality control",
      "Team management",
      "KPI",
      "Continuous improvement",
      "Budget",
    ],
    competences_specifiques: {
      manufacturing: ["Manufacturing", "Production", "Lean", "Six Sigma", "Safety"],
      logistics: ["Logistics", "Transport", "Warehouse", "Distribution", "3PL"],
      service: ["Service", "Support", "Call center", "SLA", "Customer experience"],
    },
    resume: "Operations Manager stratégique avec expertise en optimisation des opérations et supply chain. Capacité à améliorer l'efficacité et réduire les coûts tout en maintenant la qualité. Orienté performance et excellence opérationnelle.",
  },

  hr_manager: {
    competences: [
      "HR management",
      "Recruitment",
      "Training",
      "Employee relations",
      "Performance management",
      "Compensation",
      "Compliance",
      "HR analytics",
      "Strategic planning",
      "Communication",
    ],
    competences_specifiques: {
      recruitment: ["Recruitment", "Talent acquisition", "Sourcing", "Employer branding", "Onboarding"],
      tech: ["Tech", "IT recruitment", "Developer", "Engineering", "Startup"],
      corporate: ["Corporate", "Policy", "Compliance", "Employee relations", "Culture"],
    },
    resume: "HR Manager expérimenté avec expertise en gestion des ressources humaines et développement des talents. Capacité à créer un environnement de travail positif et à accompagner la croissance organisationnelle. Orienté bien-être et performance.",
  },

  sales_manager: {
    competences: [
      "Sales management",
      "Team leadership",
      "Revenue growth",
      "CRM",
      "Forecasting",
      "Negotiation",
      "Strategy",
      "Coaching",
      "KPI",
      "Customer relationship",
    ],
    competences_specifiques: {
      b2b: ["B2B", "Enterprise", "Account management", "Long sales cycle", "Consultative"],
      b2c: ["B2C", "Retail", "Direct sales", "High volume", "Conversion"],
      saas: ["SaaS", "Subscription", "Churn", "Upsell", "Customer success"],
    },
    resume: "Sales Manager dynamique avec expertise en management d'équipe commerciale et croissance des revenus. Capacité à motiver les équipes et atteindre les objectifs de vente. Orienté résultats et performance.",
  },

  marketing_manager: {
    competences: [
      "Marketing management",
      "Digital marketing",
      "Brand management",
      "Campaign management",
      "Analytics",
      "Budget",
      "Team leadership",
      "Strategy",
      "Content",
      "SEO/SEM",
    ],
    competences_specifiques: {
      digital: ["Digital", "Social media", "PPC", "Email", "Automation"],
      brand: ["Brand", "Identity", "Positioning", "Awareness", "Loyalty"],
      growth: ["Growth", "Acquisition", "Retention", "Viral", "Metrics"],
    },
    resume: "Marketing Manager créatif avec expertise en stratégie marketing et gestion de campagnes. Capacité à développer la marque et à générer de la croissance. Orienté ROI et innovation.",
  },

  content_manager: {
    competences: [
      "Content management",
      "Content strategy",
      "SEO",
      "Copywriting",
      "Editing",
      "CMS",
      "Social media",
      "Analytics",
      "Planning",
      "Collaboration",
    ],
    competences_specifiques: {
      web: ["Web", "Blog", "SEO", "Landing page", "Conversion"],
      social: ["Social", "Instagram", "LinkedIn", "Twitter", "Engagement"],
      video: ["Video", "YouTube", "Script", "Production", "Analytics"],
    },
    resume: "Content Manager stratégique avec expertise en création et gestion de contenu. Capacité à développer une stratégie de contenu engageante et optimisée pour le SEO. Orienté audience et conversion.",
  },

  social_media_manager: {
    competences: [
      "Social media",
      "Content creation",
      "Community management",
      "Analytics",
      "Paid advertising",
      "Influencer marketing",
      "Strategy",
      "Trends",
      "Crisis management",
      "Branding",
    ],
    competences_specifiques: {
      instagram: ["Instagram", "Reels", "Stories", "Visual", "Hashtags"],
      linkedin: ["LinkedIn", "B2B", "Thought leadership", "Networking", "Company page"],
      tiktok: ["TikTok", "Short video", "Trends", "Viral", "Creator"],
    },
    resume: "Social Media Manager expert avec expertise en gestion de communautés et création de contenu viral. Capacité à développer la présence digitale et à engager les audiences. Orienté croissance et interaction.",
  },

  email_marketing_specialist: {
    competences: [
      "Email marketing",
      "Automation",
      "Segmentation",
      "Copywriting",
      "A/B testing",
      "Deliverability",
      "Analytics",
      "CRM",
      "Strategy",
      "Compliance",
    ],
    competences_specifiques: {
      automation: ["Automation", "Workflow", "Trigger", "Drip", "Nurture"],
      newsletter: ["Newsletter", "Content", "Engagement", "Open rate", "Click rate"],
      promotional: ["Promotional", "Sales", "Offer", "Urgency", "Conversion"],
    },
    resume: "Email Marketing Specialist expert avec expertise en automatisation et optimisation de campagnes email. Capacité à créer des campagnes performantes qui convertissent. Orienté ROI et engagement.",
  },

  seo_specialist: {
    competences: [
      "SEO",
      "Keyword research",
      "On-page SEO",
      "Off-page SEO",
      "Technical SEO",
      "Analytics",
      "Content optimization",
      "Link building",
      "Local SEO",
      "Tools",
    ],
    competences_specifiques: {
      technical: ["Technical", "Site speed", "Mobile", "Schema", "Crawl"],
      content: ["Content", "Blogging", "Copywriting", "Optimization", "Ranking"],
      local: ["Local", "Google My Business", "Citations", "Reviews", "Maps"],
    },
    resume: "SEO Specialist expert avec expertise en optimisation pour les moteurs de recherche. Capacité à améliorer le classement et la visibilité organique. Orienté trafic et conversion.",
  },

  ppc_specialist: {
    competences: [
      "PPC",
      "Google Ads",
      "Facebook Ads",
      "Campaign management",
      "Keyword research",
      "Bid management",
      "Analytics",
      "A/B testing",
      "ROI optimization",
      "Budget management",
    ],
    competences_specifiques: {
      search: ["Search", "Google Ads", "Bing", "Keywords", "Quality score"],
      social: ["Social", "Facebook", "Instagram", "LinkedIn", "Audience"],
      display: ["Display", "Banner", "Retargeting", "Programmatic", "Native"],
    },
    resume: "PPC Specialist expert avec expertise en gestion de campagnes publicitaires payantes. Capacité à optimiser le ROI et à maximiser les conversions. Orienté performance et efficacité.",
  },

  growth_hacker: {
    competences: [
      "Growth hacking",
      "A/B testing",
      "Data analysis",
      "Viral marketing",
      "Conversion optimization",
      "Product",
      "Marketing",
      "Engineering",
      "Creativity",
      "Metrics",
    ],
    competences_specifiques: {
      product: ["Product", "Onboarding", "Activation", "Retention", "Referral"],
      acquisition: ["Acquisition", "Channel", "Funnel", "Viral", "Growth loop"],
      monetization: ["Monetization", "Pricing", "Upsell", "LTV", "ARPU"],
    },
    resume: "Growth Hacker innovant avec expertise en croissance rapide et expérimentation. Capacité à identifier et exploiter les opportunités de croissance. Orienté métriques et scalabilité.",
  },

  customer_success_manager: {
    competences: [
      "Customer success",
      "Onboarding",
      "Retention",
      "Upsell",
      "Relationship management",
      "Communication",
      "Problem solving",
      "Product knowledge",
      "SaaS",
      "Churn reduction",
    ],
    competences_specifiques: {
      saas: ["SaaS", "Subscription", "Renewal", "Expansion", "Health score"],
      enterprise: ["Enterprise", "Account management", "Strategic", "C-level", "Long-term"],
      smb: ["SMB", "Volume", "Efficiency", "Self-service", "Automation"],
    },
    resume: "Customer Success Manager dédié avec expertise en satisfaction et fidélisation client. Capacité à accompagner les clients vers le succès et maximiser la valeur. Orienté retention et croissance.",
  },

  account_manager: {
    competences: [
      "Account management",
      "Relationship building",
      "Sales",
      "Negotiation",
      "Communication",
      "Problem solving",
      "Strategic planning",
      "CRM",
      "Industry knowledge",
      "Teamwork",
    ],
    competences_specifiques: {
      agency: ["Agency", "Client", "Campaign", "Creative", "Reporting"],
      software: ["Software", "SaaS", "Renewal", "Expansion", "Support"],
      advertising: ["Advertising", "Media", "Budget", "Campaign", "ROI"],
    },
    resume: "Account Manager relationnel avec expertise en gestion de comptes clients. Capacité à développer et maintenir des relations durables et rentables. Orienté satisfaction et croissance.",
  },

  event_manager: {
    competences: [
      "Event management",
      "Planning",
      "Budgeting",
      "Vendor management",
      "Logistics",
      "Marketing",
      "Communication",
      "Problem solving",
      "Creativity",
      "Timeline",
    ],
    competences_specifiques: {
      corporate: ["Corporate", "Conference", "Meeting", "Team building", "Professional"],
      wedding: ["Wedding", "Ceremony", "Reception", "Vendor", "Coordination"],
      festival: ["Festival", "Music", "Crowd", "Security", "Production"],
    },
    resume: "Event Manager organisé avec expertise en planification et coordination d'événements. Capacité à créer des expériences mémorables dans les délais et budgets. Orienté succès et satisfaction.",
  },

  public_relations_specialist: {
    competences: [
      "Public relations",
      "Media relations",
      "Crisis management",
      "Communication",
      "Writing",
      "Networking",
      "Strategy",
      "Brand reputation",
      "Social media",
      "Press releases",
    ],
    competences_specifiques: {
      corporate: ["Corporate", "Internal comms", "Executive", "Investor", "CSR"],
      agency: ["Agency", "Client", "Media", "Campaign", "Measurement"],
      tech: ["Tech", "Product launch", "Influencer", "Analyst", "Thought leadership"],
    },
    resume: "PR Specialist stratégique avec expertise en relations publiques et gestion de réputation. Capacité à gérer la communication et à bâtir des relations positives avec les médias. Orienté image et influence.",
  },

  brand_manager: {
    competences: [
      "Brand management",
      "Brand strategy",
      "Market research",
      "Creative direction",
      "Marketing",
      "Communication",
      "Analytics",
      "Budget",
      "Team leadership",
      "Innovation",
    ],
    competences_specifiques: {
      fmcg: ["FMCG", "Consumer goods", "Retail", "Distribution", "Packaging"],
      luxury: ["Luxury", "Premium", "Heritage", "Exclusivity", "Experience"],
      tech: ["Tech", "Product", "Launch", "Positioning", "Differentiation"],
    },
    resume: "Brand Manager visionnaire avec expertise en stratégie de marque et positionnement. Capacité à développer et renforcer l'identité de marque sur le marché. Orienté notoriété et fidélité.",
  },

  product_marketing_manager: {
    competences: [
      "Product marketing",
      "Go-to-market",
      "Positioning",
      "Messaging",
      "Sales enablement",
      "Market research",
      "Competitive analysis",
      "Content",
      "Launch",
      "Analytics",
    ],
    competences_specifiques: {
      b2b: ["B2B", "Enterprise", "Sales cycle", "Case study", "Whitepaper"],
      b2c: ["B2C", "Consumer", "Emotion", "Creative", "Campaign"],
      saas: ["SaaS", "Freemium", "Trial", "Conversion", "Onboarding"],
    },
    resume: "Product Marketing Manager stratégique avec expertise en lancement et positionnement produit. Capacité à créer des messages percutants et à soutenir les ventes. Orienté adoption et croissance.",
  },

  chief_of_staff: {
    competences: [
      "Chief of staff",
      "Strategic planning",
      "Executive support",
      "Project management",
      "Communication",
      "Leadership",
      "Decision making",
      "Stakeholder management",
      "Operations",
      "Confidentiality",
    ],
    competences_specifiques: {
      startup: ["Startup", "Founder", "Scaling", "Operations", "Strategy"],
      corporate: ["Corporate", "C-suite", "Board", "Governance", "Compliance"],
      political: ["Political", "Policy", "Constituency", "Communication", "Strategy"],
    },
    resume: "Chief of Staff stratégique avec expertise en soutien exécutif et coordination. Capacité à faciliter la prise de décision et à aligner les initiatives. Orienté efficacité et leadership.",
  },

  executive_assistant: {
    competences: [
      "Executive assistance",
      "Calendar management",
      "Travel coordination",
      "Communication",
      "Confidentiality",
      "Project support",
      "Meeting preparation",
      "Expense management",
      "Prioritization",
      "Professionalism",
    ],
    competences_specifiques: {
      ceo: ["CEO", "Board", "Investors", "Strategic", "High-level"],
      vp: ["VP", "Department", "Team", "Operations", "Coordination"],
      entertainment: ["Entertainment", "Celebrity", "Personal", "Lifestyle", "Discretion"],
    },
    resume: "Executive Assistant dévoué avec expertise en soutien exécutif et gestion complexe. Capacité à anticiper les besoins et à optimiser le temps des dirigeants. Orienté service et excellence.",
  },

  office_manager: {
    competences: [
      "Office management",
      "Administration",
      "Facilities",
      "Procurement",
      "Team coordination",
      "Budget",
      "Vendor management",
      "Communication",
      "Organization",
      "Problem solving",
    ],
    competences_specifiques: {
      startup: ["Startup", "Culture", "Events", "HR admin", "Flexible"],
      corporate: ["Corporate", "Policy", "Compliance", "Facilities", "Security"],
      coworking: ["Coworking", "Community", "Events", "Members", "Amenities"],
    },
    resume: "Office Manager organisé avec expertise en gestion administrative et coordination d'équipe. Capacité à assurer le bon fonctionnement du bureau et à créer un environnement de travail positif. Orienté efficacité et bien-être.",
  },

  receptionist: {
    competences: [
      "Reception",
      "Customer service",
      "Phone handling",
      "Greeting",
      "Scheduling",
      "Administrative support",
      "Communication",
      "Multitasking",
      "Professionalism",
      "Problem solving",
    ],
    competences_specifiques: {
      hotel: ["Hotel", "Check-in", "Reservation", "Guest service", "Hospitality"],
      medical: ["Medical", "Patient", "Appointment", "Insurance", "HIPAA"],
      corporate: ["Corporate", "Visitor", "Security", "Meeting room", "Protocol"],
    },
    resume: "Réceptionniste accueillant avec expertise en service client et gestion administrative. Capacité à créer une première impression positive et à gérer multiples tâches. Orienté service et professionnalisme.",
  },

  data_entry_clerk: {
    competences: [
      "Data entry",
      "Typing",
      "Accuracy",
      "Attention to detail",
      "Computer skills",
      "Database management",
      "Confidentiality",
      "Organization",
      "Speed",
      "Quality control",
    ],
    competences_specifiques: {
      medical: ["Medical", "Coding", "Billing", "Records", "HIPAA"],
      financial: ["Financial", "Accounting", "Invoices", "Payroll", "Compliance"],
      general: ["General", "CRM", "Inventory", "Orders", "Database"],
    },
    resume: "Data Entry Clerk précis avec expertise en saisie et gestion de données. Capacité à maintenir une haute précision et rapidité dans les tâches administratives. Orienté exactitude et efficacité.",
  },

  administrative_assistant: {
    competences: [
      "Administrative support",
      "Document preparation",
      "Filing",
      "Data entry",
      "Communication",
      "Scheduling",
      "Office equipment",
      "Software",
      "Organization",
      "Confidentiality",
    ],
    competences_specifiques: {
      legal: ["Legal", "Document", "Filing", "Terminology", "Confidentiality"],
      education: ["Education", "Student records", "Grading", "Communication", "Events"],
      government: ["Government", "Forms", "Regulations", "Public service", "Protocol"],
    },
    resume: "Administrative Assistant polyvalent avec expertise en soutien administratif et organisation. Capacité à gérer efficacement les tâches administratives et le flux de travail. Orienté organisation et service.",
  },

  librarian: {
    competences: [
      "Library science",
      "Cataloging",
      "Research",
      "Information management",
      "Customer service",
      "Technology",
      "Organization",
      "Archives",
      "Digital literacy",
      "Communication",
    ],
    competences_specifiques: {
      public: ["Public", "Community", "Programs", "Outreach", "Digital"],
      academic: ["Academic", "Research", "Databases", "Citation", "Instruction"],
      school: ["School", "Students", "Curriculum", "Literacy", "Collection"],
    },
    resume: "Bibliothécaire passionné avec expertise en gestion de l'information et service aux usagers. Capacité à organiser et faciliter l'accès aux ressources documentaires. Orienté connaissance et service.",
  },

  archivist: {
    competences: [
      "Archives",
      "Preservation",
      "Cataloging",
      "Research",
      "Digital archiving",
      "Organization",
      "History",
      "Documentation",
      "Conservation",
      "Access",
    ],
    competences_specifiques: {
      government: ["Government", "Records", "Classification", "Retention", "Freedom of information"],
      corporate: ["Corporate", "Records management", "Compliance", "History", "Governance"],
      cultural: ["Cultural", "Heritage", "Museum", "Special collections", "Digitization"],
    },
    resume: "Archiviste méticuleux avec expertise en préservation et gestion de documents. Capacité à organiser et conserver les archives pour les générations futures. Orienté patrimoine et accessibilité.",
  },

  curator: {
    competences: [
      "Curation",
      "Art history",
      "Exhibition design",
      "Research",
      "Collection management",
      "Education",
      "Public programming",
      "Networking",
      "Writing",
      "Fundraising",
    ],
    competences_specifiques: {
      art: ["Art", "Contemporary", "Modern", "Classical", "Sculpture"],
      history: ["History", "Archaeology", "Anthropology", "Cultural", "Society"],
      science: ["Science", "Natural history", "Technology", "Interactive", "Education"],
    },
    resume: "Conservateur expert avec expertise en gestion de collections et conception d'expositions. Capacité à créer des expériences éducatives et culturelles engageantes. Orienté culture et éducation.",
  },

  museum_director: {
    competences: [
      "Museum management",
      "Leadership",
      "Fundraising",
      "Strategic planning",
      "Collection management",
      "Public relations",
      "Budget",
      "Education",
      "Curation",
      "Community engagement",
    ],
    competences_specifiques: {
      art: ["Art museum", "Collection", "Acquisition", "Exhibition", "Gallery"],
      science: ["Science museum", "Interactive", "Education", "Planetarium", "Research"],
      history: ["History museum", "Heritage", "Archaeology", "Preservation", "Society"],
    },
    resume: "Directeur de musée visionnaire avec expertise en gestion culturelle et leadership. Capacité à développer l'institution et à engager le public. Orienté culture et accessibilité.",
  },

  nonprofit_manager: {
    competences: [
      "Nonprofit management",
      "Fundraising",
      "Grant writing",
      "Volunteer management",
      "Program development",
      "Budget management",
      "Advocacy",
      "Community outreach",
      "Mission-driven",
      "Stakeholder relations",
    ],
    competences_specifiques: {
      fundraising: ["Fundraising", "Donations", "Events", "Major gifts", "Corporate"],
      programs: ["Programs", "Services", "Impact", "Evaluation", "Reporting"],
      advocacy: ["Advocacy", "Policy", "Campaign", "Awareness", "Coalition"],
    },
    resume: "Directeur d'association dévoué avec expertise en gestion à but non lucratif et collecte de fonds. Capacité à développer des programmes impactants et à mobiliser les ressources. Orienté mission et impact social.",
  },

  social_worker: {
    competences: [
      "Social work",
      "Case management",
      "Counseling",
      "Advocacy",
      "Crisis intervention",
      "Resource coordination",
      "Assessment",
      "Communication",
      "Empathy",
      "Documentation",
    ],
    competences_specifiques: {
      child: ["Child welfare", "Foster care", "Adoption", "Protection", "Family"],
      mental: ["Mental health", "Therapy", "Recovery", "Support", "Crisis"],
      medical: ["Medical", "Hospital", "Discharge", "Support", "Resources"],
    },
    resume: "Travailleur social empathique avec expertise en soutien aux individus et familles. Capacité à naviguer les systèmes sociaux et à fournir un soutien essentiel. Orienté bien-être et autonomie.",
  },

  counselor: {
    competences: [
      "Counseling",
      "Active listening",
      "Assessment",
      "Treatment planning",
      "Crisis intervention",
      "Empathy",
      "Confidentiality",
      "Communication",
      "Resource referral",
      "Documentation",
    ],
    competences_specifiques: {
      mental: ["Mental health", "Anxiety", "Depression", "Trauma", "Recovery"],
      career: ["Career", "Vocational", "Assessment", "Planning", "Development"],
      substance: ["Substance abuse", "Addiction", "Recovery", "Support", "Prevention"],
    },
    resume: "Conseiller compatissant avec expertise en soutien psychologique et orientation. Capacité à aider les clients à surmonter les défis et à atteindre leurs objectifs. Orienté croissance et bien-être.",
  },

  therapist: {
    competences: [
      "Therapy",
      "Assessment",
      "Treatment",
      "Diagnosis",
      "Evidence-based practice",
      "Empathy",
      "Communication",
      "Documentation",
      "Ethics",
      "Continuous learning",
    ],
    competences_specifiques: {
      cbt: ["CBT", "Cognitive", "Behavioral", "Exposure", "Homework"],
      psychodynamic: ["Psychodynamic", "Psychoanalysis", "Unconscious", "Transference", "Insight"],
      humanistic: ["Humanistic", "Person-centered", "Existential", "Gestalt", "Self-actualization"],
    },
    resume: "Thérapeute qualifié avec expertise en psychothérapie et traitement des troubles mentaux. Capacité à fournir un espace sûr et efficace pour la guérison et la croissance. Orienté santé mentale et développement personnel.",
  },

  nutritionist: {
    competences: [
      "Nutrition",
      "Dietetics",
      "Meal planning",
      "Health education",
      "Assessment",
      "Counseling",
      "Research",
      "Communication",
      "Behavior change",
      "Science-based",
    ],
    competences_specifiques: {
      clinical: ["Clinical", "Hospital", "Medical nutrition", "Disease", "Treatment"],
      sports: ["Sports", "Performance", "Athletes", "Supplements", "Hydration"],
      weight: ["Weight management", "Obesity", "Eating disorders", "Behavior", "Sustainable"],
    },
    resume: "Nutritionniste expert avec expertise en alimentation et santé. Capacité à créer des plans nutritionnels personnalisés et à éduquer sur les habitudes saines. Orienté santé et bien-être.",
  },

  personal_trainer: {
    competences: [
      "Personal training",
      "Exercise science",
      "Anatomy",
      "Physiology",
      "Program design",
      "Motivation",
      "Safety",
      "Communication",
      "Business",
      "Customer service",
    ],
    competences_specifiques: {
      strength: ["Strength", "Hypertrophy", "Powerlifting", "Bodybuilding", "Progressive overload"],
      functional: ["Functional", "Movement", "Mobility", "Rehabilitation", "Daily life"],
      group: ["Group", "Classes", "Bootcamp", "Circuit", "Energy"],
    },
    resume: "Coach personnel passionné avec expertise en fitness et conditionnement physique. Capacité à créer des programmes d'entraînement personnalisés et motiver les clients. Orienté performance et santé.",
  },

  yoga_instructor: {
    competences: [
      "Yoga",
      "Anatomy",
      "Physiology",
      "Sequencing",
      "Meditation",
      "Breath work",
      "Philosophy",
      "Communication",
      "Safety",
      "Adaptation",
    ],
    competences_specifiques: {
      vinyasa: ["Vinyasa", "Flow", "Movement", "Breath", "Synchronization"],
      hatha: ["Hatha", "Static", "Alignment", "Holds", "Traditional"],
      restorative: ["Restorative", "Relaxation", "Props", "Gentle", "Healing"],
    },
    resume: "Instructeur de yoga expérimenté avec expertise en pratique et philosophie du yoga. Capacité à guider les étudiants vers le bien-être physique et mental. Orienté harmonie et conscience.",
  },

  massage_therapist: {
    competences: [
      "Massage therapy",
      "Anatomy",
      "Physiology",
      "Techniques",
      "Assessment",
      "Client care",
      "Hygiene",
      "Communication",
      "Business",
      "Specializations",
    ],
    competences_specifiques: {
      swedish: ["Swedish", "Relaxation", "Circulation", "Effleurage", "Petrissage"],
      deep: ["Deep tissue", "Muscle", "Trigger point", "Myofascial", "Rehabilitation"],
      sports: ["Sports", "Athletes", "Injury prevention", "Recovery", "Performance"],
    },
    resume: "Masseur-thérapeute qualifié avec expertise en techniques de massage et thérapie corporelle. Capacité à soulager la douleur et promouvoir la relaxation. Orienté bien-être et guérison.",
  },

  chiropractor: {
    competences: [
      "Chiropractic",
      "Spine",
      "Adjustment",
      "Anatomy",
      "Physiology",
      "Diagnosis",
      "X-ray",
      "Rehabilitation",
      "Nutrition",
      "Patient care",
    ],
    competences_specifiques: {
      spine: ["Spine", "Adjustment", "Alignment", "Subluxation", "Correction"],
      sports: ["Sports", "Injury", "Performance", "Prevention", "Rehabilitation"],
      pediatric: ["Pediatric", "Children", "Development", "Gentle", "Family"],
    },
    resume: "Chiropracteur expert avec expertise en santé vertébrale et ajustements. Capacité à soulager la douleur et améliorer la fonction corporelle. Orienté santé naturelle et mobilité.",
  },

  physical_therapist: {
    competences: [
      "Physical therapy",
      "Rehabilitation",
      "Anatomy",
      "Physiology",
      "Assessment",
      "Treatment planning",
      "Exercise",
      "Manual therapy",
      "Patient education",
      "Documentation",
    ],
    competences_specifiques: {
      orthopedic: ["Orthopedic", "Musculoskeletal", "Sports injury", "Post-surgical", "Joint"],
      neurological: ["Neurological", "Stroke", "Brain injury", "Spinal cord", "Movement"],
      pediatric: ["Pediatric", "Children", "Development", "Gross motor", "Play"],
    },
    resume: "Kinésithérapeute qualifié avec expertise en rééducation et réadaptation physique. Capacité à aider les patients à récupérer mobilité et fonction. Orienté récupération et qualité de vie.",
  },

  occupational_therapist: {
    competences: [
      "Occupational therapy",
      "Daily living skills",
      "Assessment",
      "Treatment planning",
      "Adaptation",
      "Mental health",
      "Pediatrics",
      "Geriatrics",
      "Rehabilitation",
      "Patient education",
    ],
    competences_specifiques: {
      pediatric: ["Pediatric", "Children", "Development", "Sensory", "School"],
      mental: ["Mental health", "Recovery", "Skills", "Independence", "Community"],
      hand: ["Hand therapy", "Upper extremity", "Splinting", "Fine motor", "Function"],
    },
    resume: "Ergothérapeute compatissant avec expertise en réadaptation fonctionnelle et autonomie. Capacité à aider les patients à accomplir les activités quotidiennes. Orienté indépendance et qualité de vie.",
  },

  pharmacist: {
    competences: [
      "Pharmacy",
      "Medication",
      "Drug interactions",
      "Patient counseling",
      "Compounding",
      "Pharmacology",
      "Regulations",
      "Inventory",
      "Healthcare",
      "Accuracy",
    ],
    competences_specifiques: {
      retail: ["Retail", "Community", "Patient", "OTC", "Vaccination"],
      hospital: ["Hospital", "Clinical", "IV", "Sterile", "Multidisciplinary"],
      industry: ["Industry", "Research", "Manufacturing", "Quality", "Regulatory"],
    },
    resume: "Pharmacien expert avec expertise en médicaments et conseil patient. Capacité à assurer la sécurité médicamenteuse et à optimiser les traitements. Orienté santé et précision.",
  },

  veterinarian: {
    competences: [
      "Veterinary medicine",
      "Animal care",
      "Diagnosis",
      "Surgery",
      "Pharmacology",
      "Client communication",
      "Emergency care",
      "Preventive care",
      "Anatomy",
      "Compassion",
    ],
    competences_specifiques: {
      small: ["Small animal", "Dogs", "Cats", "Pets", "Companion"],
      large: ["Large animal", "Horses", "Cows", "Farm", "Livestock"],
      exotic: ["Exotic", "Birds", "Reptiles", "Wildlife", "Specialized"],
    },
    resume: "Vétérinaire passionné avec expertise en médecine animale et soin des animaux. Capacité à diagnostiquer et traiter avec compassion et compétence. Orienté bien-être animal et santé.",
  },

  dental_hygienist: {
    competences: [
      "Dental hygiene",
      "Cleaning",
      "Patient education",
      "Oral health",
      "X-rays",
      "Periodontal care",
      "Preventive care",
      "Communication",
      "Instrumentation",
      "Documentation",
    ],
    competences_specifiques: {
      clinical: ["Clinical", "Scaling", "Root planing", "Polishing", "Fluoride"],
      pediatric: ["Pediatric", "Children", "Education", "Prevention", "Behavior"],
      periodontal: ["Periodontal", "Gum disease", "Deep cleaning", "Maintenance", "Home care"],
    },
    resume: "Hygiéniste dentaire qualifié avec expertise en santé bucco-dentaire et prévention. Capacité à éduquer les patients et à fournir des soins prophylactiques. Orienté prévention et santé orale.",
  },

  optometrist: {
    competences: [
      "Optometry",
      "Vision",
      "Eye exams",
      "Prescription",
      "Contact lenses",
      "Glasses",
      "Eye health",
      "Diagnosis",
      "Patient care",
      "Technology",
    ],
    competences_specifiques: {
      clinical: ["Clinical", "Exam", "Refraction", "Binocular", "Health"],
      contact: ["Contact lens", "Fitting", "Specialty", "RGP", "Multifocal"],
      vision: ["Vision therapy", "Binocular", "Pediatric", "Learning", "Strabismus"],
    },
    resume: "Optométriste expert avec expertise en santé visuelle et correction de la vue. Capacité à diagnostiquer les troubles visuels et à optimiser la vision des patients. Orienté santé oculaire et qualité de vie.",
  },

  audiologist: {
    competences: [
      "Audiology",
      "Hearing",
      "Balance",
      "Assessment",
      "Hearing aids",
      "Cochlear implants",
      "Rehabilitation",
      "Communication",
      "Technology",
      "Patient care",
    ],
    competences_specifiques: {
      diagnostic: ["Diagnostic", "Testing", "Evaluation", "Assessment", "Reporting"],
      hearing: ["Hearing aids", "Fitting", "Programming", "Verification", "Counseling"],
      pediatric: ["Pediatric", "Children", "Newborn", "Screening", "Early intervention"],
    },
    resume: "Audiologue spécialisé avec expertise en audition et équilibre. Capacité à diagnostiquer et traiter les troubles auditifs avec technologie avancée. Orienté communication et qualité de vie.",
  },

  speech_therapist: {
    competences: [
      "Speech therapy",
      "Communication",
      "Language",
      "Swallowing",
      "Assessment",
      "Treatment",
      "Pediatrics",
      "Adults",
      "Rehabilitation",
      "Evidence-based",
    ],
    competences_specifiques: {
      language: ["Language", "Articulation", "Phonology", "Delay", "Disorder"],
      fluency: ["Fluency", "Stuttering", "Cluttering", "Techniques", "Management"],
      swallowing: ["Swallowing", "Dysphagia", "Feeding", "Safe", "Rehabilitation"],
    },
    resume: "Orthophoniste qualifié avec expertise en troubles de la communication et déglutition. Capacité à aider les patients à améliorer leur parole et langage. Orienté communication et autonomie.",
  },

  respiratory_therapist: {
    competences: [
      "Respiratory therapy",
      "Lungs",
      "Breathing",
      "Ventilators",
      "Oxygen",
      "Assessment",
      "Emergency",
      "Critical care",
      "Patient education",
      "Teamwork",
    ],
    competences_specifiques: {
      critical: ["Critical care", "ICU", "Ventilator", "Emergency", "Life support"],
      pulmonary: ["Pulmonary", "Rehab", "Function", "Testing", "Education"],
      home: ["Home care", "Equipment", "Oxygen", "Sleep", "CPAP"],
    },
    resume: "Kinésithérapeute respiratoire expert avec expertise en soins respiratoires et ventilation. Capacité à gérer les troubles respiratoires critiques et chroniques. Orienté respiration et qualité de vie.",
  },

  radiologic_technologist: {
    competences: [
      "Radiology",
      "X-ray",
      "Imaging",
      "Patient care",
      "Positioning",
      "Safety",
      "Equipment",
      "Anatomy",
      "Quality control",
      "Communication",
    ],
    competences_specifiques: {
      xray: ["X-ray", "Diagnostic", "Fluoroscopy", "Mobile", "Surgery"],
      ct: ["CT", "Scanner", "Contrast", "3D", "Protocol"],
      mri: ["MRI", "Magnetic", "Safety", "Protocol", "Advanced"],
    },
    resume: "Technicien en radiologie qualifié avec expertise en imagerie médicale et soin patient. Capacité à produire des images diagnostiques de haute qualité. Orienté précision et sécurité.",
  },

  medical_sonographer: {
    competences: [
      "Ultrasound",
      "Sonography",
      "Imaging",
      "Anatomy",
      "Patient care",
      "Physics",
      "Equipment",
      "Doppler",
      "Assessment",
      "Communication",
    ],
    competences_specifiques: {
      obgyn: ["OB/GYN", "Pregnancy", "Fetal", "Gynecology", "High-risk"],
      cardiac: ["Echocardiogram", "Heart", "Doppler", "Valve", "Function"],
      vascular: ["Vascular", "Doppler", "Veins", "Arteries", "Blood flow"],
    },
    resume: "Échographiste médical expert avec expertise en imagerie ultrasonore. Capacité à réaliser des examens diagnostiques précis et à communiquer avec les patients. Orienté soin et diagnostic.",
  },

  nuclear_medicine_technologist: {
    competences: [
      "Nuclear medicine",
      "Radiopharmaceuticals",
      "Imaging",
      "PET",
      "SPECT",
      "Radiation safety",
      "Patient care",
      "Quality control",
      "Equipment",
      "Anatomy",
    ],
    competences_specifiques: {
      pet: ["PET", "Oncology", "Cardiology", "Neurology", "Quantification"],
      spect: ["SPECT", "Cardiac", "Bone", "Thyroid", "General"],
      therapy: ["Therapy", "Radioisotope", "Treatment", "Dosimetry", "Safety"],
    },
    resume: "Technicien en médecine nucléaire spécialisé avec expertise en imagerie fonctionnelle et radio-isotopes. Capacité à réaliser des examens diagnostiques avancés en toute sécurité. Orienté précision et protection.",
  },

  medical_laboratory_scientist: {
    competences: [
      "Medical laboratory",
      "Testing",
      "Analysis",
      "Hematology",
      "Microbiology",
      "Chemistry",
      "Quality control",
      "Equipment",
      "Accuracy",
      "Documentation",
    ],
    competences_specifiques: {
      hematology: ["Hematology", "Blood", "Cells", "CBC", "Coagulation"],
      microbiology: ["Microbiology", "Bacteria", "Virus", "Culture", "Sensitivity"],
      chemistry: ["Chemistry", "Enzymes", "Hormones", "Drugs", "Automation"],
    },
    resume: "Technicien de laboratoire médical rigoureux avec expertise en analyses biologiques. Capacité à fournir des résultats précis pour le diagnostic médical. Orienté exactitude et qualité.",
  },

  pathologist: {
    competences: [
      "Pathology",
      "Diagnosis",
      "Laboratory",
      "Histology",
      "Cytology",
      "Autopsy",
      "Medicine",
      "Research",
      "Communication",
      "Quality",
    ],
    competences_specifiques: {
      anatomical: ["Anatomical", "Surgical", "Biopsy", "Histology", "Diagnosis"],
      clinical: ["Clinical", "Laboratory", "Chemistry", "Hematology", "Interpretation"],
      forensic: ["Forensic", "Autopsy", "Death", "Legal", "Investigation"],
    },
    resume: "Pathologiste expert avec expertise en diagnostic pathologique et analyse tissulaire. Capacité à fournir des diagnostics précis essentiels au traitement. Orienté exactitude et médecine.",
  },

  epidemiologist: {
    competences: [
      "Epidemiology",
      "Public health",
      "Statistics",
      "Research",
      "Disease tracking",
      "Data analysis",
      "Surveillance",
      "Outbreak investigation",
      "Prevention",
      "Communication",
    ],
    competences_specifiques: {
      infectious: ["Infectious", "Outbreak", "Viral", "Bacterial", "Control"],
      chronic: ["Chronic", "Disease", "Risk factors", "Prevention", "Surveillance"],
      environmental: ["Environmental", "Exposure", "Toxicology", "Risk", "Assessment"],
    },
    resume: "Épidémiologiste expert avec expertise en surveillance des maladies et santé publique. Capacité à analyser les tendances de santé et à prévenir les épidémies. Orienté prévention et santé communautaire.",
  },

  public_health_specialist: {
    competences: [
      "Public health",
      "Health promotion",
      "Policy",
      "Epidemiology",
      "Program management",
      "Community health",
      "Advocacy",
      "Research",
      "Education",
      "Collaboration",
    ],
    competences_specifiques: {
      policy: ["Policy", "Advocacy", "Legislation", "Government", "Regulation"],
      program: ["Program", "Implementation", "Evaluation", "Community", "Outreach"],
      global: ["Global", "International", "NGO", "Development", "Health equity"],
    },
    resume: "Spécialiste en santé publique avec expertise en promotion de la santé et politiques. Capacité à développer des programmes de santé communautaire efficaces. Orienté équité et prévention.",
  },

  health_administrator: {
    competences: [
      "Health administration",
      "Healthcare management",
      "Leadership",
      "Finance",
      "Policy",
      "Quality",
      "Operations",
      "Strategic planning",
      "Regulations",
      "Communication",
    ],
    competences_specifiques: {
      hospital: ["Hospital", "Operations", "Departments", "Staff", "Patient flow"],
      clinic: ["Clinic", "Ambulatory", "Outpatient", "Efficiency", "Access"],
      public: ["Public", "Government", "Policy", "Population", "Funding"],
    },
    resume: "Administrateur de santé expérimenté avec expertise en gestion des établissements de santé. Capacité à optimiser les opérations et la qualité des soins. Orienté efficacité et patient.",
  },

  medical_writer: {
    competences: [
      "Medical writing",
      "Scientific writing",
      "Regulatory",
      "Clinical research",
      "Pharmacology",
      "Communication",
      "Accuracy",
      "Guidelines",
      "Documentation",
      "Research",
    ],
    competences_specifiques: {
      regulatory: ["Regulatory", "Submission", "FDA", "EMA", "Compliance"],
      promotional: ["Promotional", "Marketing", "Advertising", "Review", "Approval"],
      educational: ["Educational", "CME", "Materials", "Slides", "Monographs"],
    },
    resume: "Rédacteur médical expert avec expertise en communication scientifique et réglementaire. Capacité à traduire la science en contenu clair et conforme. Orienté précision et éducation.",
  },

  clinical_research_coordinator: {
    competences: [
      "Clinical research",
      "Coordination",
      "Regulatory",
      "Patient recruitment",
      "Data collection",
      "Protocol",
      "GCP",
      "Documentation",
      "Communication",
      "Organization",
    ],
    competences_specifiques: {
      industry: ["Industry", "Sponsor", "Monitoring", "Budget", "Timeline"],
      academic: ["Academic", "Grant", "Publication", "IRB", "Academic"],
      site: ["Site", "Patient", "Recruitment", "Retention", "Visit"],
    },
    resume: "Coordinateur de recherche clinique organisé avec expertise en gestion d'essais cliniques. Capacité à assurer la conformité et la qualité des données de recherche. Orienté rigueur et éthique.",
  },

  biostatistician: {
    competences: [
      "Biostatistics",
      "Statistics",
      "Data analysis",
      "Study design",
      "SAS",
      "R",
      "Clinical trials",
      "Epidemiology",
      "Research",
      "Communication",
    ],
    competences_specifiques: {
      clinical: ["Clinical", "Trials", "Protocol", "Analysis", "Reporting"],
      genetic: ["Genetic", "Genomics", "Bioinformatics", "GWAS", "Sequencing"],
      epidemiology: ["Epidemiology", "Cohort", "Case-control", "Survival", "Risk"],
    },
    resume: "Biostatisticien expert avec expertise en analyse statistique de données médicales. Capacité à concevoir des études et analyser les données avec rigueur. Orienté précision et découverte.",
  },

  bioinformatician: {
    competences: [
      "Bioinformatics",
      "Computational biology",
      "Genomics",
      "Programming",
      "Data analysis",
      "Algorithms",
      "Statistics",
      "Biology",
      "Research",
      "Visualization",
    ],
    competences_specifiques: {
      genomics: ["Genomics", "Sequencing", "Assembly", "Annotation", "Variant"],
      proteomics: ["Proteomics", "Mass spec", "Identification", "Quantification", "Pathway"],
      structural: ["Structural", "Modeling", "Docking", "Simulation", "Drug design"],
    },
    resume: "Bioinformaticien expert avec expertise en analyse computationnelle de données biologiques. Capacité à extraire des insights des données génomiques et moléculaires. Orienté découverte et innovation.",
  },

  genetic_counselor: {
    competences: [
      "Genetic counseling",
      "Genetics",
      "Risk assessment",
      "Communication",
      "Psychology",
      "Education",
      "Family history",
      "Testing",
      "Support",
      "Ethics",
    ],
    competences_specifiques: {
      prenatal: ["Prenatal", "Pregnancy", "Screening", "Diagnosis", "Reproductive"],
      cancer: ["Cancer", "Hereditary", "Risk", "Testing", "Prevention"],
      pediatric: ["Pediatric", "Children", "Developmental", "Syndrome", "Support"],
    },
    resume: "Conseiller en génétique compatissant avec expertise en évaluation des risques génétiques. Capacité à guider les familles dans les décisions de santé génétique. Orienté soutien et éducation.",
  },

  forensic_scientist: {
    competences: [
      "Forensic science",
      "DNA",
      "Evidence",
      "Analysis",
      "Laboratory",
      "Chain of custody",
      "Testimony",
      "Quality control",
      "Documentation",
      "Investigation",
    ],
    competences_specifiques: {
      dna: ["DNA", "Profiling", "STR", "Mitochondrial", "Database"],
      toxicology: ["Toxicology", "Drugs", "Poison", "Blood", "Urine"],
      ballistics: ["Ballistics", "Firearms", "Tool marks", "GSR", "Trajectory"],
    },
    resume: "Scientifique forensique expert avec expertise en analyse de preuves et enquête. Capacité à fournir des analyses scientifiques cruciales pour la justice. Orienté vérité et justice.",
  },

  crime_scene_investigator: {
    competences: [
      "Crime scene",
      "Evidence collection",
      "Photography",
      "Documentation",
      "Forensics",
      "Chain of custody",
      "Investigation",
      "Attention to detail",
      "Communication",
      "Testimony",
    ],
    competences_specifiques: {
      evidence: ["Evidence", "Collection", "Preservation", "Packaging", "Labeling"],
      photography: ["Photography", "Documentation", "Video", "Sketch", "Measurement"],
      bloodstain: ["Bloodstain", "Pattern", "Interpretation", "Spatter", "Reconstruction"],
    },
    resume: "Enquêteur de scène de crime méticuleux avec expertise en collecte et préservation de preuves. Capacité à documenter et analyser les scènes avec précision. Orienté justice et vérité.",
  },

  intelligence_analyst: {
    competences: [
      "Intelligence",
      "Analysis",
      "Research",
      "Security",
      "Risk assessment",
      "Critical thinking",
      "Communication",
      "Reporting",
      "Geopolitics",
      "Technology",
    ],
    competences_specifiques: {
      military: ["Military", "Tactical", "Strategic", "Threat", "Operations"],
      cyber: ["Cyber", "Threat", "Malware", "APT", "Attribution"],
      geopolitical: ["Geopolitical", "Political", "Economic", "Social", "Regional"],
    },
    resume: "Analyste du renseignement expert avec expertise en évaluation de menaces et analyse stratégique. Capacité à transformer l'information en intelligence actionnable. Orienté sécurité et prévention.",
  },

  security_analyst: {
    competences: [
      "Security",
      "Cybersecurity",
      "Threat analysis",
      "Incident response",
      "Monitoring",
      "SIEM",
      "Risk assessment",
      "Compliance",
      "Communication",
      "Investigation",
    ],
    competences_specifiques: {
      soc: ["SOC", "Monitoring", "Alert", "Triage", "Escalation"],
      threat: ["Threat", "Intel", "Hunting", "Malware", "Analysis"],
      compliance: ["Compliance", "Audit", "Policy", "Framework", "Assessment"],
    },
    resume: "Analyste de sécurité vigilant avec expertise en surveillance et réponse aux incidents. Capacité à détecter et analyser les menaces de sécurité. Orienté protection et résilience.",
  },

  penetration_tester: {
    competences: [
      "Penetration testing",
      "Ethical hacking",
      "Vulnerability assessment",
      "Network security",
      "Web security",
      "Exploitation",
      "Reporting",
      "Tools",
      "Methodology",
      "Communication",
    ],
    competences_specifiques: {
      network: ["Network", "Infrastructure", "Active Directory", "Cloud", "Wireless"],
      web: ["Web", "OWASP", "Injection", "XSS", "Authentication"],
      mobile: ["Mobile", "iOS", "Android", "App security", "Reverse engineering"],
    },
    resume: "Pentesteur expert avec expertise en tests d'intrusion et évaluation de vulnérabilités. Capacité à identifier et exploiter les failles de sécurité de manière éthique. Orienté sécurité et amélioration.",
  },

  cloud_architect: {
    competences: [
      "Cloud architecture",
      "AWS",
      "Azure",
      "GCP",
      "Design",
      "Security",
      "Cost optimization",
      "Migration",
      "DevOps",
      "Best practices",
    ],
    competences_specifiques: {
      aws: ["AWS", "EC2", "S3", "Lambda", "VPC", "IAM"],
      azure: ["Azure", "VM", "Blob", "Functions", "VNet", "AAD"],
      gcp: ["GCP", "Compute", "Storage", "Cloud Functions", "VPC", "IAM"],
    },
    resume: "Architecte cloud expert avec expertise en conception d'infrastructures cloud scalables et sécurisées. Capacité à optimiser les coûts et la performance. Orienté innovation et fiabilité.",
  },

  network_engineer: {
    competences: [
      "Networking",
      "Routing",
      "Switching",
      "Firewall",
      "VPN",
      "Troubleshooting",
      "Security",
      "Monitoring",
      "Configuration",
      "Documentation",
    ],
    competences_specifiques: {
      cisco: ["Cisco", "IOS", "NX-OS", "ASA", "ACI"],
      enterprise: ["Enterprise", "LAN", "WAN", "Data center", "Campus"],
      service_provider: ["Service provider", "MPLS", "BGP", "OSPF", "Optical"],
    },
    resume: "Ingénieur réseau expert avec expertise en conception et gestion d'infrastructures réseau. Capacité à assurer la connectivité et la sécurité des réseaux. Orienté performance et fiabilité.",
  },

  systems_administrator: {
    competences: [
      "System administration",
      "Linux",
      "Windows",
      "Server",
      "Virtualization",
      "Scripting",
      "Monitoring",
      "Backup",
      "Security",
      "Troubleshooting",
    ],
    competences_specifiques: {
      linux: ["Linux", "RHEL", "Ubuntu", "CentOS", "Shell"],
      windows: ["Windows", "Server", "Active Directory", "PowerShell", "Group Policy"],
      virtualization: ["Virtualization", "VMware", "Hyper-V", "KVM", "Docker"],
    },
    resume: "Administrateur système expérimenté avec expertise en gestion de serveurs et infrastructure. Capacité à maintenir la disponibilité et la sécurité des systèmes. Orienté stabilité et efficacité.",
  },

  database_administrator: {
    competences: [
      "Database",
      "SQL",
      "Performance",
      "Backup",
      "Recovery",
      "Security",
      "Monitoring",
      "Design",
      "Optimization",
      "Troubleshooting",
    ],
    competences_specifiques: {
      oracle: ["Oracle", "PL/SQL", "RAC", "Exadata", "GoldenGate"],
      mysql: ["MySQL", "MariaDB", "InnoDB", "Replication", "Cluster"],
      postgresql: ["PostgreSQL", "Extensions", "Replication", "Partitioning", "Performance"],
    },
    resume: "Administrateur de base de données expert avec expertise en optimisation et sécurité des données. Capacité à assurer la performance et la disponibilité des bases de données. Orienté intégrité et performance.",
  },

  mobile_developer: {
    competences: [
      "Mobile development",
      "iOS",
      "Android",
      "Swift",
      "Kotlin",
      "React Native",
      "Flutter",
      "UI/UX",
      "APIs",
      "App store",
    ],
    competences_specifiques: {
      ios: ["iOS", "Swift", "SwiftUI", "UIKit", "Core Data"],
      android: ["Android", "Kotlin", "Jetpack", "Room", "Material"],
      cross: ["Cross-platform", "React Native", "Flutter", "Ionic", "Xamarin"],
    },
    resume: "Développeur mobile expert avec expertise en création d'applications iOS et Android. Capacité à développer des applications performantes et intuitives. Orienté expérience utilisateur et qualité.",
  },

  game_developer: {
    competences: [
      "Game development",
      "Unity",
      "Unreal",
      "C#",
      "C++",
      "3D",
      "Physics",
      "AI",
      "Multiplayer",
      "Optimization",
    ],
    competences_specifiques: {
      unity: ["Unity", "C#", "2D", "3D", "Mobile"],
      unreal: ["Unreal", "C++", "Blueprint", "AAA", "Console"],
      mobile: ["Mobile", "Optimization", "Monetization", "Ads", "IAP"],
    },
    resume: "Développeur de jeux passionné avec expertise en création de jeux interactifs. Capacité à transformer des concepts en expériences de jeu engageantes. Orienté créativité et performance.",
  },

  embedded_systems_engineer: {
    competences: [
      "Embedded systems",
      "C",
      "C++",
      "Microcontrollers",
      "Firmware",
      "RTOS",
      "Hardware",
      "Debugging",
      "Testing",
      "Documentation",
    ],
    competences_specifiques: {
      automotive: ["Automotive", "CAN", "AUTOSAR", "ISO 26262", "Infotainment"],
      iot: ["IoT", "Sensors", "Connectivity", "Low power", "Wireless"],
      industrial: ["Industrial", "PLC", "Automation", "Safety", "Real-time"],
    },
    resume: "Ingénieur systèmes embarqués expert avec expertise en développement firmware et matériel. Capacité à créer des systèmes fiables et optimisés. Orienté performance et fiabilité.",
  },

  robotics_engineer: {
    competences: [
      "Robotics",
      "Mechatronics",
      "Control systems",
      "Programming",
      "Sensors",
      "AI",
      "Computer vision",
      "Kinematics",
      "Simulation",
      "Testing",
    ],
    competences_specifiques: {
      industrial: ["Industrial", "Automation", "PLC", "Safety", "Manufacturing"],
      service: ["Service", "Humanoid", "Navigation", "Interaction", "AI"],
      research: ["Research", "Prototyping", "Algorithms", "Simulation", "Academic"],
    },
    resume: "Ingénieur robotique innovant avec expertise en conception et programmation de robots. Capacité à créer des systèmes robotiques autonomes et intelligents. Orienté innovation et automatisation.",
  },

  ai_researcher: {
    competences: [
      "AI research",
      "Machine learning",
      "Deep learning",
      "Neural networks",
      "Python",
      "PyTorch",
      "TensorFlow",
      "Math",
      "Research",
      "Publication",
    ],
    competences_specifiques: {
      nlp: ["NLP", "Transformers", "BERT", "GPT", "Language models"],
      vision: ["Computer vision", "CNN", "Object detection", "Segmentation", "Recognition"],
      rl: ["Reinforcement learning", "Agents", "Policy", "Environment", "Simulation"],
    },
    resume: "Chercheur en IA expert avec expertise en machine learning et deep learning. Capacité à développer des algorithmes innovants et à publier des recherches. Orienté découverte et innovation.",
  },

  machine_learning_engineer: {
    competences: [
      "Machine learning",
      "Deep learning",
      "Python",
      "TensorFlow",
      "PyTorch",
      "Data preprocessing",
      "Model deployment",
      "MLOps",
      "Statistics",
      "Optimization",
    ],
    competences_specifiques: {
      production: ["Production", "Deployment", "Serving", "Monitoring", "Scaling"],
      research: ["Research", "Experimentation", "Prototyping", "Papers", "Innovation"],
      nlp: ["NLP", "Text", "Sentiment", "Translation", "Chatbots"],
    },
    resume: "Ingénieur machine learning expert avec expertise en développement et déploiement de modèles ML. Capacité à transformer la recherche en solutions production. Orienté performance et scalabilité.",
  },

  data_engineer: {
    competences: [
      "Data engineering",
      "ETL",
      "Data pipelines",
      "SQL",
      "Python",
      "Cloud",
      "Big data",
      "Data warehousing",
      "Streaming",
      "Quality",
    ],
    competences_specifiques: {
      batch: ["Batch", "ETL", "Airflow", "Spark", "Data warehouse"],
      streaming: ["Streaming", "Kafka", "Flink", "Real-time", "Event-driven"],
      cloud: ["Cloud", "AWS", "Azure", "GCP", "Data lake"],
    },
    resume: "Ingénieur de données expert avec expertise en conception de pipelines et architecture de données. Capacité à construire des infrastructures de données scalables et fiables. Orienté qualité et performance.",
  },

  blockchain_developer: {
    competences: [
      "Blockchain",
      "Smart contracts",
      "Solidity",
      "Web3",
      "Cryptography",
      "DeFi",
      "NFT",
      "DApps",
      "Ethereum",
      "Consensus",
    ],
    competences_specifiques: {
      ethereum: ["Ethereum", "Solidity", "EVM", "Gas", "Layer 2"],
      solana: ["Solana", "Rust", "Program", "Anchor", "Performance"],
      defi: ["DeFi", "DEX", "Lending", "Yield", "Protocol"],
    },
    resume: "Développeur blockchain expert avec expertise en smart contracts et applications décentralisées. Capacité à créer des solutions Web3 innovantes et sécurisées. Orienté innovation et décentralisation.",
  },

  quantum_computing_researcher: {
    competences: [
      "Quantum computing",
      "Quantum mechanics",
      "Algorithms",
      "Programming",
      "Physics",
      "Math",
      "Research",
      "Simulation",
      "Optimization",
      "Cryptography",
    ],
    competences_specifiques: {
      algorithms: ["Algorithms", "Grover", "Shor", "Optimization", "Simulation"],
      hardware: ["Hardware", "Qubits", "Superconducting", "Trapped ion", "Error correction"],
      applications: ["Applications", "Chemistry", "Finance", "Machine learning", "Cryptography"],
    },
    resume: "Chercheur en informatique quantique expert avec expertise en algorithmes quantiques et physique. Capacité à développer des solutions pour l'ère post-classique. Orienté innovation et découverte.",
  },

  ar_vr_developer: {
    competences: [
      "AR/VR",
      "Unity",
      "Unreal",
      "3D",
      "Computer vision",
      "Spatial computing",
      "UI/UX",
      "Mobile",
      "Optimization",
      "Interaction",
    ],
    competences_specifiques: {
      ar: ["AR", "ARKit", "ARCore", "Marker tracking", "Spatial"],
      vr: ["VR", "Oculus", "SteamVR", "Haptics", "Locomotion"],
      mr: ["MR", "Hololens", "Passthrough", "Spatial mapping", "Interaction"],
    },
    resume: "Développeur AR/VR expert avec expertise en création d'expériences immersives. Capacité à transformer la réalité avec des applications innovantes. Orienté immersion et innovation.",
  },

  iot_developer: {
    competences: [
      "IoT",
      "Embedded",
      "Sensors",
      "Connectivity",
      "Cloud",
      "Security",
      "Data",
      "Protocols",
      "Edge computing",
      "Automation",
    ],
    competences_specifiques: {
      hardware: ["Hardware", "ESP32", "Arduino", "Sensors", "Actuators"],
      connectivity: ["Connectivity", "WiFi", "BLE", "LoRa", "MQTT"],
      platform: ["Platform", "AWS IoT", "Azure IoT", "Google IoT", "Edge"],
    },
    resume: "Développeur IoT expert avec expertise en création de systèmes connectés intelligents. Capacité à intégrer hardware, software et cloud. Orienté connectivité et innovation.",
  },

  automotive_engineer: {
    competences: [
      "Automotive",
      "Mechanical",
      "Electrical",
      "Software",
      "Safety",
      "Regulations",
      "Testing",
      "Simulation",
      "Manufacturing",
      "Innovation",
    ],
    competences_specifiques: {
      ev: ["EV", "Battery", "Charging", "Power electronics", "Thermal"],
      autonomous: ["Autonomous", "ADAS", "Sensors", "AI", "Safety"],
      powertrain: ["Powertrain", "Engine", "Transmission", "Hybrid", "Efficiency"],
    },
    resume: "Ingénieur automobile expert avec expertise en conception et développement de véhicules. Capacité à innover dans les technologies automobiles futures. Orienté sécurité et innovation.",
  },

  aerospace_engineer: {
    competences: [
      "Aerospace",
      "Aerodynamics",
      "Propulsion",
      "Structures",
      "Materials",
      "Simulation",
      "Testing",
      "Safety",
      "Regulations",
      "Project management",
    ],
    competences_specifiques: {
      aircraft: ["Aircraft", "Fixed wing", "Rotorcraft", "Aerodynamics", "Structures"],
      space: ["Space", "Rockets", "Satellites", "Propulsion", "Orbital mechanics"],
      defense: ["Defense", "Military", "Systems", "Integration", "Compliance"],
    },
    resume: "Ingénieur aérospatial expert avec expertise en conception de véhicules aériens et spatiaux. Capacité à repousser les limites de l'ingénierie. Orienté innovation et excellence.",
  },

  civil_engineer: {
    competences: [
      "Civil engineering",
      "Structural",
      "Geotechnical",
      "Transportation",
      "Water resources",
      "Construction",
      "Project management",
      "Regulations",
      "Safety",
      "Sustainability",
    ],
    competences_specifiques: {
      structural: ["Structural", "Buildings", "Bridges", "Concrete", "Steel"],
      geotechnical: ["Geotechnical", "Foundations", "Soil", "Slope", "Earthworks"],
      transportation: ["Transportation", "Roads", "Highways", "Traffic", "Planning"],
    },
    resume: "Ingénieur civil expert avec expertise en conception d'infrastructures et construction. Capacité à créer des structures durables et sûres. Orienté qualité et durabilité.",
  },

  mechanical_engineer: {
    competences: [
      "Mechanical engineering",
      "CAD",
      "Thermodynamics",
      "Fluid mechanics",
      "Materials",
      "Manufacturing",
      "Design",
      "Simulation",
      "Testing",
      "Project management",
    ],
    competences_specifiques: {
      design: ["Design", "SolidWorks", "CATIA", "Inventor", "Fusion"],
      manufacturing: ["Manufacturing", "CNC", "3D printing", "Assembly", "Quality"],
      energy: ["Energy", "HVAC", "Thermal", "Power", "Efficiency"],
    },
    resume: "Ingénieur mécanique expert avec expertise en conception et fabrication de systèmes mécaniques. Capacité à optimiser les performances et la fiabilité. Orienté innovation et qualité.",
  },

  chemical_engineer: {
    competences: [
      "Chemical engineering",
      "Process",
      "Thermodynamics",
      "Kinetics",
      "Safety",
      "Environmental",
      "Scale-up",
      "Optimization",
      "Quality",
      "Project management",
    ],
    competences_specifiques: {
      petrochemical: ["Petrochemical", "Refining", "Distillation", "Catalysis", "Process"],
      pharmaceutical: ["Pharmaceutical", "Drug", "Formulation", "GMP", "Validation"],
      specialty: ["Specialty", "Polymers", "Coatings", "Adhesives", "Advanced materials"],
    },
    resume: "Ingénieur chimique expert avec expertise en procédés chimiques et optimisation. Capacité à développer des processus efficaces et durables. Orienté sécurité et innovation.",
  },

  materials_scientist: {
    competences: [
      "Materials science",
      "Characterization",
      "Testing",
      "Synthesis",
      "Properties",
      "Processing",
      "Research",
      "Innovation",
      "Sustainability",
      "Application",
    ],
    competences_specifiques: {
      metals: ["Metals", "Alloys", "Steel", "Aluminum", "Titanium"],
      polymers: ["Polymers", "Plastics", "Composites", "Elastomers", "Processing"],
      ceramics: ["Ceramics", "Glass", "Advanced", "Coatings", "Electronic"],
    },
    resume: "Scientifique des matériaux expert avec expertise en caractérisation et développement de matériaux. Capacité à créer des matériaux innovants pour diverses applications. Orienté innovation et performance.",
  },

  environmental_engineer: {
    competences: [
      "Environmental engineering",
      "Water treatment",
      "Air quality",
      "Waste management",
      "Sustainability",
      "Compliance",
      "Assessment",
      "Remediation",
      "Monitoring",
      "Project management",
    ],
    competences_specifiques: {
      water: ["Water", "Treatment", "Wastewater", "Desalination", "Distribution"],
      air: ["Air", "Emissions", "Control", "Monitoring", "Modeling"],
      waste: ["Waste", "Management", "Recycling", "Hazardous", "Landfill"],
    },
    resume: "Ingénieur environnement expert avec expertise en protection de l'environnement et durabilité. Capacité à développer des solutions pour les défis environnementaux. Orienté durabilité et innovation.",
  },

  energy_engineer: {
    competences: [
      "Energy engineering",
      "Renewable",
      "Efficiency",
      "Power systems",
      "Storage",
      "Grid",
      "Sustainability",
      "Economics",
      "Regulations",
      "Project management",
    ],
    competences_specifiques: {
      solar: ["Solar", "PV", "Thermal", "Design", "Installation"],
      wind: ["Wind", "Turbine", "Farm", "Resource", "Grid"],
      storage: ["Storage", "Battery", "Hydrogen", "Thermal", "Grid"],
    },
    resume: "Ingénieur énergétique expert avec expertise en énergies renouvelables et efficacité. Capacité à développer des solutions énergétiques durables. Orienté transition énergétique et innovation.",
  },

  nuclear_engineer: {
    competences: [
      "Nuclear engineering",
      "Reactor",
      "Safety",
      "Physics",
      "Thermodynamics",
      "Regulations",
      "Waste",
      "Shielding",
      "Quality",
      "Project management",
    ],
    competences_specifiques: {
      power: ["Power", "Reactor", "PWR", "BWR", "Operations"],
      research: ["Research", "Accelerator", "Fusion", "Materials", "Experimental"],
      medical: ["Medical", "Isotopes", "Imaging", "Therapy", "Safety"],
    },
    resume: "Ingénieur nucléaire expert avec expertise en réacteurs et sûreté nucléaire. Capacité à gérer les systèmes nucléaires avec rigueur et sécurité. Orienté sûreté et innovation.",
  },

  biomedical_engineer: {
    competences: [
      "Biomedical engineering",
      "Medical devices",
      "Biomaterials",
      "Tissue engineering",
      "Regulatory",
      "Design",
      "Testing",
      "Quality",
      "Research",
      "Innovation",
    ],
    competences_specifiques: {
      devices: ["Devices", "Implants", "Prosthetics", "Sensors", "Monitoring"],
      imaging: ["Imaging", "MRI", "CT", "Ultrasound", "Therapy"],
      tissue: ["Tissue", "Engineering", "Scaffolds", "Regeneration", "Bioprinting"],
    },
    resume: "Ingénieur biomédical expert avec expertise en dispositifs médicaux et ingénierie tissulaire. Capacité à développer des solutions innovantes pour la santé. Orienté innovation et qualité de vie.",
  },

  agricultural_engineer: {
    competences: [
      "Agricultural engineering",
      "Machinery",
      "Irrigation",
      "Automation",
      "Sustainability",
      "Precision",
      "Technology",
      "Project management",
      "Research",
      "Innovation",
    ],
    competences_specifiques: {
      machinery: ["Machinery", "Tractors", "Harvesters", "Automation", "Precision"],
      irrigation: ["Irrigation", "Water", "Drip", "Sprinkler", "Management"],
      precision: ["Precision", "GPS", "Sensors", "Drones", "Data"],
    },
    resume: "Ingénieur agricole expert avec expertise en mécanisation et technologies agricoles. Capacité à optimiser la production agricole avec durabilité. Orienté innovation et efficacité.",
  },

  food_scientist: {
    competences: [
      "Food science",
      "Chemistry",
      "Microbiology",
      "Processing",
      "Safety",
      "Quality",
      "Regulations",
      "Research",
      "Development",
      "Sustainability",
    ],
    competences_specifiques: {
      processing: ["Processing", "Thermal", "Preservation", "Packaging", "Shelf life"],
      safety: ["Safety", "HACCP", "Microbiology", "Testing", "Compliance"],
      development: ["Development", "Formulation", "Sensory", "Nutrition", "Clean label"],
    },
    resume: "Scientifique alimentaire expert avec expertise en science et technologie des aliments. Capacité à développer des produits sûrs et innovants. Orienté qualité et nutrition.",
  },

  packaging_engineer: {
    competences: [
      "Packaging",
      "Design",
      "Materials",
      "Testing",
      "Sustainability",
      "Regulations",
      "Cost",
      "Automation",
      "Supply chain",
      "Innovation",
    ],
    competences_specifiques: {
      design: ["Design", "Structural", "Graphics", "Branding", "User experience"],
      materials: ["Materials", "Plastic", "Paper", "Glass", "Sustainable"],
      machinery: ["Machinery", "Filling", "Sealing", "Labeling", "Automation"],
    },
    resume: "Ingénieur emballage expert avec expertise en conception et développement de solutions d'emballage. Capacité à créer des emballages fonctionnels et durables. Orienté innovation et durabilité.",
  },

  textile_engineer: {
    competences: [
      "Textile engineering",
      "Fibers",
      "Yarns",
      "Fabrics",
      "Finishing",
      "Quality",
      "Sustainability",
      "Innovation",
      "Testing",
      "Manufacturing",
    ],
    competences_specifiques: {
      technical: ["Technical", "Performance", "Protective", "Smart textiles", "Composites"],
      fashion: ["Fashion", "Apparel", "Design", "Trends", "Innovation"],
      home: ["Home", "Upholstery", "Carpets", "Technical", "Performance"],
    },
    resume: "Ingénieur textile expert avec expertise en fibres, tissus et finition. Capacité à développer des textiles innovants et durables. Orienté innovation et qualité.",
  },

  packaging_designer: {
    competences: [
      "Packaging design",
      "Graphic design",
      "Branding",
      "Sustainability",
      "Materials",
      "Structural design",
      "Printing",
      "Regulations",
      "Consumer behavior",
      "Innovation",
    ],
    competences_specifiques: {
      consumer: ["Consumer", "FMCG", "Retail", "Shelf impact", "Convenience"],
      luxury: ["Luxury", "Premium", "Unboxing", "Materials", "Craftsmanship"],
      sustainable: ["Sustainable", "Eco-friendly", "Recyclable", "Minimal", "Circular"],
    },
    resume: "Designer d'emballage créatif avec expertise en conception graphique et structurelle. Capacité à créer des emballages qui se démarquent et protègent le produit. Orienté innovation et durabilité.",
  },

  industrial_designer: {
    competences: [
      "Industrial design",
      "Product design",
      "CAD",
      "Prototyping",
      "Manufacturing",
      "Materials",
      "Ergonomics",
      "Aesthetics",
      "User experience",
      "Innovation",
    ],
    competences_specifiques: {
      consumer: ["Consumer", "Electronics", "Appliances", "Furniture", "Household"],
      medical: ["Medical", "Devices", "Equipment", "Ergonomics", "Safety"],
      automotive: ["Automotive", "Interior", "Exterior", "Exterior", "User experience"],
    },
    resume: "Designer industriel créatif avec expertise en conception de produits innovants. Capacité à allier esthétique, fonctionnalité et manufacturabilité. Orienté innovation et utilisateur.",
  },

  fashion_designer: {
    competences: [
      "Fashion design",
      "Sketching",
      "Pattern making",
      "Sewing",
      "Textiles",
      "Trends",
      "Collections",
      "Branding",
      "Manufacturing",
      "Creativity",
    ],
    competences_specifiques: {
      womenswear: ["Womenswear", "Dresses", "Ready-to-wear", "Couture", "Evening"],
      menswear: ["Menswear", "Suits", "Casual", "Streetwear", "Tailoring"],
      accessories: ["Accessories", "Bags", "Shoes", "Jewelry", "Belts"],
    },
    resume: "Styliste créatif avec expertise en conception de collections de mode. Capacité à créer des pièces originales qui reflètent les tendances. Orienté créativité et style.",
  },

  interior_decorator: {
    competences: [
      "Interior decoration",
      "Color",
      "Furniture",
      "Lighting",
      "Textiles",
      "Accessories",
      "Space planning",
      "Styling",
      "Trends",
      "Client relations",
    ],
    competences_specifiques: {
      residential: ["Residential", "Living room", "Bedroom", "Kitchen", "Bathroom"],
      commercial: ["Commercial", "Office", "Retail", "Restaurant", "Hotel"],
      staging: ["Staging", "Real estate", "Sale", "Neutral", "Appeal"],
    },
    resume: "Décorateur d'intérieur talentueux avec expertise en aménagement esthétique d'espaces. Capacité à transformer les intérieurs avec style et fonctionnalité. Orienté beauté et confort.",
  },

  landscape_architect: {
    competences: [
      "Landscape architecture",
      "Design",
      "Plants",
      "Hardscape",
      "Grading",
      "Drainage",
      "Sustainability",
      "Ecology",
      "Project management",
      "Visualization",
    ],
    competences_specifiques: {
      residential: ["Residential", "Garden", "Patio", "Pool", "Outdoor living"],
      commercial: ["Commercial", "Campus", "Park", "Plaza", "Green roof"],
      ecological: ["Ecological", "Restoration", "Native", "Habitat", "Sustainability"],
    },
    resume: "Architecte paysagiste expert avec expertise en conception d'espaces extérieurs durables. Capacité à créer des environnements naturels fonctionnels et esthétiques. Orienté écologie et qualité de vie.",
  },

  urban_planner: {
    competences: [
      "Urban planning",
      "Zoning",
      "Transportation",
      "Land use",
      "Policy",
      "Community",
      "Sustainability",
      "GIS",
      "Analysis",
      "Design",
    ],
    competences_specifiques: {
      comprehensive: ["Comprehensive", "Master plan", "Zoning", "Land use", "Policy"],
      transportation: ["Transportation", "Transit", "Streets", "Pedestrian", "Bike"],
      environmental: ["Environmental", "Green infrastructure", "Resilience", "Climate", "Sustainability"],
    },
    resume: "Urbaniste expert avec expertise en planification et développement urbain durable. Capacité à créer des villes fonctionnelles et vivables. Orienté durabilité et qualité de vie.",
  },

  real_estate_developer: {
    competences: [
      "Real estate development",
      "Finance",
      "Construction",
      "Market analysis",
      "Project management",
      "Regulations",
      "Negotiation",
      "Risk management",
      "Investment",
      "Vision",
    ],
    competences_specifiques: {
      residential: ["Residential", "Multi-family", "Single-family", "Condo", "Mixed-use"],
      commercial: ["Commercial", "Office", "Retail", "Industrial", "Hospitality"],
      redevelopment: ["Redevelopment", "Adaptive reuse", "Renovation", "Historic", "Brownfield"],
    },
    resume: "Promoteur immobilier stratégique avec expertise en développement de projets immobiliers. Capacité à transformer des opportunités en projets rentables. Orienté vision et valeur ajoutée.",
  },

  property_manager: {
    competences: [
      "Property management",
      "Tenant relations",
      "Maintenance",
      "Leasing",
      "Budget",
      "Marketing",
      "Legal",
      "Financial",
      "Operations",
      "Customer service",
    ],
    competences_specifiques: {
      residential: ["Residential", "Apartment", "Condo", "HOA", "Student housing"],
      commercial: ["Commercial", "Office", "Retail", "Industrial", "Medical"],
      association: ["Association", "HOA", "Community", "Rules", "Governance"],
    },
    resume: "Gestionnaire immobilier expérimenté avec expertise en gestion de biens et relations locataires. Capacité à maximiser la rentabilité tout en maintenant la satisfaction. Orienté service et performance.",
  },

  facilities_manager: {
    competences: [
      "Facilities management",
      "Maintenance",
      "Operations",
      "Budget",
      "Vendor management",
      "Safety",
      "Sustainability",
      "Project management",
      "Space planning",
      "Compliance",
    ],
    competences_specifiques: {
      corporate: ["Corporate", "Office", "HQ", "Campus", "Multi-site"],
      healthcare: ["Healthcare", "Hospital", "Clinic", "Compliance", "Safety"],
      education: ["Education", "University", "School", "Campus", "D dormitory"],
    },
    resume: "Gestionnaire d'installations expert avec expertise en maintenance et optimisation des infrastructures. Capacité à assurer le bon fonctionnement des installations. Orienté efficacité et satisfaction.",
  },

  construction_manager: {
    competences: [
      "Construction management",
      "Project management",
      "Safety",
      "Budget",
      "Scheduling",
      "Quality",
      "Subcontractors",
      "Contracts",
      "Building codes",
      "Leadership",
    ],
    competences_specifiques: {
      commercial: ["Commercial", "Office", "Retail", "Hospitality", "Mixed-use"],
      residential: ["Residential", "Multi-family", "Custom", "Renovation", "Remodel"],
      infrastructure: ["Infrastructure", "Road", "Bridge", "Utility", "Public works"],
    },
    resume: "Chef de construction expérimenté avec expertise en gestion de projets de construction. Capacité à livrer des projets dans les délais et budgets. Orienté qualité et sécurité.",
  },

  surveyor: {
    competences: [
      "Surveying",
      "Measurement",
      "Mapping",
      "GPS",
      "CAD",
      "Legal",
      "Boundary",
      "Topography",
      "Construction",
      "Equipment",
    ],
    competences_specifiques: {
      land: ["Land", "Boundary", "Title", "ALTA", "Subdivision"],
      construction: ["Construction", "Layout", "As-built", "Monitoring", "Control"],
      topographic: ["Topographic", "Elevation", "Contour", "Site", "Grading"],
    },
    resume: "Géomètre expert avec expertise en mesure et cartographie des terrains. Capacité à fournir des données précises pour la construction et l'aménagement. Orienté précision et conformité.",
  },

  cartographer: {
    competences: [
      "Cartography",
      "GIS",
      "Mapping",
      "Data visualization",
      "Spatial analysis",
      "Design",
      "Remote sensing",
      "Geography",
      "Technology",
      "Research",
    ],
    competences_specifiques: {
      thematic: ["Thematic", "Statistical", "Demographic", "Economic", "Social"],
      topographic: ["Topographic", "Physical", "Elevation", "Terrain", "Natural"],
      navigation: ["Navigation", "Road", "Maritime", "Aeronautical", "Transit"],
    },
    resume: "Cartographe expert avec expertise en création de cartes et analyse spatiale. Capacité à visualiser les données géographiques de manière claire et précise. Orienté précision et communication.",
  },

  geologist: {
    competences: [
      "Geology",
      "Fieldwork",
      "Mapping",
      "Sampling",
      "Analysis",
      "Minerals",
      "Rocks",
      "Interpretation",
      "Report writing",
      "Safety",
    ],
    competences_specifiques: {
      exploration: ["Exploration", "Mining", "Minerals", "Drilling", "Resource"],
      environmental: ["Environmental", "Hydrogeology", "Contamination", "Remediation", "Assessment"],
      engineering: ["Engineering", "Geotechnical", "Foundation", "Slope", "Stability"],
    },
    resume: "Géologue expert avec expertise en étude de la terre et ses ressources. Capacité à analyser les formations géologiques et évaluer les risques. Orienté découverte et sécurité.",
  },

  meteorologist: {
    competences: [
      "Meteorology",
      "Weather forecasting",
      "Climate",
      "Atmospheric science",
      "Data analysis",
      "Modeling",
      "Communication",
      "Technology",
      "Research",
      "Public safety",
    ],
    competences_specifiques: {
      forecasting: ["Forecasting", "Short-term", "Severe", "Winter", "Tropical"],
      climate: ["Climate", "Long-term", "Trends", "Change", "Variability"],
      broadcast: ["Broadcast", "TV", "Radio", "Social media", "Communication"],
    },
    resume: "Météorologue expert avec expertise en prévision météorologique et climatologie. Capacité à analyser les données atmosphériques et communiquer les risques. Orienté précision et sécurité publique.",
  },

  oceanographer: {
    competences: [
      "Oceanography",
      "Marine science",
      "Data collection",
      "Analysis",
      "Fieldwork",
      "Modeling",
      "Climate",
      "Ecosystems",
      "Technology",
      "Research",
    ],
    competences_specifiques: {
      physical: ["Physical", "Currents", "Waves", "Tides", "Circulation"],
      biological: ["Biological", "Marine life", "Ecosystems", "Plankton", "Food web"],
      chemical: ["Chemical", "Water quality", "Pollution", "Acidification", "Nutrients"],
    },
    resume: "Océanographe expert avec expertise en étude des océans et écosystèmes marins. Capacité à comprendre et protéger les environnements océaniques. Orienté recherche et conservation.",
  },

  marine_biologist: {
    competences: [
      "Marine biology",
      "Ecology",
      "Research",
      "Fieldwork",
      "Data analysis",
      "Conservation",
      "Species identification",
      "Sampling",
      "Communication",
      "Diving",
    ],
    competences_specifiques: {
      conservation: ["Conservation", "Endangered", "Habitat", "Protection", "Policy"],
      research: ["Research", "Population", "Behavior", "Genetics", "Evolution"],
      aquaculture: ["Aquaculture", "Farming", "Sustainable", "Production", "Health"],
    },
    resume: "Biologiste marin passionné avec expertise en écosystèmes marins et conservation. Capacité à étudier et protéger la vie marine. Orienté conservation et découverte.",
  },

  wildlife_biologist: {
    competences: [
      "Wildlife biology",
      "Ecology",
      "Conservation",
      "Research",
      "Fieldwork",
      "Data collection",
      "Species management",
      "Habitat",
      "Policy",
      "Education",
    ],
    competences_specifiques: {
      conservation: ["Conservation", "Endangered", "Recovery", "Habitat", "Management"],
      research: ["Research", "Population", "Behavior", "Genetics", "Monitoring"],
      management: ["Management", "Game", "Non-game", "Permits", "Regulations"],
    },
    resume: "Biologiste de la faune expert avec expertise en conservation et gestion de la faune sauvage. Capacité à étudier et protéger les espèces et habitats. Orienté conservation et équilibre écologique.",
  },

  ecologist: {
    competences: [
      "Ecology",
      "Ecosystems",
      "Research",
      "Fieldwork",
      "Data analysis",
      "Conservation",
      "Restoration",
      "Climate",
      "Biodiversity",
      "Policy",
    ],
    competences_specifiques: {
      restoration: ["Restoration", "Wetlands", "Forests", "Prairie", "Rehabilitation"],
      climate: ["Climate", "Change", "Adaptation", "Mitigation", "Resilience"],
      urban: ["Urban", "Green infrastructure", "Biodiversity", "Pollution", "Planning"],
    },
    resume: "Écologue expert avec expertise en écosystèmes et conservation environnementale. Capacité à étudier et restaurer les environnements naturels. Orienté durabilité et biodiversité.",
  },

  environmental_scientist: {
    competences: [
      "Environmental science",
      "Analysis",
      "Sampling",
      "Regulations",
      "Compliance",
      "Remediation",
      "Assessment",
      "Research",
      "Communication",
      "Project management",
    ],
    competences_specifiques: {
      compliance: ["Compliance", "Permits", "Reporting", "Audits", "Regulations"],
      remediation: ["Remediation", "Contamination", "Cleanup", "Brownfield", "Superfund"],
      assessment: ["Assessment", "EIA", "Phase I", "Phase II", "Risk"],
    },
    resume: "Scientifique environnemental expert avec expertise en analyse et conformité environnementale. Capacité à évaluer et atténuer les impacts environnementaux. Orienté protection et conformité.",
  },

  sustainability_specialist: {
    competences: [
      "Sustainability",
      "ESG",
      "Carbon",
      "Energy",
      "Waste",
      "Reporting",
      "Strategy",
      "Stakeholder engagement",
      "Certification",
      "Innovation",
    ],
    competences_specifiques: {
      corporate: ["Corporate", "ESG", "Reporting", "Strategy", "CDP"],
      energy: ["Energy", "Renewable", "Efficiency", "Carbon", "Net zero"],
      circular: ["Circular", "Economy", "Waste", "Recycling", "Lifecycle"],
    },
    resume: "Spécialiste durabilité expert avec expertise en stratégie ESG et développement durable. Capacité à guider les organisations vers la durabilité. Orienté impact et responsabilité.",
  },

  renewable_energy_specialist: {
    competences: [
      "Renewable energy",
      "Solar",
      "Wind",
      "Storage",
      "Grid",
      "Policy",
      "Finance",
      "Technology",
      "Project development",
      "Sustainability",
    ],
    competences_specifiques: {
      solar: ["Solar", "PV", "Utility", "Distributed", "Storage"],
      wind: ["Wind", "Onshore", "Offshore", "Development", "Grid"],
      storage: ["Storage", "Battery", "Grid scale", "Duration", "Integration"],
    },
    resume: "Spécialiste énergies renouvelables expert avec expertise en développement de projets d'énergie propre. Capacité à accélérer la transition énergétique. Orienté innovation et durabilité.",
  },

  climate_change_analyst: {
    competences: [
      "Climate change",
      "Data analysis",
      "Modeling",
      "Policy",
      "Adaptation",
      "Mitigation",
      "Research",
      "Communication",
      "Risk assessment",
      "Sustainability",
    ],
    competences_specifiques: {
      adaptation: ["Adaptation", "Resilience", "Vulnerability", "Planning", "Infrastructure"],
      mitigation: ["Mitigation", "Carbon", "Emissions", "Sequestration", "Net zero"],
      policy: ["Policy", "Regulation", "International", "Compliance", "Reporting"],
    },
    resume: "Analyste changement climatique expert avec expertise en analyse et politique climatique. Capacité à évaluer les risques et développer des stratégies d'adaptation. Orienté action et durabilité.",
  },

  water_resource_engineer: {
    competences: [
      "Water resources",
      "Hydrology",
      "Hydraulics",
      "Modeling",
      "Treatment",
      "Distribution",
      "Quality",
      "Sustainability",
      "Project management",
      "Regulations",
    ],
    competences_specifiques: {
      supply: ["Supply", "Treatment", "Distribution", "Storage", "Resilience"],
      stormwater: ["Stormwater", "Management", "Green infrastructure", "Flood", "Quality"],
      wastewater: ["Wastewater", "Treatment", "Reuse", "Biosolids", "Resource recovery"],
    },
    resume: "Ingénieur ressources hydriques expert avec expertise en gestion et traitement de l'eau. Capacité à assurer la sécurité et durabilité des ressources en eau. Orienté qualité et durabilité.",
  },

  waste_management_specialist: {
    competences: [
      "Waste management",
      "Recycling",
      "Composting",
      "Landfill",
      "Policy",
      "Sustainability",
      "Circular economy",
      "Regulations",
      "Operations",
      "Innovation",
    ],
    competences_specifiques: {
      recycling: ["Recycling", "Materials", "Sorting", "Processing", "Markets"],
      organic: ["Organic", "Composting", "Anaerobic digestion", "Bioenergy", "Soil"],
      hazardous: ["Hazardous", "Special waste", "Treatment", "Disposal", "Safety"],
    },
    resume: "Spécialiste gestion des déchets expert avec expertise en recyclage et économie circulaire. Capacité à optimiser la gestion des déchets et minimiser l'impact. Orienté durabilité et innovation.",
  },

  air_quality_specialist: {
    competences: [
      "Air quality",
      "Monitoring",
      "Modeling",
      "Regulations",
      "Emissions",
      "Permitting",
      "Compliance",
      "Health",
      "Technology",
      "Data analysis",
    ],
    competences_specifiques: {
      monitoring: ["Monitoring", "Sensors", "Network", "Real-time", "Data"],
      modeling: ["Modeling", "Dispersion", "AERMOD", "CALPUFF", "GIS"],
      compliance: ["Compliance", "Permits", "NSPS", "NESHAP", "Title V"],
    },
    resume: "Spécialiste qualité de l'air expert avec expertise en surveillance et conformité atmosphérique. Capacité à protéger la santé publique et l'environnement. Orienté santé et conformité.",
  },

  noise_control_engineer: {
    competences: [
      "Noise control",
      "Acoustics",
      "Measurement",
      "Modeling",
      "Mitigation",
      "Regulations",
      "Design",
      "Testing",
      "Consulting",
      "Standards",
    ],
    competences_specifiques: {
      environmental: ["Environmental", "Community", "Impact", "Assessment", "Mitigation"],
      industrial: ["Industrial", "Occupational", "OSHA", "Hearing", "Protection"],
      building: ["Building", "Architectural", "Isolation", "HVAC", "Design"],
    },
    resume: "Ingénieur acoustique expert avec expertise en contrôle du bruit et acoustique. Capacité à réduire l'exposition au bruit et améliorer l'environnement sonore. Orienté confort et conformité.",
  },

  ergonomist: {
    competences: [
      "Ergonomics",
      "Human factors",
      "Assessment",
      "Design",
      "Safety",
      "Health",
      "Research",
      "Consulting",
      "Standards",
      "Optimization",
    ],
    competences_specifiques: {
      physical: ["Physical", "Lifting", "Posture", "Workstation", "Manual handling"],
      cognitive: ["Cognitive", "Mental workload", "Decision making", "Interface", "Usability"],
      organizational: ["Organizational", "Work design", "Scheduling", "Team", "Culture"],
    },
    resume: "Ergonome expert avec expertise en optimisation des conditions de travail. Capacité à améliorer la santé, sécurité et productivité. Orienté bien-être et performance.",
  },

  occupational_health_specialist: {
    competences: [
      "Occupational health",
      "Safety",
      "Risk assessment",
      "Compliance",
      "Wellness",
      "Ergonomics",
      "Training",
      "Programs",
      "Case management",
      "Regulations",
    ],
    competences_specifiques: {
      industrial: ["Industrial", "Hazards", "Exposure", "Monitoring", "Controls"],
      healthcare: ["Healthcare", "Infectious", "Safety", "Sharps", "Ergonomics"],
      office: ["Office", "Ergonomics", "Stress", "Wellness", "Mental health"],
    },
    resume: "Spécialiste santé au travail expert avec expertise en prévention et promotion de la santé. Capacité à créer des environnements de travail sûrs et sains. Orienté bien-être et prévention.",
  },

  safety_engineer: {
    competences: [
      "Safety engineering",
      "Risk assessment",
      "Hazard analysis",
      "Compliance",
      "Training",
      "Incident investigation",
      "Design",
      "Standards",
      "Auditing",
      "Management",
    ],
    competences_specifiques: {
      process: ["Process", "Chemical", "PHA", "LOPA", "SIL"],
      construction: ["Construction", "Fall protection", "Electrical", "Excavation", "Heavy equipment"],
      fire: ["Fire", "Protection", "Suppression", "Alarm", "Egress"],
    },
    resume: "Ingénieur sécurité expert avec expertise en prévention des accidents et gestion des risques. Capacité à créer des environnements de travail sûrs. Orienté protection et conformité.",
  },

  emergency_manager: {
    competences: [
      "Emergency management",
      "Preparedness",
      "Response",
      "Recovery",
      "Planning",
      "Coordination",
      "Communication",
      "Training",
      "Exercises",
      "Policy",
    ],
    competences_specifiques: {
      natural: ["Natural", "Hurricane", "Flood", "Earthquake", "Wildfire"],
      technological: ["Technological", "Industrial", "Chemical", "Nuclear", "Cyber"],
      public_health: ["Public health", "Pandemic", "Epidemic", "Biological", "Medical surge"],
    },
    resume: "Gestionnaire d'urgence expert avec expertise en préparation et réponse aux catastrophes. Capacité à coordonner les interventions et protéger les communautés. Orienté résilience et sécurité.",
  },

  disaster_recovery_specialist: {
    competences: [
      "Disaster recovery",
      "Business continuity",
      "Risk assessment",
      "Planning",
      "Testing",
      "IT",
      "Communication",
      "Coordination",
      "Recovery",
      "Resilience",
    ],
    competences_specifiques: {
      it: ["IT", "Systems", "Data", "Cloud", "Cyber"],
      facilities: ["Facilities", "Infrastructure", "Power", "Cooling", "Space"],
      business: ["Business", "Operations", "Supply chain", "Finance", "Reputation"],
    },
    resume: "Spécialiste reprise après sinistre expert avec expertise en continuité des activités et résilience. Capacité à assurer la reprise rapide après interruption. Orienté résilience et continuité.",
  },

  risk_manager: {
    competences: [
      "Risk management",
      "Assessment",
      "Mitigation",
      "Insurance",
      "Compliance",
      "Analysis",
      "Strategy",
      "Reporting",
      "Communication",
      "Quantitative",
    ],
    competences_specifiques: {
      financial: ["Financial", "Market", "Credit", "Operational", "Liquidity"],
      operational: ["Operational", "Process", "Supply chain", "Reputation", "Strategic"],
      insurance: ["Insurance", "Claims", "Underwriting", "Pricing", "Portfolio"],
    },
    resume: "Gestionnaire de risques expert avec expertise en identification et atténuation des risques. Capacité à protéger l'organisation contre les pertes. Orienté protection et résilience.",
  },

  insurance_underwriter: {
    competences: [
      "Underwriting",
      "Risk assessment",
      "Analysis",
      "Pricing",
      "Policy",
      "Regulations",
      "Communication",
      "Decision making",
      "Industry knowledge",
      "Sales",
    ],
    competences_specifiques: {
      property: ["Property", "Commercial", "Residential", "Casualty", "CAT"],
      casualty: ["Casualty", "Liability", "Auto", "Workers comp", "General liability"],
      specialty: ["Specialty", "Professional", "D&O", "Cyber", "Surety"],
    },
    resume: "Souscripteur d'assurances expert avec expertise en évaluation des risques et tarification. Capacité à prendre des décisions souscriptrices éclairées. Orienté profit et protection.",
  },

  insurance_claims_adjuster: {
    competences: [
      "Claims",
      "Investigation",
      "Assessment",
      "Negotiation",
      "Communication",
      "Documentation",
      "Regulations",
      "Customer service",
      "Technical knowledge",
      "Settlement",
    ],
    competences_specifiques: {
      property: ["Property", "Damage", "Repair", "Replacement", "Valuation"],
      auto: ["Auto", "Collision", "Liability", "Medical", "Total loss"],
      liability: ["Liability", "Bodily injury", "Property damage", "Defense", "Settlement"],
    },
    resume: "Expert sinistres expert avec expertise en investigation et règlement des réclamations. Capacité à gérer efficacement les sinistres avec équité. Orienté service et équité.",
  },

  actuary: {
    competences: [
      "Actuarial science",
      "Statistics",
      "Mathematics",
      "Risk",
      "Insurance",
      "Pricing",
      "Reserving",
      "Modeling",
      "Analysis",
      "Communication",
    ],
    competences_specifiques: {
      life: ["Life", "Annuity", "Pension", "Long-term care", "Mortality"],
      property: ["Property", "Casualty", "CAT", "Reserving", "Pricing"],
      health: ["Health", "Medical", "Prescription", "Utilization", "Pricing"],
    },
    resume: "Actuaire expert avec expertise en analyse des risques et tarification d'assurances. Capacité à modéliser et prédire les risques financiers. Orienté précision et solvabilité.",
  },

  financial_planner: {
    competences: [
      "Financial planning",
      "Investment",
      "Retirement",
      "Tax",
      "Estate",
      "Insurance",
      "Budgeting",
      "Risk management",
      "Communication",
      "Relationships",
    ],
    competences_specifiques: {
      retirement: ["Retirement", "401k", "IRA", "Social Security", "Pension"],
      estate: ["Estate", "Trust", "Will", "Probate", "Tax"],
      investment: ["Investment", "Portfolio", "Asset allocation", "Rebalancing", "Performance"],
    },
    resume: "Planificateur financier expert avec expertise en planification financière globale. Capacité à aider les clients à atteindre leurs objectifs financiers. Orienté sécurité et croissance.",
  },

  investment_advisor: {
    competences: [
      "Investment",
      "Portfolio",
      "Analysis",
      "Markets",
      "Risk",
      "Regulations",
      "Communication",
      "Relationships",
      "Research",
      "Strategy",
    ],
    competences_specifiques: {
      equities: ["Equities", "Stocks", "Analysis", "Valuation", "Sectors"],
      fixed: ["Fixed income", "Bonds", "Yield", "Duration", "Credit"],
      alternative: ["Alternative", "Real estate", "Private equity", "Hedge fund", "Commodities"],
    },
    resume: "Conseiller en investissement expert avec expertise en gestion de portefeuille et marchés financiers. Capacité à optimiser les rendements selon les objectifs. Orienté croissance et préservation.",
  },

  wealth_manager: {
    competences: [
      "Wealth management",
      "Investment",
      "Estate planning",
      "Tax planning",
      "Philanthropy",
      "Trust",
      "Family office",
      "Relationships",
      "Comprehensive",
      "High net worth",
    ],
    competences_specifiques: {
      family: ["Family", "Multi-generational", "Governance", "Education", "Succession"],
      business: ["Business", "Liquidity", "Concentration", "Planning", "Exit"],
      philanthropic: ["Philanthropic", "Giving", "Foundation", "Impact", "Legacy"],
    },
    resume: "Gestionnaire de fortune expert avec expertise en gestion patrimoniale globale. Capacité à servir les clients fortunés avec solutions personnalisées. Orienté préservation et transmission.",
  },

  private_banker: {
    competences: [
      "Private banking",
      "Wealth management",
      "Investment",
      "Credit",
      "Relationship",
      "Service",
      "Discretion",
      "Global",
      "Sophisticated",
      "Customized",
    ],
    competences_specifiques: {
      lending: ["Lending", "Credit", "Secured", "Margin", "Structured"],
      investment: ["Investment", "Portfolio", "Alternative", "Structured", "Global"],
      concierge: ["Concierge", "Lifestyle", "Travel", "Events", "Access"],
    },
    resume: "Banquier privé expert avec expertise en gestion de fortune et services personnalisés. Capacité à offrir une expérience bancaire exclusive. Orienté service et excellence.",
  },

  loan_officer: {
    competences: [
      "Lending",
      "Credit",
      "Underwriting",
      "Sales",
      "Communication",
      "Compliance",
      "Analysis",
      "Customer service",
      "Products",
      "Relationships",
    ],
    competences_specifiques: {
      mortgage: ["Mortgage", "Residential", "Refinance", "HELOC", "Government"],
      commercial: ["Commercial", "Real estate", "SBA", "Construction", "Term"],
      consumer: ["Consumer", "Auto", "Personal", "Credit card", "Unsecured"],
    },
    resume: "Officier de prêt expert avec expertise en crédit et souscription. Capacité à structurer des prêts adaptés aux besoins des clients. Orienté service et conformité.",
  },

  credit_analyst: {
    competences: [
      "Credit",
      "Analysis",
      "Risk",
      "Financial statements",
      "Ratios",
      "Industry",
      "Research",
      "Reporting",
      "Decision making",
      "Communication",
    ],
    competences_specifiques: {
      corporate: ["Corporate", "Financial", "Covenants", "Structure", "Industry"],
      consumer: ["Consumer", "Score", "Behavior", "Income", "Debt"],
      real_estate: ["Real estate", "Property", "Cash flow", "Market", "Valuation"],
    },
    resume: "Analyste crédit expert avec expertise en évaluation du risque de crédit. Capacité à analyser les états financiers et prendre des décisions de crédit. Orienté risque et rentabilité.",
  },

  treasury_analyst: {
    competences: [
      "Treasury",
      "Cash management",
      "Liquidity",
      "Banking",
      "Investment",
      "Risk",
      "Forecasting",
      "Systems",
      "Reporting",
      "Compliance",
    ],
    competences_specifiques: {
      cash: ["Cash", "Forecasting", "Pooling", "Sweeping", "Concentration"],
      banking: ["Banking", "Relationships", "Services", "Fees", "Global"],
      investment: ["Investment", "Short-term", "Money market", "Securities", "Yield"],
    },
    resume: "Analyste trésorerie expert avec expertise en gestion de trésorerie et liquidité. Capacité à optimiser la position de trésorerie de l'entreprise. Orienté efficacité et liquidité.",
  },

  compliance_officer: {
    competences: [
      "Compliance",
      "Regulations",
      "Risk",
      "Audit",
      "Policy",
      "Training",
      "Monitoring",
      "Reporting",
      "Investigation",
      "Ethics",
    ],
    competences_specifiques: {
      financial: ["Financial", "AML", "KYC", "SEC", "Banking"],
      healthcare: ["Healthcare", "HIPAA", "Medicare", "Fraud", "Billing"],
      corporate: ["Corporate", "Governance", "Ethics", "Code of conduct", "Policy"],
    },
    resume: "Officier conformité expert avec expertise en réglementation et gestion des risques. Capacité à assurer la conformité organisationnelle. Orienté intégrité et conformité.",
  },

  internal_auditor: {
    competences: [
      "Internal audit",
      "Risk",
      "Controls",
      "Governance",
      "Compliance",
      "Process",
      "Financial",
      "Operational",
      "IT",
      "Communication",
    ],
    competences_specifiques: {
      financial: ["Financial", "Sarbanes-Oxley", "Revenue", "Inventory", "Fixed assets"],
      operational: ["Operational", "Efficiency", "Process", "Supply chain", "Quality"],
      it: ["IT", "Cyber", "Access", "Change management", "Disaster recovery"],
    },
    resume: "Auditeur interne expert avec expertise en évaluation des contrôles et risques. Capacité à fournir des assurances indépendantes sur les processus. Orienté amélioration et conformité.",
  },

  external_auditor: {
    competences: [
      "External audit",
      "Financial statements",
      "GAAP",
      "IFRS",
      "Risk",
      "Controls",
      "Sampling",
      "Reporting",
      "Communication",
      "Independence",
    ],
    competences_specifiques: {
      financial: ["Financial", "Balance sheet", "Income statement", "Cash flow", "Equity"],
      public: ["Public", "SEC", "PCAOB", "Sarbanes-Oxley", "Issuer"],
      nonprofit: ["Nonprofit", "Fund accounting", "Grants", "Compliance", "Reporting"],
    },
    resume: "Auditeur externe expert avec expertise en audit des états financiers. Capacité à fournir une opinion indépendante sur la fiabilité financière. Orienté intégrité et qualité.",
  },

  forensic_accountant: {
    competences: [
      "Forensic accounting",
      "Investigation",
      "Fraud",
      "Litigation",
      "Analysis",
      "Interview",
      "Report writing",
      "Testimony",
      "Accounting",
      "Legal",
    ],
    competences_specifiques: {
      fraud: ["Fraud", "Asset misappropriation", "Corruption", "Financial statement", "Bribery"],
      litigation: ["Litigation", "Damages", "Valuation", "Expert testimony", "Discovery"],
      investigation: ["Investigation", "Interview", "Evidence", "Documentation", "Analysis"],
    },
    resume: "Expert-comptable judiciaire expert avec expertise en investigation financière et fraude. Capacité à détecter et documenter les irrégularités financières. Orienté vérité et justice.",
  },

  tax_advisor: {
    competences: [
      "Tax",
      "Planning",
      "Compliance",
      "Regulations",
      "Research",
      "Strategy",
      "Communication",
      "International",
      "Corporate",
      "Individual",
    ],
    competences_specifiques: {
      corporate: ["Corporate", "Income", "Transfer pricing", "International", "State"],
      individual: ["Individual", "Income", "Estate", "Gift", "International"],
      indirect: ["Indirect", "VAT", "Sales", "Excise", "Customs"],
    },
    resume: "Conseiller fiscal expert avec expertise en planification et conformité fiscale. Capacité à optimiser la charge fiscale légalement. Orienté stratégie et conformité.",
  },

  customs_broker: {
    competences: [
      "Customs",
      "Import",
      "Export",
      "Compliance",
      "Tariffs",
      "Classification",
      "Documentation",
      "Regulations",
      "Logistics",
      "Communication",
    ],
    competences_specifiques: {
      import: ["Import", "Entry", "Duty", "Tariff", "Classification"],
      export: ["Export", "EAR", "ITAR", "License", "Compliance"],
      compliance: ["Compliance", "Audit", "Record keeping", "Penalty", "Resolution"],
    },
    resume: "Courtier en douane expert avec expertise en réglementation douanière et commerce international. Capacité à faciliter les importations/exportations en conformité. Orienté efficacité et conformité.",
  },

  supply_chain_manager: {
    competences: [
      "Supply chain",
      "Logistics",
      "Procurement",
      "Inventory",
      "Demand planning",
      "Sourcing",
      "Transportation",
      "Warehousing",
      "Technology",
      "Sustainability",
    ],
    competences_specifiques: {
      global: ["Global", "International", "Import", "Export", "Customs"],
      manufacturing: ["Manufacturing", "Production", "MRP", "Capacity", "Quality"],
      retail: ["Retail", "Omnichannel", "E-commerce", "Fulfillment", "Last mile"],
    },
    resume: "Gestionnaire supply chain expert avec expertise en logistique et approvisionnement. Capacité à optimiser les flux de bout en bout. Orienté efficacité et résilience.",
  },

  procurement_specialist: {
    competences: [
      "Procurement",
      "Sourcing",
      "Negotiation",
      "Supplier management",
      "Contracts",
      "Cost analysis",
      "Sustainability",
      "Risk",
      "Compliance",
      "Category management",
    ],
    competences_specifiques: {
      direct: ["Direct", "Raw materials", "Components", "Production", "Quality"],
      indirect: ["Indirect", "Services", "MRO", "Office", "Professional"],
      strategic: ["Strategic", "Category", "Sourcing", "Spend analysis", "Value"],
    },
    resume: "Spécialiste approvisionnement expert avec expertise en sourcing et gestion fournisseurs. Capacité à optimiser les achats et créer de la valeur. Orienté coût et qualité.",
  },

  logistics_manager: {
    competences: [
      "Logistics",
      "Transportation",
      "Warehousing",
      "Distribution",
      "Inventory",
      "Technology",
      "Cost control",
      "Customer service",
      "Compliance",
      "Optimization",
    ],
    competences_specifiques: {
      inbound: ["Inbound", "Receiving", "Put-away", "Vendor", "Quality"],
      outbound: ["Outbound", "Picking", "Packing", "Shipping", "Delivery"],
      reverse: ["Reverse", "Returns", "RMA", "Refurbishment", "Disposal"],
    },
    resume: "Gestionnaire logistique expert avec expertise en transport et distribution. Capacité à optimiser les opérations logistiques. Orienté efficacité et service client.",
  },

  warehouse_manager: {
    competences: [
      "Warehouse",
      "Inventory",
      "Operations",
      "Team management",
      "Safety",
      "Technology",
      "Quality",
      "Efficiency",
      "Layout",
      "Process",
    ],
    competences_specifiques: {
      fulfillment: ["Fulfillment", "E-commerce", "Picking", "Packing", "Shipping"],
      distribution: ["Distribution", "Cross-dock", "Bulk", "Pallet", "LTL"],
      cold_chain: ["Cold chain", "Temperature", "Food", "Pharma", "Compliance"],
    },
    resume: "Gestionnaire d'entrepôt expert avec expertise en opérations et gestion des stocks. Capacité à optimiser l'efficacité et la précision. Orienté productivité et qualité.",
  },

  freight_forwarder: {
    competences: [
      "Freight forwarding",
      "Transportation",
      "Customs",
      "Documentation",
      "Logistics",
      "Global",
      "Negotiation",
      "Tracking",
      "Compliance",
      "Problem solving",
    ],
    competences_specifiques: {
      ocean: ["Ocean", "FCL", "LCL", "Container", "Carrier"],
      air: ["Air", "Cargo", "Charter", "Consolidation", "Transit time"],
      ground: ["Ground", "Truck", "Rail", "Cross-border", "Intermodal"],
    },
    resume: "Transitaire expert avec expertise en coordination du fret international. Capacité à gérer les expéditions complexes de bout en bout. Orienté fiabilité et efficacité.",
  },

  import_export_specialist: {
    competences: [
      "Import/export",
      "Customs",
      "Compliance",
      "Documentation",
      "Logistics",
      "Trade regulations",
      "Incoterms",
      "Negotiation",
      "Market knowledge",
      "Risk management",
    ],
    competences_specifiques: {
      import: ["Import", "Customs", "Duty", "Tariff", "Compliance"],
      export: ["Export", "Controls", "License", "Documentation", "Market"],
      trade: ["Trade", "Agreements", "FTAs", "Preferences", "Rules of origin"],
    },
    resume: "Spécialiste import/export expert avec expertise en réglementation commerciale internationale. Capacité à faciliter le commerce en conformité. Orienté croissance et conformité.",
  },

  purchasing_manager: {
    competences: [
      "Purchasing",
      "Procurement",
      "Negotiation",
      "Supplier management",
      "Cost control",
      "Quality",
      "Inventory",
      "Contracts",
      "Strategic sourcing",
      "Team leadership",
    ],
    competences_specifiques: {
      manufacturing: ["Manufacturing", "Raw materials", "Production", "Quality", "Just-in-time"],
      retail: ["Retail", "Merchandise", "Seasonal", "Trend", "Margin"],
      services: ["Services", "Professional", "MRO", "Facilities", "Consulting"],
    },
    resume: "Gestionnaire des achats expert avec expertise en négociation et gestion fournisseurs. Capacité à optimiser les coûts tout en maintenant la qualité. Orienté valeur et performance.",
  },

  vendor_manager: {
    competences: [
      "Vendor management",
      "Supplier relationships",
      "Performance",
      "Contracts",
      "Negotiation",
      "Risk",
      "Compliance",
      "Communication",
      "Strategic sourcing",
      "Cost control",
    ],
    competences_specifiques: {
      strategic: ["Strategic", "Partnership", "Innovation", "Collaboration", "Value"],
      operational: ["Operational", "SLA", "KPI", "Performance", "Day-to-day"],
      category: ["Category", "Spend", "Consolidation", "Benchmarking", "Sourcing"],
    },
    resume: "Gestionnaire fournisseurs expert avec expertise en relations stratégiques et performance. Capacité à maximiser la valeur des partenariats fournisseurs. Orienté collaboration et excellence.",
  },

  quality_assurance_manager: {
    competences: [
      "Quality assurance",
      "Quality control",
      "Standards",
      "ISO",
      "Auditing",
      "Process improvement",
      "Root cause",
      "Compliance",
      "Documentation",
      "Leadership",
    ],
    competences_specifiques: {
      manufacturing: ["Manufacturing", "Production", "Inspection", "Testing", "SPC"],
      software: ["Software", "Testing", "Automation", "CI/CD", "Agile"],
      service: ["Service", "SLA", "Customer satisfaction", "Process", "Training"],
    },
    resume: "Gestionnaire qualité expert avec expertise en assurance qualité et amélioration continue. Capacité à maintenir les standards et optimiser les processus. Orienté excellence et conformité.",
  },

  quality_control_inspector: {
    competences: [
      "Quality control",
      "Inspection",
      "Testing",
      "Measurement",
      "Documentation",
      "Standards",
      "Nonconformance",
      "Reporting",
      "Communication",
      "Attention to detail",
    ],
    competences_specifiques: {
      manufacturing: ["Manufacturing", "Parts", "Assembly", "Dimensional", "Visual"],
      food: ["Food", "Safety", "HACCP", "Microbial", "Sensory"],
      construction: ["Construction", "Materials", "Workmanship", "Code", "Specification"],
    },
    resume: "Inspecteur qualité méticuleux avec expertise en contrôle et inspection. Capacité à assurer la conformité des produits et processus. Orienté qualité et précision.",
  },

  production_manager: {
    competences: [
      "Production",
      "Manufacturing",
      "Planning",
      "Scheduling",
      "Quality",
      "Safety",
      "Cost",
      "Efficiency",
      "Team leadership",
      "Continuous improvement",
    ],
    competences_specifiques: {
      discrete: ["Discrete", "Assembly", "BOM", "Routing", "Work order"],
      process: ["Process", "Continuous", "Chemical", "Formula", "Recipe"],
      batch: ["Batch", "Lot", "Traceability", "Expiration", "Recipe"],
    },
    resume: "Gestionnaire de production expert avec expertise en planification et optimisation manufacturière. Capacité à maximiser l'efficacité et la qualité. Orienté performance et excellence opérationnelle.",
  },

  plant_manager: {
    competences: [
      "Plant management",
      "Manufacturing",
      "Operations",
      "Safety",
      "Quality",
      "Budget",
      "Team leadership",
      "Continuous improvement",
      "Maintenance",
      "Regulatory",
    ],
    competences_specifiques: {
      automotive: ["Automotive", "Assembly", "Just-in-time", "Lean", "TPS"],
      food: ["Food", "Safety", "HACCP", "GMP", "Sanitation"],
      chemical: ["Chemical", "Process", "Safety", "Environmental", "HAZMAT"],
    },
    resume: "Directeur d'usine expérimenté avec expertise en gestion d'opérations manufacturières. Capacité à optimiser la production et assurer la sécurité. Orienté excellence et performance.",
  },

  operations_research_analyst: {
    competences: [
      "Operations research",
      "Optimization",
      "Modeling",
      "Statistics",
      "Simulation",
      "Linear programming",
      "Data analysis",
      "Problem solving",
      "Mathematics",
      "Communication",
    ],
    competences_specifiques: {
      logistics: ["Logistics", "Routing", "Network", "Facility location", "Inventory"],
      scheduling: ["Scheduling", "Workforce", "Production", "Project", "Timetable"],
      pricing: ["Pricing", "Revenue management", "Yield", "Dynamic", "Optimization"],
    },
    resume: "Analyste recherche opérationnelle expert avec expertise en optimisation et modélisation mathématique. Capacité à résoudre des problèmes complexes avec des solutions quantitatives. Orienté efficacité et optimisation.",
  },

  business_intelligence_analyst: {
    competences: [
      "Business intelligence",
      "Data warehousing",
      "ETL",
      "Reporting",
      "Dashboards",
      "SQL",
      "Visualization",
      "Analysis",
      "Requirements",
      "Communication",
    ],
    competences_specifiques: {
      reporting: ["Reporting", "Reports", "Scheduled", "Distribution", "Subscription"],
      dashboards: ["Dashboards", "KPI", "Scorecards", "Drill-down", "Interactive"],
      data: ["Data", "Modeling", "Dimension", "Fact", "Quality"],
    },
    resume: "Analyste BI expert avec expertise en intelligence d'affaires et visualisation de données. Capacité à transformer les données en insights actionnables. Orienté décision et performance.",
  },

  data_warehouse_architect: {
    competences: [
      "Data warehouse",
      "Architecture",
      "ETL",
      "Modeling",
      "SQL",
      "Cloud",
      "Performance",
      "Quality",
      "Governance",
      "Security",
    ],
    competences_specifiques: {
      kimball: ["Kimball", "Dimensional", "Star schema", "Conformed", "Bus"],
      inmon: ["Inmon", "Corporate", "Normalized", "Integration", "Enterprise"],
      cloud: ["Cloud", "Snowflake", "Redshift", "BigQuery", "Azure"],
    },
    resume: "Architecte entrepôt de données expert avec expertise en conception d'architectures data. Capacité à créer des infrastructures de données scalables et performantes. Orienté qualité et accessibilité.",
  },

  etl_developer: {
    competences: [
      "ETL",
      "Data integration",
      "SQL",
      "Scripting",
      "Data quality",
      "Scheduling",
      "Performance",
      "Troubleshooting",
      "Documentation",
      "Collaboration",
    ],
    competences_specifiques: {
      informatica: ["Informatica", "PowerCenter", "Mappings", "Transformations", "Workflows"],
      talend: ["Talend", "Jobs", "Components", "Routes", "Studio"],
      custom: ["Custom", "Python", "Spark", "Airflow", "dbt"],
    },
    resume: "Développeur ETL expert avec expertise en intégration et transformation de données. Capacité à créer des pipelines de données fiables et performants. Orienté qualité et efficacité.",
  },

  database_architect: {
    competences: [
      "Database architecture",
      "Design",
      "Modeling",
      "Performance",
      "Scalability",
      "Security",
      "Cloud",
      "NoSQL",
      "SQL",
      "Best practices",
    ],
    competences_specifiques: {
      relational: ["Relational", "Normalization", "Schema", "Indexing", "Partitioning"],
      nosql: ["NoSQL", "Document", "Key-value", "Graph", "Time-series"],
      cloud: ["Cloud", "Serverless", "Managed", "Multi-region", "Global"],
    },
    resume: "Architecte de base de données expert avec expertise en conception et optimisation de bases de données. Capacité à créer des architectures de données scalables et sécurisées. Orienté performance et fiabilité.",
  },

  data_governance_specialist: {
    competences: [
      "Data governance",
      "Policy",
      "Quality",
      "Lineage",
      "Catalog",
      "Security",
      "Privacy",
      "Compliance",
      "Stewardship",
      "Standards",
    ],
    competences_specifiques: {
      quality: ["Quality", "Profiling", "Cleansing", "Validation", "Monitoring"],
      security: ["Security", "Access", "Classification", "Masking", "Encryption"],
      privacy: ["Privacy", "GDPR", "CCPA", "Consent", "Rights"],
    },
    resume: "Spécialiste gouvernance des données expert avec expertise en politique et qualité des données. Capacité à établir des cadres de gouvernance efficaces. Orienté conformité et confiance.",
  },

  data_privacy_officer: {
    competences: [
      "Data privacy",
      "GDPR",
      "CCPA",
      "Compliance",
      "Policy",
      "Risk assessment",
      "Incident response",
      "Training",
      "Communication",
      "Legal",
    ],
    competences_specifiques: {
      gdpr: ["GDPR", "DPO", "PIA", "Breach", "Rights"],
      ccpa: ["CCPA", "Consumer", "Opt-out", "Sale", "Disclosure"],
      healthcare: ["Healthcare", "HIPAA", "PHI", "BAA", "Privacy"],
    },
    resume: "DPO expert avec expertise en protection des données et conformité réglementaire. Capacité à assurer la protection de la vie privée des données. Orienté conformité et confiance.",
  },

  chief_information_officer: {
    competences: [
      "CIO",
      "IT strategy",
      "Leadership",
      "Digital transformation",
      "Budget",
      "Vendor management",
      "Governance",
      "Innovation",
      "Security",
      "Communication",
    ],
    competences_specifiques: {
      strategy: ["Strategy", "Digital", "Transformation", "Innovation", "Alignment"],
      operations: ["Operations", "Infrastructure", "Support", "Service", "Availability"],
      governance: ["Governance", "Risk", "Compliance", "Audit", "Policy"],
    },
    resume: "DSI visionnaire avec expertise en stratégie informatique et transformation digitale. Capacité à aligner la technologie sur les objectifs business. Orienté innovation et valeur.",
  },

  chief_technology_officer: {
    competences: [
      "CTO",
      "Technology strategy",
      "Innovation",
      "Architecture",
      "Engineering",
      "Research",
      "Leadership",
      "Product",
      "Scalability",
      "Vision",
    ],
    competences_specifiques: {
      startup: ["Startup", "MVP", "Growth", "Fundraising", "Culture"],
      enterprise: ["Enterprise", "Legacy", "Modernization", "Integration", "Governance"],
      product: ["Product", "Technology", "Platform", "API", "Ecosystem"],
    },
    resume: "CTO innovant avec expertise en stratégie technologique et leadership technique. Capacité à diriger l'innovation et l'excellence technique. Orienté vision et exécution.",
  },

  chief_information_security_officer: {
    competences: [
      "CISO",
      "Cybersecurity",
      "Risk management",
      "Compliance",
      "Incident response",
      "Security architecture",
      "Leadership",
      "Governance",
      "Budget",
      "Communication",
    ],
    competences_specifiques: {
      strategy: ["Strategy", "Risk", "Governance", "Compliance", "Framework"],
      operations: ["Operations", "SOC", "Monitoring", "Response", "Threat"],
      architecture: ["Architecture", "Zero trust", "Cloud", "Identity", "Network"],
    },
    resume: "CISO expert avec expertise en cybersécurité et gestion des risques. Capacité à protéger l'organisation contre les menaces cybernétiques. Orienté sécurité et résilience.",
  },

  chief_data_officer: {
    competences: [
      "CDO",
      "Data strategy",
      "Governance",
      "Analytics",
      "AI",
      "Privacy",
      "Quality",
      "Monetization",
      "Leadership",
      "Culture",
    ],
    competences_specifiques: {
      strategy: ["Strategy", "Monetization", "Value", "Use cases", "ROI"],
      governance: ["Governance", "Quality", "Lineage", "Catalog", "Stewardship"],
      analytics: ["Analytics", "BI", "ML", "AI", "Insights"],
    },
    resume: "CDO stratégique avec expertise en gouvernance et valorisation des données. Capacité à transformer les données en actif stratégique. Orienté valeur et innovation.",
  },

  chief_marketing_officer: {
    competences: [
      "CMO",
      "Marketing strategy",
      "Brand",
      "Digital",
      "Growth",
      "Budget",
      "Leadership",
      "Analytics",
      "Customer",
      "Innovation",
    ],
    competences_specifiques: {
      brand: ["Brand", "Positioning", "Identity", "Awareness", "Loyalty"],
      digital: ["Digital", "Performance", "Social", "Content", "SEO"],
      growth: ["Growth", "Acquisition", "Retention", "Revenue", "ROI"],
      },
    resume: "CMO créatif avec expertise en stratégie marketing et croissance. Capacité à développer la marque et générer des résultats. Orienté innovation et performance.",
  },

  chief_financial_officer: {
    competences: [
      "CFO",
      "Finance",
      "Accounting",
      "Strategy",
      "Planning",
      "Risk",
      "Compliance",
      "Capital",
      "Leadership",
      "Communication",
    ],
    competences_specifiques: {
      planning: ["Planning", "Budget", "Forecast", "KPI", "Analysis"],
      treasury: ["Treasury", "Cash", "Banking", "Debt", "Capital"],
      investor: ["Investor", "Relations", "Reporting", "Roadshow", "Compliance"],
    },
    resume: "CFO stratégique avec expertise en finance et gestion des risques. Capacité à optimiser la performance financière et guider la stratégie. Orienté croissance et stabilité.",
  },

  chief_human_resources_officer: {
    competences: [
      "CHRO",
      "HR strategy",
      "Talent",
      "Culture",
      "Compensation",
      "Learning",
      "Compliance",
      "Leadership",
      "Analytics",
      "Employee experience",
    ],
    competences_specifiques: {
      talent: ["Talent", "Acquisition", "Development", "Succession", "Mobility"],
      culture: ["Culture", "Engagement", "D&I", "Well-being", "Values"],
      operations: ["Operations", "Payroll", "Benefits", "HRIS", "Service"],
    },
    resume: "DRH stratégique avec expertise en gestion des talents et culture organisationnelle. Capacité à aligner les RH sur la stratégie business. Orienté talent et culture.",
  },

  chief_operating_officer: {
    competences: [
      "COO",
      "Operations",
      "Strategy",
      "Execution",
      "Process",
      "Efficiency",
      "Leadership",
      "P&L",
      "Cross-functional",
      "Continuous improvement",
    ],
    competences_specifiques: {
      operations: ["Operations", "Manufacturing", "Supply chain", "Logistics", "Quality"],
      strategy: ["Strategy", "Execution", "KPI", "Performance", "Growth"],
      turnaround: ["Turnaround", "Restructuring", "Cost", "Efficiency", "Change"],
    },
    resume: "COO opérationnel avec expertise en gestion des opérations et exécution stratégique. Capacité à optimiser les performances et guider la croissance. Orienté excellence et résultats.",
  },

  chief_executive_officer: {
    competences: [
      "CEO",
      "Leadership",
      "Strategy",
      "Vision",
      "Decision making",
      "Communication",
      "Board",
      "Investor relations",
      "Culture",
      "P&L",
    ],
    competences_specifiques: {
      startup: ["Startup", "Fundraising", "Growth", "Product", "Team"],
      turnaround: ["Turnaround", "Restructuring", "Crisis", "Stakeholders", "Recovery"],
      growth: ["Growth", "Scale", "International", "M&A", "Expansion"],
    },
    resume: "PDG visionnaire avec expertise en leadership stratégique et gestion d'entreprise. Capacité à inspirer et guider l'organisation vers le succès. Orienté vision et performance.",
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
    data_scientist: ["data", "scientist", "science", "machine", "learning", "ml", "ia", "ai", "analytics", "analyste"],
    ingenieur: ["ingenieur", "engineer", "engineering", "technique", "technicien", "caod", "dao"],
    consultant: ["consultant", "conseil", "strategy", "strategique", "audit", "conseiller"],
    enseignant: ["enseignant", "professeur", "prof", "teacher", "education", "pedagogie", "formateur"],
    juriste: ["juriste", "juridique", "droit", "legal", "lawyer", "avocat", "notaire"],
    chef_equipe: ["chef", "equipe", "team", "lead", "leader", "superviseur", "manager"],
    analyste: ["analyste", "analyst", "analyse", "analysis", "business", "system"],
    architecte: ["architecte", "architect", "architecture", "building", "construction"],
    redacteur: ["redacteur", "writer", "content", "copywriter", "editor", "journalist"],
    community_manager: ["community", "social", "media", "smm", "socialmedia", "community"],
    medecin: ["medecin", "doctor", "medical", "physician", "sante", "health"],
    psychologue: ["psychologue", "psychologist", "psychology", "mental", "therapist"],
    devops: ["devops", "dev", "ops", "deployment", "ci", "cd", "pipeline"],
    security_engineer: ["security", "cybersecurity", "security", "hacker", "pentest"],
    blockchain_developer: ["blockchain", "crypto", "web3", "smart", "contract", "ethereum"],
    cloud_architect: ["cloud", "aws", "azure", "gcp", "infrastructure", "architecture"],
    machine_learning_engineer: ["machine", "learning", "ml", "ai", "artificial", "intelligence"],
    electricien: ["electricien", "electrician", "electrical", "electricity"],
    plombier: ["plombier", "plumber", "plumbing", "water"],
    menuisier: ["menuisier", "carpenter", "wood", "furniture"],
    peintre: ["peintre", "painter", "painting"],
    infirmier: ["infirmier", "nurse", "nursing", "soin"],
    pharmacien: ["pharmacien", "pharmacist", "pharmacy", "drug"],
    dentiste: ["dentiste", "dentist", "dental"],
    graphiste: ["graphiste", "graphic", "designer", "visual"],
    photographe: ["photographe", "photographer", "photo", "photography"],
    videaste: ["videaste", "video", "editor", "film", "cinema"],
    musicien: ["musicien", "musician", "music", "composer"],
    serveur: ["serveur", "server", "waiter", "restaurant", "service"],
    cuisinier: ["cuisinier", "chef", "cook", "kitchen", "cuisine"],
    agent_securite: ["agent", "securite", "security", "guard", "protection"],
    chauffeur: ["chauffeur", "driver", "transport", "delivery"],
    secretaire: ["secretaire", "secretary", "assistant", "admin"],
    assistant: ["assistant", "administratif", "admin", "support"],
    expert_comptable: ["expert", "comptable", "accountant", "accounting", "chartered"],
    notaire: ["notaire", "notary"],
    cto: ["cto", "chief", "technology", "officer", "tech"],
    cio: ["cio", "chief", "information", "officer", "it"],
    cfo: ["cfo", "chief", "financial", "officer"],
    ceo: ["ceo", "chief", "executive", "officer", "president"],
    coo: ["coo", "chief", "operating", "officer"],
    chro: ["chro", "chief", "human", "resources", "officer"],
    environnement: ["environnement", "environment", "green", "sustainability", "ecology"],
    logistique: ["logistique", "logistics", "supply", "chain", "transport"],
    chercheur: ["chercheur", "researcher", "research", "scientist"],
    avocat: ["avocat", "lawyer", "attorney", "legal"],
    comptable: ["comptable", "accountant", "accounting"],
    technicien: ["technicien", "technician", "tech", "maintenance"],
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
