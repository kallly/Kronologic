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

## Supports : commun vs par partie (économie d'impression)

| Support | Imprimé | Format |
|---|---|---|
| Plan | 1 fois par plan | A4 |
| Caches (6 étapes + 6 personnages) | 1 fois par plan | 60 × 85 mm, 9 par A4, traits de coupe, fenêtres à évider |
| Feuilles de notes | 1 bloc par plan (× nb de joueurs) | A4 : 6 mini-plans + tableau personnages × salles |
| Cartes de salle | **par partie** (6 cartes) | 60 × 85 mm pliée (recto contenu / verso nom + plan), 3 par A4, traits de coupe |
| Mise en place + solution | **par partie** | A4 coupée en 2 : positions à l'étape 1 (publique) / trajets (secret) |

Une partie est identifiée par son **numéro** (graine = `plan#numéro`) : même plan + même numéro ⇒ mêmes cartes.
Plusieurs parties peuvent être imprimées d'un coup (« parties n° X à Y »).

## Points encore ouverts

Voir la liste « À vérifier dans la boîte » (§12 de `REGLES_KRONOLOGIC.md`), plus :
- format des énigmes générées (J4), à partir des 3 types d'objectifs documentés (§8).
