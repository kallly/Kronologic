import type { GameMap } from '../core/types';

/**
 * Plan original asymétrique : salles de tailles et de formes différentes,
 * murs sans porte (Salon–Véranda, Salon–Hall, Salon–Chapelle).
 */
export const manoir: GameMap = {
  id: 'manoir',
  name: 'Manoir de Brume',
  width: 300,
  height: 220,
  rooms: [
    { id: 'bibliotheque', name: 'Bibliothèque', x: 0, y: 0, w: 120, h: 80 },
    { id: 'salon', name: 'Salon', x: 120, y: 0, w: 70, h: 130 },
    { id: 'veranda', name: 'Véranda', x: 190, y: 0, w: 110, h: 55 },
    { id: 'cuisine', name: 'Cuisine', x: 190, y: 55, w: 110, h: 75 },
    { id: 'hall', name: 'Hall', x: 0, y: 80, w: 120, h: 140 },
    { id: 'chapelle', name: 'Chapelle', x: 120, y: 130, w: 180, h: 90 },
  ],
  doors: [
    ['bibliotheque', 'hall'],
    ['bibliotheque', 'salon'],
    ['hall', 'chapelle'],
    ['salon', 'cuisine'],
    ['cuisine', 'veranda'],
    ['cuisine', 'chapelle'],
  ],
};
