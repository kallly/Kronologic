# Plan d'action

## Architecture : deux parties

```
src/
  core/                  # PARTIE 1 – génération des histoires (logique pure, sans DOM, testée)
    rng.ts               #   PRNG à graine → une graine = une partie reproductible        ✅
    types.ts             #   GameMap, Character, Story, RoomStory                         ✅
    map.ts               #   validation du plan (salles, passages, connexité)             ✅
    story.ts             #   trajets des personnages                                      ✅
    roomStory.ts         #   histoire de chaque salle = contenu des cartes de salle       ✅
    modes/               #   Tête-à-tête, Fantôme, Bijou (construction + garde-fous)       ✅
    solver.ts            #   unicité / déductibilité à partir des cartes                    ✅
    quests.ts            #   quêtes mode × niveau, graines, vérification solveur            ✅
  maps/                  # plans (un fichier par plan)                                    ✅ 1 plan démo
  render/                # PARTIE 2 – génération des supports (A4)
    print.css            #   @page A4, feuilles, mode impression                          ✅
    mapSvg.ts            #   rendu SVG d'un plan (réutilisé par la feuille de notes)      ✅
    layout.ts            #   gabarit unique carte/caches (mm)                              ✅
    cutMarks.ts          #   placement en grille + traits de coupe                         ✅
    documents.ts         #   plan, caches, feuilles de notes, cartes de salle, fiche partie ✅
  main.ts                # interface : plan, graine, étapes, documents à imprimer
```

Principe : la partie 1 produit un objet `Story` + des `RoomStory[]` ; chaque support de la partie 2
n'est qu'une vue imprimable de ces données.

## Jalons

- **J1 – Socle** ✅ Vite + TS + Vitest, CI + déploiement GitHub Pages, page A4 imprimable.
- **J2 – Plan** ✅ (v1) format de plan, validation, rendu SVG du plan seul.
  Reste : passer le plan en JSON importable, ajouter une règle de calibration en mm.
- **J3 – Histoires** ✅ (v1) trajets + histoires des salles, reproductibles par graine.
- **J4 – Énigmes & solveur** ✅ 3 modes × 5 niveaux, un jeu de cartes par quête, solveur de déductibilité.
  Reste : valider la règle du Bijou, affiner la difficulté (nombre de questions nécessaires).
- **J5 – Supports** ✅ (v1, à valider sur papier — imprimer, découper, mesurer) :
  1. cartes de salle avec quadrillage à positions fixes + traits de coupe ;
  2. caches personnage et étape, fenêtres alignées sur le quadrillage + traits de coupe ;
  3. feuilles de notes (6 étapes/feuille, pagination automatique) ;
  4. feuille solution.
- **J6 – Interface** ✅ (v1) choix des documents, nb de joueurs, plage de parties, paramètres dans l'URL.
  Reste : export/import JSON d'une partie, positions de départ imposées par une histoire écrite à la main.
- **J7 – Plusieurs plans** : nouveaux plans, éventuellement éditeur visuel, export PDF si besoin.

## Contrainte clé pour J5
Cartes et caches partagent **un seul gabarit de coordonnées** (`render/layout.ts`, testé dans `tests/layout.test.ts`) : position de chaque
case du quadrillage en mm. Les fenêtres des caches sont calculées depuis ce gabarit, ce qui garantit
l'alignement quel que soit le nombre d'étapes ou de personnages.
