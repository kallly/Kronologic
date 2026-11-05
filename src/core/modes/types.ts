import type { RevealRules } from '../roomStory';
import type { Paths } from '../solver';
import type { CharacterId, GameMap, RoomId, Story, StoryConfig } from '../types';

export type ModeId = 'tete' | 'fantome' | 'bijou';

/** Case mise en évidence sur la solution. */
export interface Highlight {
  room: RoomId;
  /** Index d'étape 0-based. */
  step: number;
  kind: 'answer' | 'trail';
}

/** Une histoire construite pour un mode, avec sa réponse. */
export interface ModeStory {
  story: Story;
  /** Clé de réponse comparée à celle du solveur. */
  answerKey: string;
  /** Phrase de solution. */
  answerText: string;
  highlights: Highlight[];
  /** Faits publics propres à la quête (ex. porteur initial du bijou), affichés à la mise en place. */
  facts: string[];
  /** Révélations privées interdites (aucune carte ne doit donner seule la réponse). */
  rules: RevealRules;
  /** Réponse d'une histoire candidate du solveur ; null si elle ne respecte pas la prémisse. */
  answerOf: (paths: Paths) => string | null;
}

export interface Mode {
  id: ModeId;
  name: string;
  /** Énoncé (prémisse) lu par les joueurs. */
  intro: string[];
  question: string;
  /** Une tentative de construction ; null si l'histoire tirée ne convient pas. */
  build(map: GameMap, config: StoryConfig): ModeStory | null;
}

export const nameOf = (config: StoryConfig, id: CharacterId) => config.characters.find((c) => c.id === id)?.name ?? id;

/** Personnages présents dans `room` à l'étape `step`. */
export function presentAt(paths: Paths, room: RoomId, step: number): CharacterId[] {
  return Object.entries(paths).filter(([, p]) => p[step] === room).map(([id]) => id);
}
