import { buildAdjacency, validateMap } from './map';
import { createRng } from './rng';
import type { GameMap, RoomId, Story, StoryConfig } from './types';

/**
 * Génère les trajets de tous les personnages.
 * À chaque étape, un personnage passe dans une salle adjacente
 * (ou reste sur place si `allowStay`).
 */
export function generateStory(map: GameMap, config: StoryConfig): Story {
  const errors = validateMap(map);
  if (errors.length) throw new Error(`Plan invalide :\n${errors.join('\n')}`);
  if (config.steps < 1) throw new Error("Il faut au moins 1 étape");
  if (config.startRoom && !map.rooms.some((r) => r.id === config.startRoom)) {
    throw new Error(`Salle de départ inconnue : ${config.startRoom}`);
  }

  const rng = createRng(config.seed);
  const adj = buildAdjacency(map);
  const roomIds = map.rooms.map((r) => r.id);
  const paths: Story['paths'] = {};

  for (const character of config.characters) {
    const path: RoomId[] = [config.startRoom ?? rng.pick(roomIds)];
    for (let step = 1; step < config.steps; step++) {
      const current = path[step - 1]!;
      const options = [...(adj.get(current) ?? [])];
      if (config.allowStay || options.length === 0) options.push(current);
      path.push(rng.pick(options));
    }
    paths[character.id] = path;
  }
  return { config, map, paths };
}

/** Vérifie qu'un trajet respecte le plan et les règles de déplacement. */
export function isValidPath(map: GameMap, path: RoomId[], allowStay: boolean): boolean {
  const adj = buildAdjacency(map);
  return path.every((room, i) => {
    if (!adj.has(room)) return false;
    if (i === 0) return true;
    const prev = path[i - 1]!;
    return (allowStay && prev === room) || (adj.get(prev) ?? []).includes(room);
  });
}
