import type { GameMap, RoomId } from './types';

export type Adjacency = Map<RoomId, RoomId[]>;

export function buildAdjacency(map: GameMap): Adjacency {
  const adj: Adjacency = new Map(map.rooms.map((r) => [r.id, [] as RoomId[]]));
  for (const [a, b] of map.doors) {
    adj.get(a)?.push(b);
    adj.get(b)?.push(a);
  }
  return adj;
}

/** Retourne la liste des problèmes du plan (vide si valide). */
export function validateMap(map: GameMap): string[] {
  const errors: string[] = [];
  const ids = new Set<RoomId>();
  for (const room of map.rooms) {
    if (ids.has(room.id)) errors.push(`Salle en double : ${room.id}`);
    ids.add(room.id);
  }
  if (ids.size === 0) errors.push('Le plan ne contient aucune salle');

  const seen = new Set<string>();
  for (const [a, b] of map.doors) {
    if (!ids.has(a)) errors.push(`Passage vers une salle inconnue : ${a}`);
    if (!ids.has(b)) errors.push(`Passage vers une salle inconnue : ${b}`);
    if (a === b) errors.push(`Passage d'une salle vers elle-même : ${a}`);
    const key = [a, b].sort().join('|');
    if (seen.has(key)) errors.push(`Passage en double : ${a} – ${b}`);
    seen.add(key);
  }

  // Connexité : toutes les salles doivent être atteignables.
  if (errors.length === 0) {
    const adj = buildAdjacency(map);
    const first = map.rooms[0]!.id;
    const reached = new Set([first]);
    const queue = [first];
    while (queue.length) {
      for (const n of adj.get(queue.shift()!) ?? []) {
        if (!reached.has(n)) {
          reached.add(n);
          queue.push(n);
        }
      }
    }
    for (const id of ids) if (!reached.has(id)) errors.push(`Salle inaccessible : ${id}`);
  }
  return errors;
}
