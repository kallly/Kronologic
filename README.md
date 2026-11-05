# Kronologic generator (imprimable A4)

Application **100 % front-end** qui génère, à partir d'un plan de lieux et d'une graine aléatoire,
tout le matériel nécessaire pour jouer une partie d'un jeu de déduction « qui était où, et quand ? »,
puis le met en page pour une impression sur feuilles **A4**.

## Matériel généré

| Document | Contenu |
|---|---|
| **Plan** | Le plateau seul (lieux + connexions). Une première carte, d'autres ensuite. |
| **Cartes de salle** | Une par salle : nb de présents par étape (public) ; par personnage, nb de passages + une étape exacte (privé). |
| **Solution** | Déplacements complets de chaque personnage + réponse à l'énigme. |
| **Feuilles de notes** | 6 mini-plans (1 par étape) + liste des personnages × salles ; feuille supplémentaire au-delà de 6 étapes. |
| **Caches** | À découper : 1 cache par personnage, 1 cache par étape, posés sur une carte de salle. |

## Documentation

- [`docs/DECISIONS.md`](docs/DECISIONS.md) — choix arrêtés et points ouverts.
- [`docs/PLAN.md`](docs/PLAN.md) — plan d'action proposé (jalons, architecture, livrables).

## Démarrer

```bash
npm install
npm run dev      # http://localhost:5173/?seed=DEMO
npm test
npm run build
```

Une partie est entièrement définie par l'URL : `?map=villa&seed=DEMO&steps=6`.
