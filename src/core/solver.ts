import { buildAdjacency } from './map';
import type { CharacterId, GameMap, RoomId, RoomStory } from './types';

/** Ce que les joueurs peuvent connaître : tout le contenu des cartes + les infos publiques de la quête. */
export interface SolverInput {
  map: GameMap;
  characters: CharacterId[];
  steps: number;
  rooms: RoomStory[];
  /** Positions connues à l'étape 1 (sous-ensemble des personnages). */
  startPositions?: Partial<Record<CharacterId, RoomId>>;
}

export type Paths = Record<CharacterId, RoomId[]>;

export interface SolverResult {
  /** Réponses distinctes trouvées (clé texte renvoyée par `answerOf`). */
  answers: Set<string>;
  /** Nombre d'histoires compatibles explorées (plafonné par `maxWorlds`). */
  worlds: number;
  /** true si l'exploration a été interrompue (plafond atteint ou 2 réponses trouvées). */
  truncated: boolean;
}

/** Tous les trajets d'un personnage qui respectent les déplacements (adjacents, jamais sur place). */
function allPaths(map: GameMap, steps: number, start?: RoomId): RoomId[][] {
  const adj = buildAdjacency(map);
  const out: RoomId[][] = [];
  const extend = (path: RoomId[]) => {
    if (path.length === steps) return void out.push(path);
    for (const next of adj.get(path[path.length - 1]!) ?? []) extend([...path, next]);
  };
  for (const room of start ? [start] : map.rooms.map((r) => r.id)) extend([room]);
  return out;
}

/**
 * Énumère les histoires compatibles avec les cartes et applique `answerOf` à chacune.
 * `answerOf` renvoie null quand l'histoire ne respecte pas la prémisse de l'énigme (elle est alors écartée).
 * La quête est déductible si exactement une réponse est trouvée.
 */
export function solve(
  input: SolverInput,
  answerOf: (paths: Paths) => string | null,
  opts: { maxWorlds?: number; stopAtTwoAnswers?: boolean } = {},
): SolverResult {
  const { maxWorlds = 20000, stopAtTwoAnswers = true } = opts;
  const { map, characters, steps, rooms } = input;
  const roomIndex = new Map(map.rooms.map((r, i) => [r.id, i]));
  const card = new Map(rooms.map((r) => [r.roomId, r]));

  // 1. Trajets candidats par personnage : passages par salle, étapes révélées, personnages révélés.
  const candidates = characters.map((c) => {
    const paths = allPaths(map, steps, input.startPositions?.[c]).filter((path) =>
      map.rooms.every((room) => {
        const rs = card.get(room.id)!;
        const info = rs.characters[c]!;
        let visits = 0;
        for (let s = 0; s < steps; s++) {
          const here = path[s] === room.id;
          if (here) visits++;
          // Révélé comme présent à cette étape ⇒ doit y être.
          if (rs.steps[s]!.revealedCharacter === c && !here) return false;
          // Salle vide à cette étape ⇒ ne peut pas y être.
          if (here && rs.steps[s]!.count === 0) return false;
        }
        if (visits !== info.visits) return false;
        return info.revealedStep === null || path[info.revealedStep] === room.id;
      }),
    );
    return { c, paths };
  });
  candidates.sort((a, b) => a.paths.length - b.paths.length);

  // 2. Combinaison : les effectifs par salle et par étape doivent correspondre exactement.
  const target = map.rooms.map((r) => card.get(r.id)!.steps.map((s) => s.count));
  const counts = map.rooms.map(() => Array.from({ length: steps }, () => 0));
  const chosen: Paths = {};
  const result: SolverResult = { answers: new Set(), worlds: 0, truncated: false };

  const stop = () => result.worlds >= maxWorlds || (stopAtTwoAnswers && result.answers.size >= 2);

  const visit = (i: number): void => {
    if (stop()) {
      result.truncated = true;
      return;
    }
    if (i === candidates.length) {
      // Tous placés : chaque personnage occupe une salle par étape, donc égalité complète si aucun dépassement.
      if (!target.every((row, r) => row.every((v, s) => v === counts[r]![s]))) return;
      result.worlds++;
      const answer = answerOf(chosen);
      if (answer !== null) result.answers.add(answer);
      return;
    }
    const { c, paths } = candidates[i]!;
    for (const path of paths) {
      let ok = true;
      for (let s = 0; s < steps; s++) {
        const r = roomIndex.get(path[s]!)!;
        if (++counts[r]![s]! > target[r]![s]!) ok = false;
      }
      if (ok) {
        chosen[c] = path;
        visit(i + 1);
        delete chosen[c];
      }
      for (let s = 0; s < steps; s++) counts[roomIndex.get(path[s]!)!]![s]!--;
      if (result.truncated) return;
    }
  };
  visit(0);
  return result;
}
