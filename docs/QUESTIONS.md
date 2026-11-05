# Questions de cadrage

Chaque question propose une **recommandation (R)** pour pouvoir avancer par défaut.
Répondre simplement « R » pour accepter, ou préciser.

## 0. Identité & propriété intellectuelle

0.1. Nom de **notre** jeu / de l'outil ? (le nom, les visuels et les plans d'un jeu commercial existant
ne doivent pas être repris). **R :** un nom de travail neutre, ex. « Chronoscope ».
0.2. Thème des lieux et des personnages ? (manoir, station spatiale, musée, village…)
**R :** un thème original choisi par toi ; les personnages sont des rôles génériques + couleur/symbole.
0.3. Le dépôt sera-t-il public ? Licence ? **R :** MIT pour le code, CC BY-SA pour le contenu créé.

## 1. Règles du jeu à modéliser

1.1. Nombre de personnages par partie ? Fixe ou paramétrable ? **R :** paramétrable, 6 par défaut.
1.2. Nombre d'étapes (pas de temps) ? **R :** paramétrable, 6 par défaut (= 1 feuille de notes).
1.3. Règle de déplacement : à chaque étape un personnage **doit-il** bouger vers un lieu adjacent,
ou peut-il rester sur place ? **R :** paramétrable par carte (`allowStay`).
1.4. Position de départ : connue de tous, imposée, aléatoire ? **R :** connue de tous (imprimée).
1.5. Quelles informations portent les cartes d'étape ?
   - publique : nombre de personnes dans le lieu à l'étape T ;
   - privée : identité d'**un** personnage présent (laquelle ? choisie comment ?) ;
   - autre ?
1.6. Quel est l'objectif à trouver (ex. coupable + lieu + étape d'un événement) ? Un ou plusieurs
scénarios / niveaux de difficulté ? **R :** un objectif « personnage + lieu + étape », 3 niveaux.
1.7. Contraintes du scénario (ex. événement qui requiert que le personnage X soit seul / avec Y) ?
1.8. Unicité : la solution doit-elle être **déductible de façon unique** à partir de toutes les cartes ?
**R :** oui, vérifiée par un solveur avant d'accepter une génération.

## 2. Plans (cartes du plateau)

2.1. Format de description d'un plan : JSON (lieux, coordonnées, adjacences) ? **R :** JSON + schéma validé.
2.2. Rendu : SVG généré depuis le JSON, ou image de fond + zones ? **R :** SVG généré (net à l'impression).
2.3. Combien de lieux sur la première carte ? Topologie (graphe libre, grille) ?
2.4. Veux-tu un **éditeur de plan** dans l'app, ou on édite le JSON à la main au début ?
**R :** JSON à la main en v1, éditeur visuel plus tard.

## 3. Génération & reproductibilité

3.1. Graine (seed) affichée sur chaque document pour régénérer la même partie ? **R :** oui.
3.2. Partage d'une partie par URL (`?map=…&seed=…`) ? **R :** oui, gratuit à mettre en place.
3.3. Faut-il sauvegarder des parties (localStorage, export/import JSON) ? **R :** export/import JSON.

## 4. Impression A4

4.1. Méthode : impression navigateur (CSS `@page`) ou génération **PDF** côté client (pdf-lib / jsPDF) ?
**R :** CSS print d'abord (simple, vectoriel), export PDF en option plus tard.
4.2. Recto seul ou recto-verso (dos des cartes d'étape) ? Si recto-verso : bord long ou court ?
4.3. Taille d'une carte d'étape et nombre par A4 ? (ex. 63×88 mm → 9 par page) Traits de coupe ?
4.4. Couleur ou noir & blanc (personnages distinguables en N&B via symboles/motifs) ? **R :** les deux.
4.5. Marges imprimante sûres : 5 mm ? 10 mm ? **R :** 10 mm.
4.6. Plan : tient sur **1 A4**, ou assemblage multi-pages (A3 = 2×A4) ?

## 5. Feuilles de notes

5.1. Contenu d'une feuille : grille personnages × étapes ? lieux × étapes ? les deux ?
5.2. « X coups par feuille / Y feuilles » : un *coup* = une étape (colonne) ? ou une question posée ?
**R :** colonne = étape, 6 par feuille, pagination automatique au-delà.
5.3. Nombre de joueurs → nombre d'exemplaires imprimés automatiquement ?
5.4. Zone de déduction finale (« je pense que… ») sur la feuille ?

## 6. Caches

6.1. Le cache sert à révéler **quelle partie** d'une carte (info publique vs privée) ?
6.2. Fenêtre découpée (gabarit à découper) ou carte pliable ? **R :** gabarit avec fenêtre + trait de coupe.
6.3. Taille calée exactement sur la carte d'étape (tolérance de découpe ±1 mm) ?

## 7. Technique

7.1. Stack : TypeScript + Vite, avec ou sans framework UI ? **R :** TS + Vite + **Preact** ou Vanilla
(rendu majoritairement SVG/HTML statique, peu d'état).
7.2. Hébergement : GitHub Pages ? **R :** oui, via GitHub Actions.
7.3. Langue de l'interface : FR seul, ou FR/EN ? **R :** FR, textes centralisés pour i18n future.
7.4. Tests : Vitest pour le moteur (génération, solveur), Playwright pour vérifier le rendu print ?
**R :** oui pour Vitest dès le départ, Playwright au jalon impression.
