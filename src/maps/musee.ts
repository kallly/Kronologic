import type { GameMap } from '../core/types';

/**
 * Plan original. Toutes les salles voisines ne communiquent pas :
 * les murs sans porte (Cabinet–Statues, Observatoire–Réserve) ne se traversent pas.
 */
export const musee: GameMap = {
  id: 'musee',
  name: 'Musée de la Lanterne',
  width: 300,
  height: 200,
  rooms: [
    { id: 'egypte', name: 'Salle égyptienne', x: 0, y: 0, w: 100, h: 100 },
    { id: 'cabinet', name: 'Cabinet', x: 100, y: 0, w: 100, h: 100 },
    { id: 'observatoire', name: 'Observatoire', x: 200, y: 0, w: 100, h: 100 },
    { id: 'vestibule', name: 'Vestibule', x: 0, y: 100, w: 100, h: 100 },
    { id: 'statues', name: 'Statues', x: 100, y: 100, w: 100, h: 100 },
    { id: 'reserve', name: 'Réserve', x: 200, y: 100, w: 100, h: 100 },
  ],
  doors: [
    ['vestibule', 'egypte'],
    ['vestibule', 'statues'],
    ['egypte', 'cabinet'],
    ['cabinet', 'observatoire'],
    ['statues', 'reserve'],
  ],
};
