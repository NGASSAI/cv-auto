# PROJECT_CONTEXT.md — CV Builder

> Ce fichier permet à un nouvel assistant (Claude) de reprendre ce projet exactement là où il en est, sans perdre le contexte. Il doit être lu en entier avant toute intervention. Le propriétaire du projet (Nathan) préfère qu'on lui explique avant de générer du code, qu'on avance module par module en validant chaque étape, et — **important** — qu'à partir d'un certain stade de la conversation précédente, les modifications de fichiers existants soient données comme **indications précises (trouve X, remplace par Y)** plutôt que comme fichiers complets. Les fichiers entièrement nouveaux peuvent être donnés en entier.

---

## 1. Objectif du projet

**CV Builder** est une application SaaS permettant de créer des CV professionnels avec un rendu visuel soigné (façon Canva), en français, avec un modèle freemium où le passage en Premium est **activé manuellement par l'admin** (pas de paiement automatisé Stripe — Nathan n'a pas de carte bancaire, donc tous les services nécessitant une carte ont été évités : Cloudflare R2 et Cloudinary ont été rejetés pour cette raison).

- **Propriétaire / unique admin** : Nathan (Brazzaville, Congo). Il n'y aura jamais plusieurs admins — le système ne permet pas de promouvoir un utilisateur en admin depuis l'interface, uniquement via la variable d'environnement `EMAIL_ADMIN`.
- **Modèle économique** : abonnement mensuel/annuel, mais activé **manuellement** par l'admin après contact de l'utilisateur (WhatsApp ou formulaire in-app), pas de Stripe.
- **Langue** : tout le projet est en français — code, commentaires, noms de variables, UI. Aucune exception.

---

## 2. Stack technique (versions importantes)

| Techno | Détail |
|---|---|
| Next.js | **16** (App Router, **pas de dossier `src/`** — tout est à la racine : `app/`, `features/`, `shared/`, `prisma/`) |
| TypeScript | oui, strict |
| Prisma | **7.9.1** — ⚠️ configuration très différente des versions antérieures (voir section dédiée) |
| Base de données | **Neon (PostgreSQL serverless)** — se met en veille après inactivité, cause régulièrement des erreurs `P1001 DatabaseNotReachable` en dev. Solution : ouvrir le dashboard Neon pour réveiller la base, ou lancer `npx prisma studio` pour garder une connexion active. |
| NextAuth | **v4** (pas v5/Auth.js) |
| Zustand | store client de l'éditeur |
| shadcn/ui | avec **Base UI** (pas Radix) depuis migration récente — ⚠️ `asChild` n'existe plus, remplacé par `render={<Composant />}` sur les Trigger, et `onSelect` sur `DropdownMenuItem` ne fonctionne plus, remplacé par `onClick` + `closeOnClick` |
| Tailwind CSS | v4 (syntaxe `@theme inline`, `@custom-variant`, pas de `tailwind.config.js` classique) |
| Zod | v4 |
| Sonner | notifications toast |
| dnd-kit | `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities` (⚠️ PAS `@dnd-kit/react` qui avait été installé par erreur au départ) |
| React-PDF | `@react-pdf/renderer` pour l'export PDF (composants dédiés `Document`, `Page`, `View`, `Text`, `StyleSheet` — différents du HTML) |
| React Hook Form + @hookform/resolvers | formulaires (connexion, inscription) |
| bcrypt | hash des mots de passe |
| Resend | envoi d'emails (remplace Gmail SMTP qui a échoué — voir Problèmes rencontrés) |
| Recharts | graphiques admin (statistiques) |
| lucide-react | icônes |

### Environnement de développement
- **Windows**, chemin racine `F:/cv-auto`, CMD/PowerShell (attention : `curl` sous PowerShell nécessite `curl.exe` explicitement ou `Invoke-RestMethod`).
- Photos de profil stockées en **base64 directement dans PostgreSQL** (pas de service de stockage externe — Cloudflare R2 et Cloudinary demandent tous deux une carte bancaire, rejetés). Compression côté navigateur via `<canvas>` : 400×400px, JPEG qualité 80%.

---

## 3. Configuration Prisma 7 (piège fréquent, bien noter)

- **Pas d'URL dans `schema.prisma`** — elle va dans `prisma.config.ts` à la racine.
- Le client généré n'a **pas de fichier `index.ts`** — il faut importer depuis `@/lib/generated/prisma/client`.
- `PrismaClient` nécessite un **adapter** : `@prisma/adapter-pg` + `pg`.
- Après **chaque modification du schéma** : `npx prisma migrate dev --name nom` PUIS parfois `npx prisma generate`, PUIS redémarrer le serveur TS de l'éditeur.

`shared/lib/prisma.ts` (client singleton) :
```typescript
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const globalPourPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
export const prisma = globalPourPrisma.prisma ?? new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") { globalPourPrisma.prisma = prisma; }
```

---

## 4. Structure des dossiers (architecture feature-based)

```
cv-auto/                          (racine, PAS de dossier src/)
├── components/ui/                # shadcn/ui (généré, ne pas modifier à la main)
├── features/
│   ├── auth/
│   │   ├── components/           # formulaires connexion/inscription/reset
│   │   ├── api/                  # utilisateur.service.ts
│   │   ├── lib/                  # mot-de-passe.ts, token.ts, email.ts
│   │   ├── validators/           # auth.schema.ts
│   │   └── types.ts              # extension des types NextAuth (Session, JWT)
│   ├── cv/
│   │   ├── components/
│   │   │   ├── editor/           # tous les composants de l'éditeur
│   │   │   ├── templates/        # 4 templates live (HTML/Tailwind)
│   │   │   └── pdf/              # 4 templates PDF (@react-pdf/renderer)
│   │   ├── api/                  # cv.service.ts, section.service.ts
│   │   ├── stores/                # cv-editor.store.ts (Zustand)
│   │   ├── validators/           # cv.schema.ts, section.schema.ts
│   │   └── lib/                  # registre-polices.ts
│   ├── premium/
│   │   ├── api/                  # premium.service.ts
│   │   ├── components/           # bouton-premium.tsx
│   │   └── lib/                  # acces-premium.ts (fonction aAccesPremium)
│   ├── admin/
│   │   ├── api/                  # admin.service.ts
│   │   └── components/           # nav-admin.tsx, liste-demandes.tsx, tableau-utilisateurs.tsx, graphique-inscriptions.tsx
│   └── dashboard/
│       └── components/           # carte-cv.tsx, etat-vide.tsx, bouton-deconnexion.tsx, tableau-de-bord-cv.tsx
├── shared/
│   └── lib/
│       ├── prisma.ts
│       └── auth.ts               # authOptions NextAuth
├── app/
│   ├── (auth)/                   # connexion, inscription, mot-de-passe-oublie, reinitialiser/[token]
│   ├── (dashboard)/
│   │   ├── layout.tsx            # protégé, vérifie session
│   │   └── dashboard/page.tsx
│   ├── (admin)/
│   │   ├── layout.tsx            # protégé, vérifie role === ADMIN
│   │   └── admin/
│   │       ├── page.tsx          # vue d'ensemble stats
│   │       ├── demandes/page.tsx
│   │       ├── utilisateurs/page.tsx
│   │       └── statistiques/page.tsx
│   ├── editor/[cvId]/            # ⚠️ PAS dans un groupe de route — page.tsx + editeur-cv.tsx associé
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── auth/inscription/route.ts
│   │   ├── auth/mot-de-passe-oublie/route.ts
│   │   ├── auth/reinitialiser/route.ts
│   │   ├── cv/route.ts                              # GET liste, POST créer
│   │   ├── cv/[cvId]/route.ts                       # GET, PATCH, DELETE
│   │   ├── cv/[cvId]/informations/route.ts          # PATCH infos perso
│   │   ├── cv/[cvId]/sections/route.ts              # POST créer section
│   │   ├── cv/[cvId]/sections/reordonner/route.ts   # PATCH ordre sections
│   │   ├── cv/[cvId]/sections/[sectionId]/route.ts  # PATCH, DELETE
│   │   ├── cv/[cvId]/sections/[sectionId]/items/reordonner/route.ts
│   │   ├── cv/[cvId]/sections/[sectionId]/items/[itemId]/route.ts   # PATCH, DELETE
│   │   ├── cv/sections/[sectionId]/items/route.ts   # ⚠️ POST créer item — chemin SANS [cvId] (simplifié volontairement)
│   │   ├── cv/[cvId]/export/route.tsx               # ⚠️ extension .tsx (contient du JSX) — génère et télécharge le PDF
│   │   ├── premium/route.ts                         # POST créer demande premium
│   │   └── admin/
│   │       ├── demandes/route.ts                     # GET
│   │       ├── demandes/[demandeId]/route.ts          # PATCH approuver/refuser
│   │       ├── utilisateurs/route.ts                  # GET
│   │       ├── utilisateurs/[utilisateurId]/route.ts  # PATCH toggle premium, DELETE
│   │       └── statistiques/route.ts                  # GET stats détaillées
│   ├── layout.tsx                # RootLayout : fonts (Geist, Fraunces, Merriweather, Playfair, Manrope, Lora) + Toaster
│   └── globals.css               # design tokens (palette "dossier professionnel")
├── middleware.ts                 # protège /dashboard, /admin, /editor — vérifie session + rôle admin
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── prisma.config.ts
```

**⚠️ Groupe `(marketing)` prévu mais jamais créé** — la page d'accueil publique (`app/page.tsx`) est **vide**, volontairement reportée à la toute fin du projet.

---

## 5. Identité visuelle (déjà validée, ne pas re-proposer)

Concept : **"Le dossier professionnel"** — un CV est un document officiel qui ouvre des portes.

**Palette** (variables CSS dans `globals.css`, via `@theme inline`) :
- Papier `#FAF8F3` (fond), Encre `#161B22` (texte), Ardoise `#3D4B5C` (texte secondaire)
- Safran `#E8992D` (accent principal/primary), Sceau `#2D5A4A` (accent secondaire/secondary)
- Alerte `#C1443A` (erreurs/destructive)

**Typographie** : `Geist Sans` (corps/UI, `--font-geist-sans`), `Fraunces` (display/titres, `--font-fraunces`), + 4 polices Premium ajoutées : `Merriweather`, `Playfair Display`, `Manrope`, `Lora`.

**Signature visuelle** : coin de page "corné" en `clip-path` CSS sur le panneau de branding des pages d'authentification (`features/auth/components/panneau-branding.tsx`).

**Palette de couleurs d'accent CV** (choix utilisateur, 14 couleurs) dans `features/cv/components/editor/selecteur-couleur.tsx`.

---

## 6. Modèle de données (schema.prisma) — état actuel complet

- **Utilisateur** (id, nom, email, motDePasse, role: `UTILISATEUR`|`ADMIN`, image, timestamps) — relations : comptes OAuth, sessions, cvs, abonnement, demandes premium
- **CompteOAuth**, **Session** — tables standard NextAuth (via `@next-auth/prisma-adapter`)
- **Abonnement** (utilisateurId unique, plan: `GRATUIT`|`MENSUEL`|`ANNUEL`, statut: `ACTIF`|`EN_ATTENTE`|`ANNULE`|`EXPIRE`, dateDebut, dateFin) — champs Stripe présents mais **non utilisés**
- **CV** (id, utilisateurId, titre, templateId, couleurAccent, **police** (String @default("inter") — valeurs réelles : "fraunces"|"geist"|"merriweather"|"playfair"|"manrope"|"lora"), **alignementTexte** (String @default("gauche") — "gauche"|"centre"|"droite"|"justifie"), **tailleTexte** (String @default("moyenne") — "petite"|"moyenne"|"grande"), estPublic, slugPublic — relations : informations, sections
- **InformationsPersonnelles** (cvId unique, prenom, nom, titrePoste, email, telephone, adresse, **photoUrl** (String? — data URI base64, pas une URL), resume)
- **Section** (cvId, type: enum `TypeSection` [EXPERIENCE, FORMATION, COMPETENCES, LANGUES, CENTRES_INTERET, CERTIFICATIONS, PROJETS, PERSONNALISEE], titre, ordre, estVisible) — relation items
- **ItemSection** (sectionId, ordre, titre, sousTitre, lieu, dateDebut, dateFin, description, donneesJson Json?)
- **DemandePremium** (utilisateurId, statut: `EN_ATTENTE`|`APPROUVEE`|`REFUSEE`, message, noteAdmin, creeLe, traiteLe)
- **Template** (cle unique, nom, estPremium, estActif, ordre, apercuUrl) — ⚠️ **table créée mais PAS ENCORE connectée au code** : le registre de templates (`registre-templates.ts`) est actuellement codé en dur, pas synchronisé avec cette table. Tâche restante.
- **TokenReinitialisation** (email, token unique, expireLe)

**Dernière migration effectuée** : `ajout_alignement_taille_texte`.

---

## 7. Fonctionnalités déjà terminées et fonctionnelles

1. **Authentification complète** : inscription, connexion (Credentials NextAuth), mot de passe oublié + reset par email (Resend), rôle admin auto-assigné via `EMAIL_ADMIN` (synchronisé à chaque connexion)
2. **Dashboard utilisateur** : liste des CV (Server Component), création, suppression avec confirmation
3. **Dashboard admin** : vue d'ensemble stats, gestion demandes premium (approuver/refuser), gestion utilisateurs (liste, toggle Premium manuel, suppression — protections anti-auto-suppression et anti-suppression d'admin), statistiques détaillées (Recharts)
4. **Système Premium** : demande via WhatsApp ou formulaire in-app, activation manuelle admin, `aAccesPremium()` (ADMIN = Premium automatique), **vérification de sécurité serveur ajoutée en toute fin de session** empêchant un non-Premium de forcer templates/police/alignement/taille/photo premium via appel API direct
5. **Éditeur de CV** (`/editor/[cvId]`) : split-screen desktop / onglets mobile, formulaire infos + upload photo (Premium, base64), sections drag & drop (dnd-kit) avec CRUD items, auto-save debounce 800ms, store Zustand centralisé
6. **4 templates** (tous gratuits actuellement) : Classique, Minimaliste, Moderne (2 colonnes), Élégant (bandeau + photo). Badges colorés pour Compétences/Langues/Centres d'intérêt, icônes de contact
7. **Personnalisation Premium** : couleur (14 choix), police (6 choix), alignement texte, taille texte, photo de profil
8. **Export PDF** : 4 templates PDF fidèles aux versions live

---

## 8. Décisions techniques importantes et pièges déjà rencontrés

- **Stockage photo** : PAS de service externe (R2/Cloudinary rejetés, carte bancaire requise). Base64 en DB, compression navigateur 400×400px JPEG 80%.
- **Email transactionnel** : Gmail SMTP a **définitivement échoué** (535 Bad Credentials persistant, cause non résolue). **Remplacé par Resend**, fonctionnel. Ne pas y revenir.
- **shadcn/ui + Base UI** : `asChild` → `render={<X />}`. `onSelect` → `onClick` + `closeOnClick` sur `DropdownMenuItem` (a cassé "ajouter section" et "supprimer CV" avant correction).
- **Route items de section** simplifiée : `/api/cv/sections/[sectionId]/items` (sans `[cvId]`, redondant car vérification via relation).
- **Layout éditeur** : `min-h-screen` → `h-screen` + `overflow-hidden` + `min-h-0` sur enfants flex (corrige débordement de page).
- **Neon serverless** : veille fréquente → `P1001`. Toujours vérifier en premier devant une erreur Prisma inattendue.
- **Sécurité Premium côté serveur** : ajoutée en toute fin de session dans `cv.service.ts` via `verifierAccesPremiumSiNecessaire()` — **à re-vérifier/tester en priorité à la reprise**, c'était la dernière action avant coupure.
- **Confidentialité des CV** : chaque service vérifie `cv.utilisateurId !== utilisateurId` (ou via relation) avant toute opération — pattern à respecter pour tout nouveau code.
- **Format des réponses demandé par Nathan** : modifications de fichiers existants = indications précises ("trouve X, remplace par Y"), PAS de fichier complet (sauf demande explicite). Fichiers nouveaux = contenu complet directement.

---

## 9. Tâches restantes / backlog priorisé

**Ordre confirmé par Nathan en fin de session précédente : on commence par le point 1.**

1. ⬜ **3 nouveaux templates premium**, plus riches visuellement que les 4 actuels (désormais tous gratuits). Processus à suivre impérativement : proposer une direction de design (concept, palette, mise en page) pour chacun et attendre validation AVANT de coder — c'est comme ça que les 4 premiers templates ont été construits avec succès. Chaque template doit avoir sa version live (`features/cv/components/templates/`) ET sa version PDF (`features/cv/components/pdf/`), plus être ajouté aux deux registres (`registre-templates.ts` et `registre-pdf.ts`) avec `estPremium: true`.
2. ⬜ **Blocage temporaire d'un utilisateur** par l'admin (statut de compte suspendu, empêcher connexion/usage).
3. ⬜ **Notifications avec son**, côté utilisateur ET admin (ex : admin notifié à une nouvelle demande premium, utilisateur notifié quand son compte est activé). Aucune décision technique prise sur l'implémentation — à clarifier avec Nathan (poll ? websocket ? son sur toast Sonner existant ?).
4. ⬜ **Connecter le modèle Prisma `Template` au registre codé en dur**, pour que l'admin gère templates (actif/inactif/premium) sans redéploiement.
5. ⬜ **Mode maintenance complet du site**, activable par l'admin.
6. ⬜ **Page d'accueil publique professionnelle** — prévue pour la fin. Doit présenter clairement gratuit vs Premium.
7. ⬜ **PWA / installation mobile** — prévue pour la fin également.

**Point non confirmé résolu** : correction apportée au champ Description des items (retour à la ligne, ajout `onKeyDown={(e) => e.stopPropagation()}`) — jamais explicitement confirmée fonctionnelle par Nathan, à vérifier si l'occasion se présente.

---

## 10. Variables d'environnement nécessaires (sans les valeurs secrètes)

```
DATABASE_URL=                  # Connection string Neon PostgreSQL
NEXTAUTH_SECRET=                # généré via `npx auth secret`
NEXTAUTH_URL=http://localhost:3000
EMAIL_ADMIN=                    # email du compte qui doit devenir automatiquement ADMIN
RESEND_API_KEY=                 # clé API Resend (re_xxxxx)
NEXT_PUBLIC_URL_APP=http://localhost:3000
```

Variables **obsolètes / à ignorer** si présentes (résidus d'essais abandonnés) :
```
SMTP_EMAIL=, SMTP_MOT_DE_PASSE=     # ancien essai Gmail, abandonné
R2_*                                 # ancien essai Cloudflare R2, abandonné
CLOUDINARY_*                         # ancien essai Cloudinary, abandonné
```

---

## 11. Comment continuer efficacement avec Nathan

- Toujours **expliquer le plan avant de coder**, surtout pour un nouveau sous-module.
- Avancer **module par module**, attendre confirmation avant d'enchaîner.
- **Modifications de fichiers existants** : emplacement précis + texte exact à trouver/remplacer, PAS le fichier complet (sauf demande explicite).
- **Fichiers nouveaux** : contenu complet directement.
- Nathan colle souvent des erreurs de compilation/lint brutes — les lire attentivement, cause précise souvent identifiable (import manquant, migration Prisma non lancée, incohérence de type après ajout de champ).
- Cause la plus fréquente d'erreur Prisma en cours de route : Neon en veille (`P1001`) — vérifier en premier.
- Rester pédagogue : expliquer le contexte technique des erreurs, pas juste donner la correction brute.