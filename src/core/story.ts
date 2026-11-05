import { buildAdjacency, validateMap } from './map';
import { createRng } from './rng';
import type { GameMap, RoomId, Story, StoryConfig } from './types';

/**
 * Génère les trajets de tous les personnages selon les règles (docs/REGLES_KRONOLOGIC.md §4) :
 * à chaque étape, passage obligatoire dans une salle **adjacente** ; jamais deux étapes
 * consécutives dans la même salle.
 */
export function generateStory(map: GameMap, config: StoryConfig): Story {
  const errors = validateMap(map);
  if (errors.length) throw new Error(`Plan invalide :\n${errors.join('\n')}`);
  if (config.steps < 1) throw new Error('Il faut au moins 1 étape');

  const rng = createRng(config.seed);
  const adj = buildAdjacency(map);
  const roomIds = map.rooms.map((r) => r.id);
  const paths: Story['paths'] = {};

  for (const character of config.characters) {
    const start = config.startPositions?.[character.id] ?? rng.pick(roomIds);
    if (!adj.has(start)) throw new Error(`Salle de départ inconnue pour ${character.id} : ${start}`);
    const path: RoomId[] = [start];
    for (let step = 1; step < config.steps; step++) {
      path.push(rng.pick(adj.get(path[step - 1]!)!));
    }
    paths[character.id] = path;
  }
  return { config, map, paths };
}

/** Vérifie qu'un trajet respecte le plan et la règle de déplacement. */
export function isValidPath(map: GameMap, path: RoomId[]): boolean {
  const adj = buildAdjacency(map);
  return path.every((room, i) => adj.has(room) && (i === 0 || adj.get(path[i - 1]!)!.includes(room)));
}
