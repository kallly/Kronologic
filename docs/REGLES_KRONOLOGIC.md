# Kronologic — règles, mécaniques et gameplay (référence vérifiée)

Ce document sert de **base de référence** pour le générateur. Chaque affirmation porte un niveau de vérification :

| Niveau | Signification |
|---|---|
| ✅ **Confirmé** | Au moins 2 sources indépendantes concordantes (dont, si possible, un résumé de la règle officielle). |
| ⚠️ **Source unique** | Une seule source, ou sources divergentes. À confirmer avant de coder dessus. |
| ❓ **Non trouvé** | Aucune source publique trouvée. **Ne pas implémenter sans vérification dans le livret.** |

> Méthode : recherches web (FR/EN) du 05/11/2026. Le livret officiel lui-même **n'a pas pu être consulté**
> (pas de PDF public trouvé, accès direct aux pages bloqué dans cet environnement) : les informations
> proviennent de résumés de règles, critiques et fiches éditeurs/boutiques. Les points ⚠️ et ❓ sont
> à contrôler avec la boîte (livret de règles + livret de scénario).

---

## 1. Identité du jeu

| Fait | Niveau | Sources |
|---|---|---|
| Jeu de déduction, 1 à 4 joueurs, ~30 min, dès 10 ans. | ✅ | [asdesjeux][asdesjeux], [boardgamequest-paris][bgq-paris] |
| Auteurs : Yoann Levet, Fabien Gridel. Éditeurs : Origames / Super Meeple (FR), Hachette Boardgames (EN). | ✅ | [antretemps][antretemps], [supermeeple][supermeeple], [hachette][hachette] |
| « Un Cluedo moderne » : trouver le **qui**, le **où** et le **quand**. | ✅ | [ludiquement][ludiquement], [akoatujou][akoatujou] |
| As d'Or 2025 (catégorie débutant déduction/enquête). | ⚠️ | [ludiquement][ludiquement] |
| Gamme : **Paris 1920** (boîte de base), extensions *Panique à l'Opéra* (scénario 4) et *Les Amants maudits* (scénario 5) ; **Cuzco 1450** (jeu autonome) ; **Babylon 2500** (2026). | ✅ | [jedisjeux][jedisjeux], [cardhaus-ext][cardhaus-ext], [bgq-cuzco][bgq-cuzco], [backseat][backseat] |

## 2. Matériel (Paris 1920)

| Élément | Niveau | Sources |
|---|---|---|
| 6 plaquettes **Personnage**, 6 plaquettes **Temps**. | ✅ | [asdesjeux][asdesjeux], [jeudice][jeudice], [cardhaus][cardhaus] |
| 1 plateau (plan de l'Opéra, vue de dessus du Palais Garnier). | ✅ | [cardhaus][cardhaus], [ourboardgamelife][obgl] |
| 1 bloc de feuilles de notes, 4 paravents, 4 crayons, 1 règle. | ✅ | [asdesjeux][asdesjeux], [jeudice][jeudice] |
| 3 scénarios × 5 enquêtes = 15 enquêtes. | ✅ | [jedisjeux][jedisjeux], [bgq-paris][bgq-paris] |
| **30 cartes Lieu par scénario = 6 par enquête** (une par lieu). 3 × 30 = 90 cartes au total. | ✅ | [cardhaus][cardhaus] (30 cartes/enveloppe, 6/enquête), [asdesjeux][asdesjeux] (90 cartes) |
| Chaque enquête fournit : le mystère, ses règles spécifiques, les conditions de victoire, la solution, ses cartes Lieu. | ⚠️ | [jedisjeux][jedisjeux] |

## 3. Structure d'une enquête

| Règle | Niveau | Sources |
|---|---|---|
| **6 personnages, 6 lieux, 6 temps** (Paris 1920). | ✅ | [whatsericplaying][wep], [meepleqc][meepleqc] |
| Chaque personnage est **en permanence** dans l'un des lieux. | ✅ | [whatsericplaying][wep], [cardhaus][cardhaus] |
| L'enquête indique **quels personnages et quelles plaquettes Temps** sont utilisés, et **la position de départ de chaque personnage au Temps 1**. | ⚠️ | [opinionatedgamers][og] (explicite) ; [whatsericplaying][wep] (« mettre en place le Temps 1 selon le livret ») |
| Dans au moins un des premiers scénarios, la position de chaque personnage au premier temps est donnée. | ⚠️ | [punchboard][punchboard] |
| Le nombre de personnages / temps **ne varie pas** selon l'enquête : le même matériel sert à toutes les enquêtes d'une boîte. | ✅ validé utilisateur | |

## 4. Règle de déplacement

| Règle | Niveau | Sources |
|---|---|---|
| Entre deux Temps, chaque personnage passe dans un **lieu adjacent**. | ✅ | [campustech][campustech], [meadowparty][meadow], [whatsericplaying][wep] |
| Un personnage **ne reste jamais deux Temps consécutifs dans le même lieu**. | ✅ | [campustech][campustech], [meadowparty][meadow] |
| Déplacement d'**un seul** lieu par Temps (pas de saut). | ✅ | [meadowparty][meadow], [opinionatedgamers][og] |
| Conséquence : le nombre de passages consécutifs dans un même lieu est limité (au mieux un Temps sur deux). | ✅ (déduction logique des 2 règles ci-dessus) | [punchboard][punchboard] |

## 5. Tour de jeu : poser une question

| Règle | Niveau | Sources |
|---|---|---|
| Le joueur actif choisit une **carte Lieu** et la glisse **sous une plaquette Temps OU une plaquette Personnage**. | ✅ | [campustech][campustech], [ludum][ludum], [ludoya][ludoya] |
| La plaquette est **perforée** : ses fenêtres ne laissent voir que 2 informations de la carte. | ✅ | [campustech][campustech], [punchboard][punchboard] |
| La carte se place avec son **coin arrondi aligné** sur celui de la plaquette, l'icône du lieu visible dans un trou. | ⚠️ | [ludoya][ludoya] |
| Information sur **fond vert = partagée**, annoncée à voix haute ; sur **fond blanc = privée**, pour le joueur actif seulement. | ✅ | [campustech][campustech], [ludoya][ludoya] |
| Les joueurs notent sur leur feuille, derrière leur paravent. | ✅ | [meepleqc][meepleqc], [bgq-paris][bgq-paris] |

### 5.1 Carte Lieu sous une plaquette **Temps**

| Information | Type | Niveau | Sources |
|---|---|---|---|
| **Nombre de personnages** présents dans ce lieu à ce Temps. | partagée | ✅ | [bgq-paris][bgq-paris], [geeksundergrace][gug], [ludoya][ludoya] |
| **Identité d'un** personnage présent dans ce lieu à ce Temps (si le nombre n'est pas 0). | privée | ✅ | [geeksundergrace][gug], [bgq-paris][bgq-paris] |
| Quel personnage est montré quand plusieurs sont présents (règle de choix). | — | ❓ | défini par l'auteur de la carte |
| Quand personne n'est présent : la case privée affiche une **flèche « rejouer »** (le joueur peut reposer une question). | privée | ✅ validé utilisateur (possède le jeu) | |

### 5.2 Carte Lieu sous une plaquette **Personnage**

| Information | Type | Niveau | Sources |
|---|---|---|---|
| **Nombre de passages** de ce personnage dans ce lieu, tous Temps confondus. | partagée | ✅ | [jeudice][jeudice], [akoatujou][akoatujou], [gug][gug] |
| **Un Temps précis** où ce personnage était dans ce lieu. | privée | ✅ | [gug][gug], [ludoya][ludoya] |
| Quel Temps est montré quand il y a plusieurs passages (règle de choix). | — | ❓ | |
| Si 0 passage : même **flèche « rejouer »**. | privée | ✅ validé utilisateur | |

> **Conséquence pour le support** : une carte Lieu contient, à des positions fixes, (a) pour chaque Temps
> un nombre + un personnage, (b) pour chaque Personnage un nombre + un Temps. Chaque plaquette (cache)
> n'ouvre qu'une paire de cases. *La disposition exacte des cases sur la carte originale n'est pas documentée publiquement (❓).*

## 6. Fin de partie

| Règle | Niveau | Sources |
|---|---|---|
| Un joueur qui pense avoir trouvé annonce sa solution ; la partie s'interrompt et il la vérifie. | ✅ | [campustech][campustech], [og][og] |
| Solution juste → il **gagne immédiatement**. Fausse → il est **éliminé**, la partie reprend. | ✅ | [campustech][campustech], [og][og] |
| Si tous les joueurs se sont trompés, tout le monde perd. | ⚠️ | [og][og] |
| Il existe une règle pour les annonces simultanées (détail inconnu). | ❓ | [og][og] la mentionne sans la décrire |

## 7. Mode solo

| Règle | Niveau | Sources |
|---|---|---|
| À chaque question, le joueur reçoit **les deux** informations (partagée et privée). | ✅ | [asdesjeux][asdesjeux], [jeudice][jeudice] |
| Objectif : résoudre avec le **moins de questions** possible ; médaille Loupe d'Or / d'Argent / de Bronze. | ✅ | [jeudice][jeudice], [gusandco][gusandco] |
| Les seuils de médaille sont propres à chaque enquête. | ⚠️ | |

## 8. Scénarios de Paris 1920 (objectifs)

| Scénario | Objectif / indice de départ | Niveau | Sources |
|---|---|---|---|
| 1 — *Poison mondain* | Trouver **qui** a empoisonné le détective, **où** et **quand**. Seule info : le coupable était **seul avec la victime** dans un lieu. | ✅ | [bgq-paris][bgq-paris], [wep][wep] |
| 2 — *Le Fantôme de l'Opéra* | Trouver **qui** est le Fantôme. Indice : le Fantôme est **seul à chacun des 6 Temps**. | ✅ | [bgq-paris][bgq-paris], [wep][wep] |
| 3 — *Le Bijou de la Cantatrice* | Trouver **qui détient le collier au Temps 6 et où**. Les voleurs se le passent quand ils sont **seuls avec un complice**. | ✅ / ⚠️ (passage du collier : 1 source) | [bgq-paris][bgq-paris], [wep][wep] |
| Niveaux de difficulté | 5 enquêtes de difficulté croissante par scénario ; une fiche donne 1–3 / 3–4 / 3–5 par scénario. | ⚠️ (sources divergentes) | [jedisjeux][jedisjeux], [ludum][ludum] |
| Enquêtes additionnelles | 7 enquêtes ajoutées à *Poison mondain* (nov. 2024) ; scénario *Festival sanglant*. | ⚠️ | [steam workshop][steam] |

**Point commun** : chaque objectif est une **contrainte sur les trajets** (« seul avec », « seul à chaque Temps »,
« transmission quand seuls ensemble »). C'est ce qui rend la génération automatique possible : on génère des
trajets, on vérifie la contrainte, et on vérifie que la solution est **unique**.

## 9. Plan / plateau

| Fait | Niveau | Sources |
|---|---|---|
| Paris 1920 : 6 lieux de l'Opéra ; lieux cités : Scène, salle de danse, salle de musique, **Galerie (lieu central)**. | ⚠️ | [bgq-paris][bgq-paris] |
| Liste exacte des 6 lieux et de leurs adjacences. | ❓ | non trouvé |
| Cuzco 1450 : chaque lieu est relié à **3** autres ; certains passages sont **bloqués** (ou à sens unique) selon l'enquête. | ✅ / ⚠️ (sens unique : 1 source) | [bgq-cuzco][bgq-cuzco], [vindjeu][vindjeu] |
| Cuzco 1450, scénario 3 : déplacements en « danses » (cercles horaires) ; but : position de chaque personnage au Temps 6. | ⚠️ | [bgq-cuzco][bgq-cuzco] |
| Babylon 2500 : les indices viennent des **personnages** et non plus des lieux ; ajout d'une question « quand » (voyage temporel). | ⚠️ | [gusandco-babylon][gusandco-b], [backseat][backseat] |

## 10. Feuille de notes

| Fait | Niveau | Sources |
|---|---|---|
| Un **plan de l'Opéra pour chacun des 6 Temps** ; chaque lieu représenté par un symbole. | ✅ | [punchboard][punchboard], [meepleqc][meepleqc] |
| Une section pour noter **combien de fois chaque personnage est passé dans chaque lieu**. | ⚠️ | [punchboard][punchboard] + description fournie par l'utilisateur |
| Une feuille imprimable officielle existe (BoardGameGeek, mai 2024). | ⚠️ | [steam workshop][steam] |

---

## 11. Règles retenues pour le générateur

Uniquement des points ✅ (ou ⚠️ validés par l'utilisateur, qui possède le jeu) :

1. **Déplacement** : obligatoire vers un lieu adjacent à chaque Temps ; **jamais deux Temps de suite dans le même lieu**. (✅)
2. **Départ** : la position de chaque personnage au Temps 1 est **fixée par l'histoire / le numéro de partie**. (⚠️ source + validé utilisateur)
3. **Carte Lieu** (une par lieu et par partie) :
   - par Temps : nombre de présents (partagé) + **un** personnage présent (privé) ;
   - par Personnage : nombre de passages (partagé) + **un** Temps de passage (privé). (✅)
4. **Caches** : un cache par Temps et un par Personnage, chacun ouvrant exactement la paire d'infos correspondante. (✅)
5. **Fin de partie / solo** : hors périmètre du générateur (règles de table), mais imprimées sur la feuille de règles. (✅)
6. **Objectif** : contrainte sur les trajets + solution unique, à modéliser par type de scénario (J4).

## 12. À vérifier dans la boîte (bloquant pour un rendu « fidèle »)

- [ ] Règle de choix du personnage / du Temps privé quand plusieurs sont possibles.
- [x] Contenu de la case privée quand la réponse est 0 → flèche « rejouer ».
- [ ] Disposition exacte des cases sur une carte Lieu (positions relatives des fenêtres).
- [x] Le nombre de personnages / Temps varie-t-il selon l'enquête ? → non.
- [ ] Règle d'annonce simultanée ; seuils de médailles en solo.

---

## Sources

[asdesjeux]: https://www.asdesjeux.com/products/kronologic-paris-1920-fr
[bgq-paris]: https://www.boardgamequest.com/kronologic-paris-1920-review/
[bgq-cuzco]: https://www.boardgamequest.com/kronologic-cuzco-1450-review/
[antretemps]: https://www.antretemps.com/kronologic-paris-1920/
[supermeeple]: https://www.supermeeple.com/nos-jeux/kronologic/
[hachette]: https://www.hachetteboardgames.com/products/kronologic
[ludiquement]: https://ludiquement.fr/tests/kronologic/
[akoatujou]: https://akoatujou.fr/kronologic/
[jedisjeux]: https://www.jedisjeux.net/article/kronologic-paris-1920
[cardhaus]: https://www.cardhaus.com/kronologic-paris-1920/
[cardhaus-ext]: https://www.cardhaus.com/kronologic-paris-1920-panic-at-the-opera-the-cursed-lovers-expansions/
[backseat]: https://www.backseatgamer.com/news/kronologic-babylon-2500-adds-a-when-to-the-whodunnit
[jeudice]: https://www.jeudice.fr/kronologic-paris-1920/
[obgl]: https://ourboardgamelife.com/2026/03/13/kronologic-paris-1920-review/
[wep]: https://whatsericplaying.com/2026/07/06/kronologic-paris-1920/
[meepleqc]: https://www.meepleqc.ca/2024/09/03/kronologic-paris-1920-avis-et-chronique-de-jeu/
[og]: https://opinionatedgamers.com/2024/09/02/dale-yu-review-of-kronologic-paris-1920/
[punchboard]: https://punchboard.co.uk/kronologic-paris-1920-review/
[campustech]: https://www.campustech.fr/kronologic-quand-crime-et-logique-font-bon-menage/
[meadow]: https://meadowparty.com/blog/2024/09/19/kronologic-paris-1920/
[ludum]: https://www.ludum.fr/enquete-deduction-inities/kronologic-paris-1920-6136
[ludoya]: https://www.ludoya.com/games/kronologic-paris-1920
[gug]: https://www.geeksundergrace.com/tabletop/review-kronologic-paris-1920/
[gusandco]: https://gusandco.net/2024/03/16/kronologic-jeu-de-societe-deduction-enquetes-opera/
[gusandco-b]: https://gusandco.net/2026/04/27/test-avis-kronologic-babylon-2500/
[vindjeu]: https://www.vindjeu.eu/prd/2025/09/19/kronologic-cuzco-1450/
[steam]: https://steamcommunity.com/sharedfiles/filedetails/?id=3238979310

- Board Game Quest — Paris 1920 : https://www.boardgamequest.com/kronologic-paris-1920-review/
- Board Game Quest — Cuzco 1450 : https://www.boardgamequest.com/kronologic-cuzco-1450-review/
- Opinionated Gamers (Dale Yu) : https://opinionatedgamers.com/2024/09/02/dale-yu-review-of-kronologic-paris-1920/
- Punchboard : https://punchboard.co.uk/kronologic-paris-1920-review/
- What's Eric Playing : https://whatsericplaying.com/2026/07/06/kronologic-paris-1920/
- Meadow Party (Keith Law) : https://meadowparty.com/blog/2024/09/19/kronologic-paris-1920/
- Geeks Under Grace : https://www.geeksundergrace.com/tabletop/review-kronologic-paris-1920/
- Ludoya (résumé de règles) : https://www.ludoya.com/games/kronologic-paris-1920
- Campus Tech : https://www.campustech.fr/kronologic-quand-crime-et-logique-font-bon-menage/
- Jeudice : https://www.jeudice.fr/kronologic-paris-1920/
- Jedisjeux : https://www.jedisjeux.net/article/kronologic-paris-1920
- Meeple QC : https://www.meepleqc.ca/2024/09/03/kronologic-paris-1920-avis-et-chronique-de-jeu/
- Ludiquement : https://ludiquement.fr/tests/kronologic/
- Akoa Tujou : https://akoatujou.fr/kronologic/
- As des jeux : https://www.asdesjeux.com/products/kronologic-paris-1920-fr
- Cardhaus : https://www.cardhaus.com/kronologic-paris-1920/
- Our Board Game Life : https://ourboardgamelife.com/2026/03/13/kronologic-paris-1920-review/
- Gus & Co (Paris 1920) : https://gusandco.net/2024/03/16/kronologic-jeu-de-societe-deduction-enquetes-opera/
- Gus & Co (Babylon 2500) : https://gusandco.net/2026/04/27/test-avis-kronologic-babylon-2500/
- Vindjeu (Cuzco 1450) : https://www.vindjeu.eu/prd/2025/09/19/kronologic-cuzco-1450/
- Backseat Gamer (Babylon 2500) : https://www.backseatgamer.com/news/kronologic-babylon-2500-adds-a-when-to-the-whodunnit
- Steam Workshop (feuille de notes, enquêtes additionnelles) : https://steamcommunity.com/sharedfiles/filedetails/?id=3238979310
- Ludum : https://www.ludum.fr/enquete-deduction-inities/kronologic-paris-1920-6136
- Antre Temps : https://www.antretemps.com/kronologic-paris-1920/
- Super Meeple : https://www.supermeeple.com/nos-jeux/kronologic/
- Hachette Boardgames : https://www.hachetteboardgames.com/products/kronologic
