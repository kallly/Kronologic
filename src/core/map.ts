import type { GameMap, Room, RoomId } from './types';

export type Adjacency = Map<RoomId, RoomId[]>;

export function buildAdjacency(map: GameMap): Adjacency {
  const adj: Adjacency = new Map(map.rooms.map((r) => [r.id, [] as RoomId[]]));
  for (const [a, b] of map.doors) {
    adj.get(a)?.push(b);
    adj.get(b)?.push(a);
  }
  return adj;
}

/** Deux salles partagent-elles un mur (segment de longueur > 0) ? Condition pour y placer une porte. */
export function shareWall(a: Room, b: Room): boolean {
  const overlapX = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const overlapY = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  const touchX = a.x + a.w === b.x || b.x + b.w === a.x;
  const touchY = a.y + a.h === b.y || b.y + b.h === a.y;
  return (touchX && overlapY > 0) || (touchY && overlapX > 0);
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
    const ra = map.rooms.find((r) => r.id === a);
    const rb = map.rooms.find((r) => r.id === b);
    if (ra && rb && a !== b && !shareWall(ra, rb)) errors.push(`Porte impossible (salles non contiguës) : ${a} – ${b}`);
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

/** Lit un plan JSON importé par l'utilisateur (structure vérifiée, puis validateMap). */
export function parseMap(json: unknown): GameMap {
  const o = json as Partial<GameMap>;
  const isNum = (v: unknown) => typeof v === 'number' && Number.isFinite(v);
  if (!o || typeof o !== 'object') throw new Error('Le fichier ne contient pas un objet JSON');
  if (typeof o.id !== 'string' || typeof o.name !== 'string') throw new Error('Champs « id » et « name » requis (texte)');
  if (!isNum(o.width) || !isNum(o.height)) throw new Error('Champs « width » et « height » requis (nombres)');
  if (!Array.isArray(o.rooms) || !Array.isArray(o.doors)) throw new Error('Champs « rooms » et « doors » requis (listes)');
  for (const r of o.rooms) {
    if (typeof r?.id !== 'string' || typeof r?.name !== 'string' || ![r.x, r.y, r.w, r.h].every(isNum)) {
      throw new Error(`Salle mal formée : ${JSON.stringify(r)}`);
    }
  }
  for (const d of o.doors) {
    if (!Array.isArray(d) || d.length !== 2 || d.some((x) => typeof x !== 'string')) throw new Error(`Porte mal formée : ${JSON.stringify(d)}`);
  }
  const map = o as GameMap;
  const errors = validateMap(map);
  if (errors.length) throw new Error(errors.join('\n'));
  return map;
}
