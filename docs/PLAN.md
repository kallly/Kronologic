# Plan d'action

Plan proposé en jalons livrables. Les choix marqués *(Qx.y)* dépendent de `QUESTIONS.md`.

## Architecture cible

```
src/
  core/            # logique pure, sans DOM, 100 % testée
    rng.ts         # PRNG à graine (mulberry32) → reproductibilité
    map.ts         # types + validation d'un plan (graphe de lieux)
    scenario.ts    # génération des trajets des personnages
    clues.ts       # calcul des infos par (lieu × étape)
    solver.ts      # vérifie que la solution est unique / déductible
  maps/            # plans en JSON (map-01.json, puis d'autres)
  render/          # composants qui produisent du SVG/HTML
    MapSheet       # plan seul
    StepCards      # cartes d'étapes (grille N par A4)
    Solution       # feuille solution
    NoteSheets     # feuilles de notes paginées (6 étapes / feuille)
    Masks          # caches à découper
  print/           # CSS @page A4, traits de coupe, pagination
  ui/              # écran de config (carte, seed, nb persos, nb étapes, documents à imprimer)
```

Principe clé : **modèle de données → documents**. Le cœur produit un objet `Game`
(`map`, `seed`, `characters`, `steps`, `paths`, `clues`, `solution`) ; chaque document
n'est qu'une vue imprimable de cet objet.

## Jalons

### J0 — Cadrage (en cours)
- Réponses à `QUESTIONS.md`, en particulier §0 (identité originale), §1 (règles), §4 (formats d'impression).
- Croquis papier des 5 documents avec dimensions en mm.

### J1 — Socle technique
- Vite + TypeScript + Vitest + ESLint/Prettier *(Q7.1)*.
- CI GitHub Actions : lint + tests + build ; déploiement GitHub Pages *(Q7.2)*.
- Page A4 de test : `@page { size: A4; margin: 10mm }`, une règle graduée en mm pour calibrer l'imprimante.

### J2 — Modèle de plan + rendu du plan seul
- Format JSON d'un plan + validation (lieux, positions, adjacences symétriques, graphe connexe) *(Q2.1)*.
- Première carte originale *(Q0.2, Q2.3)*.
- Rendu SVG du plan sur une A4 → **premier document imprimable**.

### J3 — Moteur de génération
- PRNG à graine, génération des trajets respectant les règles de déplacement *(Q1.3, Q1.4)*.
- Placement de l'objectif / événement *(Q1.6, Q1.7)*.
- Calcul des informations publiques/privées par (lieu × étape) *(Q1.5)*.
- Tests : mêmes paramètres + même seed ⇒ même partie ; chaque trajet est valide sur le graphe.

### J4 — Solveur / garantie de jouabilité
- Solveur par contraintes (backtracking sur les trajets possibles, suffisant pour ~6 persos × 6 étapes).
- On regénère tant que la solution n'est pas unique *(Q1.8)* ; mesure d'une difficulté (nb de cartes nécessaires).

### J5 — Documents imprimables
1. Cartes d'étapes : grille N par A4, traits de coupe, recto/verso *(Q4.2, Q4.3)*.
2. Solution : tableau personnages × étapes + réponse.
3. Feuilles de notes : 6 étapes/feuille, pagination auto, Y exemplaires *(Q5.x)*.
4. Caches : gabarits à fenêtre calés sur la taille des cartes *(Q6.x)*.
- Seed + nom du plan en pied de page de chaque document.
- Tests Playwright : export PDF headless, vérification du nombre de pages et des dimensions.

### J6 — Interface
- Formulaire : plan, seed (aléatoire ou saisie), nb de personnages, nb d'étapes, nb de joueurs.
- Aperçu à l'écran, cases à cocher des documents à imprimer, bouton « Imprimer ».
- Paramètres dans l'URL *(Q3.2)*, export/import JSON *(Q3.3)*.

### J7 — Plusieurs plans
- Sélecteur de plans, ajout de plans par simple fichier JSON.
- (Optionnel) éditeur visuel de plan *(Q2.4)*, export PDF client *(Q4.1)*.

## Organisation suggérée
- Une issue GitHub par jalon, une branche + PR par sous-livrable.
- Définition de « terminé » : tests verts + un document réellement imprimé et mesuré à la règle.
