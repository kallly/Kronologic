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

## Points encore ouverts

Voir la liste « À vérifier dans la boîte » (§12 de `REGLES_KRONOLOGIC.md`), plus :
- taille des cartes de salle et nombre par A4 (proposition : 90 × 125 mm, 4 par page) ;
- format des énigmes générées (J4), à partir des 3 types d'objectifs documentés (§8).
