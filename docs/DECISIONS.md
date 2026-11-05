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

## Mécaniques reproduites

- Un plan = des salles reliées par des passages.
- Chaque personnage a un trajet sur N étapes ; entre deux étapes il passe dans une salle adjacente.
- **Carte de salle** (une par salle), quadrillée :
  - info **publique** : pour chaque étape, nombre de personnages présents ;
  - info **privée** : pour chaque personnage, nombre de passages dans la salle + **une** étape exacte où il y était.
- **Caches** (gabarits à fenêtre posés sur une carte de salle) :
  - **cache personnage** (1 par personnage) : révèle son nombre de passages + l'étape exacte ;
  - **cache étape** (1 par étape) : révèle le nombre de personnages présents à cette étape.
- **Feuille de notes** : 6 mini-plans (1 par étape) + au centre la liste des personnages avec, pour chaque
  salle, une case « nombre de passages ». Au-delà de 6 étapes, feuille supplémentaire.
- **Solution** : trajet de chaque personnage + réponse à l'énigme.

## Points encore ouverts (à valider au fil de l'eau)

1. Déplacement : rester sur place autorisé ? → paramètre `allowStay` (défaut : non).
2. Départ : salle commune connue de tous ou aléatoire ? → paramètre `startRoom` (défaut : aléatoire).
3. Étape exacte révélée quand le personnage est passé plusieurs fois : tirage aléatoire (actuel), première, dernière ?
4. Énigme / scénario à résoudre (qui, où, quand, conditions) et niveaux de difficulté → J4.
5. Taille des cartes de salle et nombre par A4 (proposition : 90 × 125 mm, 4 par page).
