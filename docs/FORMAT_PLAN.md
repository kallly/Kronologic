# Format d'un plan (import JSON)

```json
{
  "id": "mon-plan",
  "name": "Mon plan",
  "width": 300,
  "height": 200,
  "rooms": [
    { "id": "a", "name": "Salle A", "x": 0,   "y": 0, "w": 100, "h": 100 },
    { "id": "b", "name": "Salle B", "x": 100, "y": 0, "w": 100, "h": 100 }
  ],
  "doors": [["a", "b"]]
}
```

- Coordonnées libres (rectangles) dans le repère `width × height` ; le plan est mis à l'échelle à l'impression.
- `doors` : une entrée par porte. Deux salles voisines **sans** entrée dans `doors` sont séparées par un mur plein.
- Règles vérifiées à l'import : identifiants uniques, portes entre salles existantes **qui partagent un mur**,
  pas de porte en double, toutes les salles accessibles.
- Le jeu original utilise 6 salles ; c'est le nombre recommandé (d'autres nombres sont acceptés :
  une carte par salle, une colonne par salle sur la feuille de notes).
