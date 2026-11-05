# Décisions de cadrage

| Sujet | Décision |
|---|---|
| Usage | Personnel, dépôt privé. |
| Contenu | Mécaniques du jeu de déduction temporelle reproduites ; **plans, personnages et visuels originaux** (le générateur accepte n'importe quel plan décrit en données). |
| Stack | TypeScript + Vite, tests Vitest, hébergement GitHub Pages. |
| Impression | Navigateur (CSS `@page` A4). Bascule en PDF client seulement si bloquant. |
| Traits de coupe | Sur les **caches** et sur les **cartes de salle** (qui se glissent derrière les caches). |
| Étapes | 6 par défaut, paramétrable. |
| Architecture | 2 parties : **génération des histoires** (moteur) et **génération des supports** (rendu A4). |

## Règles

La référence est [`REGLES_KRONOLOGIC.md`](REGLES_KRONOLOGIC.md) (règles vérifiées et sourcées).
Décisions appliquées dans le moteur :

- Déplacement obligatoire vers une salle adjacente, **jamais deux étapes de suite dans la même salle**.
- **Positions de départ fixées par l'histoire / le n° de partie** (`startPositions`) ; sinon tirées depuis la graine.
- Carte de salle : par étape, nb de présents + un personnage présent ; par personnage, nb de passages + une étape.
- Case privée sans réponse (personne / 0 passage) : **flèche « rejouer »**.
- 6 personnages × 6 étapes × 6 salles, identiques pour toutes les parties d'un plan.

## Plans

- Le plateau officiel (plan de l'Opéra) **n'est pas reproduit** dans le dépôt. Deux plans originaux sont fournis :
  **Manoir de Brume** (par défaut, **asymétrique** : salles de tailles différentes, 3 murs sans porte),
  *Musée de la Lanterne* et *Villa des Glycines*.
- Les déplacements suivent uniquement les **portes** ; une porte n'est valide qu'entre deux salles qui partagent
  un mur (pas de saut de salle) — vérifié par `validateMap`.
- Tout autre plan peut être **importé en JSON** depuis l'interface (bouton « Télécharger ce plan » = modèle).

## Quêtes : 3 modes × 5 enquêtes, un jeu de 6 cartes par quête

Comme le jeu original (3 scénarios × 5 enquêtes, 6 cartes Lieu par enquête), **chaque quête a son propre jeu de
cartes**. Plan, caches et feuilles de notes restent communs. Rôles fixes : le Détective est D.

| Mode (`src/core/modes/`) | Énoncé | Réponse | Garde-fou « aucune carte ne donne seule la réponse » |
|---|---|---|---|
| **Tête-à-tête mortel** | Le Détective est empoisonné au seul moment où il est seul avec quelqu'un, **entre l'étape 3 et l'étape 6** ; il continue de bouger | qui, où, quand | la case du meurtre (2 présents) ne révèle jamais le Détective, mais le coupable |
| **Le Fantôme** | Un personnage est seul à chacune des étapes, le seul dans ce cas | qui | à chaque étape, au moins un autre personnage est seul aussi |
| **Le Bijou** ⚠️ | Porteur initial annoncé ; le bijou passe quand son porteur est seul avec exactement un autre | qui le détient à l'étape 6, et où | le porteur final n'est jamais seul à l'étape 6 et sa case ne le révèle pas |

⚠️ La règle de transmission du Bijou vient d'une seule source (`REGLES_KRONOLOGIC.md` §8) : hypothèse à valider.

- **Niveaux** (`src/core/quests.ts`) : la difficulté vient des positions de départ données —
  niveau 1 : 6, niveau 2 : 4, niveau 3 : 3, niveau 4 : 1, niveau 5 : aucune.
- **Solveur** (`src/core/solver.ts`) : énumère toutes les histoires compatibles avec les 6 cartes + infos publiques ;
  une quête n'est retenue que si **une seule réponse** est possible. Constat : avec toutes les cartes, l'histoire
  est toujours entièrement déterminée ; la difficulté réelle est le nombre de questions à poser.
- **Graine** : `plan#mode#niveau` (+ `/n` pour les tirages suivants) → même plan + même enquête ⇒ mêmes cartes.
- **Solution** : quadrillage salles × étapes ; réponse en rouge, parcours du bijou en jaune.

## Logos de salles

Chaque salle reçoit un logo géométrique (cercle, carré, triangle, losange, étoile, hexagone…, selon son rang
dans le plan), affiché à côté de son nom sur tous les plans et au-dessus des cases de comptage.

## Thèmes

- **Stylisé** : cartes crème, cadres et filets dorés, titres à empattements, caches sombres à motif.
- **Minimaliste** : aucun aplat, cases partagées en pointillés, caches hachurés (papier ≥ 160 g conseillé).
- Le thème ne change que l'habillage : cartes et caches de thèmes différents restent compatibles.

## Supports : commun vs par partie (économie d'impression)

| Support | Imprimé | Format |
|---|---|---|
| Plan | 1 fois par plan | A4 |
| Caches (6 étapes + 6 personnages) | 1 fois par plan | 60 × 85 mm, 9 par A4, traits de coupe, fenêtres à évider |
| Feuilles de notes | 1 bloc par plan (× nb de joueurs) | A4 **paysage** : 6 grands plans vierges (1 par étape, positions notées au crayon) + en bas une ligne de comptage (par personnage, une case par salle repérée par son logo) |
| Cartes de salle | **par quête** (6 cartes) | 60 × 85 mm pliée (recto contenu / verso nom + plan), 3 par A4, traits de coupe |
| Mise en place + solution | **par quête** | A4 coupée en 2 : énoncé + positions connues (public) / solution (secret) |

L'interface propose une grille modes × enquêtes 1–5 (« tout cocher » = 15 quêtes, 49 pages A4).

## Points encore ouverts

Voir la liste « À vérifier dans la boîte » (§12 de `REGLES_KRONOLOGIC.md`), plus :
- règle de transmission du Bijou (à confirmer avec la boîte).
