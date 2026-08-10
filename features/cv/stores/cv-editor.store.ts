import { create } from "zustand";

export interface ItemSectionEditeur {
  id: string;
  ordre: number;
  titre: string | null;
  sousTitre: string | null;
  lieu: string | null;
  dateDebut: string | null;
  dateFin: string | null;
  description: string | null;
  donneesJson: unknown;
}

export interface SectionEditeur {
  id: string;
  type: string;
  titre: string;
  ordre: number;
  estVisible: boolean;
  items: ItemSectionEditeur[];
}

export interface InformationsEditeur {
  prenom: string | null;
  nom: string | null;
  titrePoste: string | null;
  email: string | null;
  telephone: string | null;
  adresse: string | null;
  photoUrl: string | null;
  resume: string | null;
}

export interface CVEditeur {
  id: string;
  titre: string;
  templateId: string;
  couleurAccent: string;
  police: string;
  informations: InformationsEditeur;
  sections: SectionEditeur[];
}

type StatutSauvegarde = "inactif" | "en_attente" | "sauvegarde" | "erreur";

interface EtatEditeurCV {
  cv: CVEditeur | null;
  statutSauvegarde: StatutSauvegarde;

  initialiser: (cv: CVEditeur) => void;

  mettreAJourInformations: (
    champ: keyof InformationsEditeur,
    valeur: string
  ) => void;

  mettreAJourTitreCV: (titre: string) => void;
  changerTemplate: (templateId: string) => void;
  changerCouleur: (couleurAccent: string) => void;
  changerPolice: (police: string) => void;

  ajouterSection: (section: SectionEditeur) => void;
  mettreAJourTitreSection: (sectionId: string, titre: string) => void;
  togglerVisibiliteSection: (sectionId: string) => void;
  supprimerSection: (sectionId: string) => void;
  reordonnerSections: (nouvelOrdreIds: string[]) => void;

  ajouterItem: (sectionId: string, item: ItemSectionEditeur) => void;
  mettreAJourItem: (
    sectionId: string,
    itemId: string,
    donnees: Partial<ItemSectionEditeur>
  ) => void;
  supprimerItem: (sectionId: string, itemId: string) => void;
  reordonnerItems: (sectionId: string, nouvelOrdreIds: string[]) => void;
}

// Timers de debounce, un par type d'opération pour ne pas se marcher dessus
const minuteries: Record<string, ReturnType<typeof setTimeout>> = {};

function debouncer(cle: string, fonction: () => void, delai = 800) {
  clearTimeout(minuteries[cle]);
  minuteries[cle] = setTimeout(fonction, delai);
}

async function sauvegarderSurServeur(
  url: string,
  corps: unknown,
  surSucces: () => void,
  surEchec: () => void
) {
  try {
    const reponse = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corps),
    });

    if (!reponse.ok) {
      surEchec();
      return;
    }

    surSucces();
  } catch {
    surEchec();
  }
}

export const useEditeurCVStore = create<EtatEditeurCV>((set, get) => ({
  cv: null,
  statutSauvegarde: "inactif",

  initialiser: (cv) => set({ cv, statutSauvegarde: "inactif" }),

  mettreAJourInformations: (champ, valeur) => {
    const { cv } = get();
    if (!cv) return;

    set({
      cv: { ...cv, informations: { ...cv.informations, [champ]: valeur } },
      statutSauvegarde: "en_attente",
    });

    debouncer(`informations-${champ}`, () => {
      set({ statutSauvegarde: "sauvegarde" });
      sauvegarderSurServeur(
        `/api/cv/${cv.id}/informations`,
        { [champ]: valeur },
        () => set({ statutSauvegarde: "inactif" }),
        () => set({ statutSauvegarde: "erreur" })
      );
    });
  },

  mettreAJourTitreCV: (titre) => {
    const { cv } = get();
    if (!cv) return;

    set({ cv: { ...cv, titre }, statutSauvegarde: "en_attente" });

    debouncer("titre-cv", () => {
      set({ statutSauvegarde: "sauvegarde" });
      sauvegarderSurServeur(
        `/api/cv/${cv.id}`,
        { titre },
        () => set({ statutSauvegarde: "inactif" }),
        () => set({ statutSauvegarde: "erreur" })
      );
    });
  },

  changerTemplate: (templateId) => {
    const { cv } = get();
    if (!cv) return;

    set({ cv: { ...cv, templateId }, statutSauvegarde: "sauvegarde" });

    sauvegarderSurServeur(
      `/api/cv/${cv.id}`,
      { templateId },
      () => set({ statutSauvegarde: "inactif" }),
      () => set({ statutSauvegarde: "erreur" })
    );
  },

  changerCouleur: (couleurAccent) => {
    const { cv } = get();
    if (!cv) return;

    set({ cv: { ...cv, couleurAccent }, statutSauvegarde: "en_attente" });

    debouncer("couleur-cv", () => {
      set({ statutSauvegarde: "sauvegarde" });
      sauvegarderSurServeur(
        `/api/cv/${cv.id}`,
        { couleurAccent },
        () => set({ statutSauvegarde: "inactif" }),
        () => set({ statutSauvegarde: "erreur" })
      );
    });
  },
  changerPolice: (police) => {
    const { cv } = get();
    if (!cv) return;

    set({ cv: { ...cv, police }, statutSauvegarde: "sauvegarde" });

    sauvegarderSurServeur(
      `/api/cv/${cv.id}`,
      { police },
      () => set({ statutSauvegarde: "inactif" }),
      () => set({ statutSauvegarde: "erreur" })
    );
  },

  ajouterSection: (section) => {
    const { cv } = get();
    if (!cv) return;
    set({ cv: { ...cv, sections: [...cv.sections, section] } });
  },

  mettreAJourTitreSection: (sectionId, titre) => {
    const { cv } = get();
    if (!cv) return;

    set({
      cv: {
        ...cv,
        sections: cv.sections.map((s) =>
          s.id === sectionId ? { ...s, titre } : s
        ),
      },
      statutSauvegarde: "en_attente",
    });

    debouncer(`section-titre-${sectionId}`, () => {
      set({ statutSauvegarde: "sauvegarde" });
      sauvegarderSurServeur(
        `/api/cv/${cv.id}/sections/${sectionId}`,
        { titre },
        () => set({ statutSauvegarde: "inactif" }),
        () => set({ statutSauvegarde: "erreur" })
      );
    });
  },

  togglerVisibiliteSection: (sectionId) => {
    const { cv } = get();
    if (!cv) return;

    const section = cv.sections.find((s) => s.id === sectionId);
    if (!section) return;

    const nouvelleVisibilite = !section.estVisible;

    set({
      cv: {
        ...cv,
        sections: cv.sections.map((s) =>
          s.id === sectionId ? { ...s, estVisible: nouvelleVisibilite } : s
        ),
      },
      statutSauvegarde: "sauvegarde",
    });

    sauvegarderSurServeur(
      `/api/cv/${cv.id}/sections/${sectionId}`,
      { estVisible: nouvelleVisibilite },
      () => set({ statutSauvegarde: "inactif" }),
      () => set({ statutSauvegarde: "erreur" })
    );
  },

  supprimerSection: (sectionId) => {
    const { cv } = get();
    if (!cv) return;

    set({
      cv: { ...cv, sections: cv.sections.filter((s) => s.id !== sectionId) },
    });

    fetch(`/api/cv/${cv.id}/sections/${sectionId}`, { method: "DELETE" });
  },

  reordonnerSections: (nouvelOrdreIds) => {
    const { cv } = get();
    if (!cv) return;

    const sectionsReordonnees = nouvelOrdreIds
      .map((id) => cv.sections.find((s) => s.id === id))
      .filter((s): s is SectionEditeur => !!s)
      .map((s, index) => ({ ...s, ordre: index }));

    set({ cv: { ...cv, sections: sectionsReordonnees } });

    fetch(`/api/cv/${cv.id}/sections/reordonner`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ordreIds: nouvelOrdreIds }),
    });
  },

  ajouterItem: (sectionId, item) => {
    const { cv } = get();
    if (!cv) return;

    set({
      cv: {
        ...cv,
        sections: cv.sections.map((s) =>
          s.id === sectionId ? { ...s, items: [...s.items, item] } : s
        ),
      },
    });
  },

  mettreAJourItem: (sectionId, itemId, donnees) => {
    const { cv } = get();
    if (!cv) return;

    set({
      cv: {
        ...cv,
        sections: cv.sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                items: s.items.map((i) =>
                  i.id === itemId ? { ...i, ...donnees } : i
                ),
              }
            : s
        ),
      },
      statutSauvegarde: "en_attente",
    });

    debouncer(`item-${itemId}`, () => {
      set({ statutSauvegarde: "sauvegarde" });
      sauvegarderSurServeur(
        `/api/cv/${cv.id}/sections/${sectionId}/items/${itemId}`,
        donnees,
        () => set({ statutSauvegarde: "inactif" }),
        () => set({ statutSauvegarde: "erreur" })
      );
    });
  },

  supprimerItem: (sectionId, itemId) => {
    const { cv } = get();
    if (!cv) return;

    set({
      cv: {
        ...cv,
        sections: cv.sections.map((s) =>
          s.id === sectionId
            ? { ...s, items: s.items.filter((i) => i.id !== itemId) }
            : s
        ),
      },
    });

    fetch(`/api/cv/${cv.id}/sections/${sectionId}/items/${itemId}`, {
      method: "DELETE",
    });
  },

  reordonnerItems: (sectionId, nouvelOrdreIds) => {
    const { cv } = get();
    if (!cv) return;

    const section = cv.sections.find((s) => s.id === sectionId);
    if (!section) return;

    const itemsReordonnes = nouvelOrdreIds
      .map((id) => section.items.find((i) => i.id === id))
      .filter((i): i is ItemSectionEditeur => !!i)
      .map((i, index) => ({ ...i, ordre: index }));

    set({
      cv: {
        ...cv,
        sections: cv.sections.map((s) =>
          s.id === sectionId ? { ...s, items: itemsReordonnes } : s
        ),
      },
    });

    fetch(`/api/cv/${cv.id}/sections/${sectionId}/items/reordonner`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sectionId, ordreIds: nouvelOrdreIds }),
    });
  },
}));