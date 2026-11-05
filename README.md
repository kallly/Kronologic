# Générateur de scénarios de déduction temporelle (imprimable A4)

Application **100 % front-end** qui génère, à partir d'un plan de lieux et d'une graine aléatoire,
tout le matériel nécessaire pour jouer une partie d'un jeu de déduction « qui était où, et quand ? »,
puis le met en page pour une impression sur feuilles **A4**.

> ⚠️ Propriété intellectuelle : le projet reprend un **genre / des mécaniques** de jeu de déduction
> temporelle, mais **tout le contenu doit être original** (nom du jeu, plans, lieux, personnages,
> illustrations, charte graphique, textes des règles). On ne reproduit ni le nom, ni les cartes, ni
> le plateau, ni les visuels d'un jeu existant. Voir `docs/QUESTIONS.md` §0.

## Matériel généré

| Document | Contenu |
|---|---|
| **Plan** | Le plateau seul (lieux + connexions). Une première carte, d'autres ensuite. |
| **Cartes d'étapes** | Une carte par (lieu × étape) : informations publiques et privées à révéler. |
| **Solution** | Déplacements complets de chaque personnage + réponse à l'énigme. |
| **Feuilles de notes** | Grilles joueurs : 6 étapes par feuille par défaut, N feuilles si plus d'étapes. |
| **Caches** | Gabarits à découper pour ne lire qu'une zone d'une carte d'étape. |

## Documentation

- [`docs/QUESTIONS.md`](docs/QUESTIONS.md) — questions à trancher avant de coder.
- [`docs/PLAN.md`](docs/PLAN.md) — plan d'action proposé (jalons, architecture, livrables).

## État

Dépôt initialisé, phase de cadrage. Aucune stack n'est figée tant que les questions ne sont pas tranchées.
