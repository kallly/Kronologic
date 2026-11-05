import type { Character, GameMap } from '../core/types';

/**
 * Plan de démonstration (original). D'autres plans viendront s'ajouter dans ce dossier.
 * Repère : 300 × 200, une case de grille = 100 × 100.
 */
export const villa: GameMap = {
  id: 'villa',
  name: 'Villa des Glycines',
  width: 300,
  height: 200,
  rooms: [
    { id: 'hall', name: 'Hall', x: 100, y: 100, w: 100, h: 100 },
    { id: 'salon', name: 'Salon', x: 0, y: 100, w: 100, h: 100 },
    { id: 'cuisine', name: 'Cuisine', x: 200, y: 100, w: 100, h: 100 },
    { id: 'bibliotheque', name: 'Bibliothèque', x: 0, y: 0, w: 100, h: 100 },
    { id: 'galerie', name: 'Galerie', x: 100, y: 0, w: 100, h: 100 },
    { id: 'serre', name: 'Serre', x: 200, y: 0, w: 100, h: 100 },
  ],
  doors: [
    ['hall', 'salon'],
    ['hall', 'cuisine'],
    ['hall', 'galerie'],
    ['salon', 'bibliotheque'],
    ['bibliotheque', 'galerie'],
    ['galerie', 'serre'],
    ['cuisine', 'serre'],
  ],
};

export const defaultCharacters: Character[] = [
  { id: 'A', name: 'Archiviste', color: '#c0392b', symbol: 'A' },
  { id: 'B', name: 'Botaniste', color: '#27ae60', symbol: 'B' },
  { id: 'C', name: 'Cuisinier', color: '#2980b9', symbol: 'C' },
  { id: 'D', name: 'Détective', color: '#8e44ad', symbol: 'D', role: 'detective' },
  { id: 'E', name: 'Écrivain', color: '#d35400', symbol: 'E' },
  { id: 'F', name: 'Fauconnier', color: '#7f8c8d', symbol: 'F' },
];
