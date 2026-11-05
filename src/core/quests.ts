import { modeById, type Highlight, type ModeId } from './modes';
import { createRng } from './rng';
import { buildRoomStoriesChecked } from './roomStory';
import { solve } from './solver';
import type { Character, CharacterId, GameMap, RoomId, RoomStory, Story } from './types';

export const LEVELS = [1, 2, 3, 4, 5] as const;
export type Level = (typeof LEVELS)[number];

/** Nombre de positions de départ révélées selon le niveau (difficulté croissante). */
export const KNOWN_STARTS: Record<Level, number> = { 1: 6, 2: 4, 3: 3, 4: 1, 5: 0 };

export interface QuestRef {
  mode: ModeId;
  level: Level;
}

/** Une quête = un jeu de 6 cartes de salle + sa feuille mise en place / solution. */
export interface Quest extends QuestRef {
  label: string;
  story: Story;
  rooms: RoomStory[];
  intro: string[];
  question: string;
  facts: string[];
  /** Positions de départ données aux joueurs. */
  knownStarts: Partial<Record<CharacterId, RoomId>>;
  answerText: string;
  highlights: Highlight[];
  /** Nombre de tirages nécessaires (diagnostic). */
  attempts: number;
  /** Nombre d'histoires compatibles avec les cartes (indice de difficulté). */
  worlds: number;
}

export const questSeed = (mapId: string, ref: QuestRef) => `${mapId}#${ref.mode}#${ref.level}`;

/**
 * Génère une quête : histoire construite pour le mode, cartes sans révélation directe de la réponse,
 * puis vérification par le solveur que la réponse est unique à partir des cartes + infos publiques.
 */
export function generateQuest(map: GameMap, characters: Character[], ref: QuestRef, steps = 6, maxAttempts = 3000): Quest {
  const mode = modeById(ref.mode);
  const baseSeed = questSeed(map.id, ref);
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const seed = attempt === 0 ? baseSeed : `${baseSeed}/${attempt}`;
    const built = mode.build(map, { seed, steps, characters });
    if (!built) continue;
    const { rooms, unavoidable } = buildRoomStoriesChecked(built.story, built.rules);
    if (unavoidable > 0) continue;

    const known = createRng(`${seed}:starts`)
      .shuffle(characters.map((c) => c.id))
      .slice(0, KNOWN_STARTS[ref.level]);
    const knownStarts = Object.fromEntries(known.map((id) => [id, built.story.paths[id]![0]!]));
    const result = solve(
      { map, characters: characters.map((c) => c.id), steps, rooms, startPositions: knownStarts },
      built.answerOf,
    );
    if (result.truncated || result.answers.size !== 1 || !result.answers.has(built.answerKey)) continue;

    return {
      ...ref,
      label: `${mode.name} · Enquête ${ref.level}`,
      story: built.story,
      rooms,
      intro: mode.intro,
      question: mode.question,
      facts: built.facts,
      knownStarts,
      answerText: built.answerText,
      highlights: built.highlights,
      attempts: attempt + 1,
      worlds: result.worlds,
    };
  }
  throw new Error(`Impossible de générer ${mode.name} niveau ${ref.level} sur ${map.name} en ${maxAttempts} essais`);
}

/** Lit « tete:1-5,fantome:2,bijou:1-3 ». */
export function parseQuestList(s: string): QuestRef[] {
  const out: QuestRef[] = [];
  for (const part of s.split(',')) {
    const [mode, range] = part.split(':');
    if (!mode || !range || !['tete', 'fantome', 'bijou'].includes(mode)) continue;
    const [a, b] = range.split('-').map(Number);
    for (let l = a!; l <= (b ?? a!); l++) if (LEVELS.includes(l as Level)) out.push({ mode: mode as ModeId, level: l as Level });
  }
  return out;
}

export function formatQuestList(refs: QuestRef[]): string {
  return (['tete', 'fantome', 'bijou'] as ModeId[])
    .map((m) => [m, refs.filter((r) => r.mode === m).map((r) => r.level)] as const)
    .filter(([, ls]) => ls.length)
    .map(([m, ls]) => `${m}:${ls.join(`,${m}:`)}`)
    .join(',');
}
