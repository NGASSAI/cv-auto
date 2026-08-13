export const INFORMATIONS_EXEMPLE = {
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

export const SECTIONS_EXEMPLE = [
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
