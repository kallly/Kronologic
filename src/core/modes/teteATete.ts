import { generateStory } from '../story';
import type { Paths } from '../solver';
import type { CharacterId, RoomId, StoryConfig } from '../types';
import { nameOf, presentAt, type Mode } from './types';

/**
 * « Tête-à-tête mortel » (scénario 1 du jeu original, cf. docs/REGLES_KRONOLOGIC.md §8) :
 * le Détective (un des 6) est empoisonné au **seul** moment où il est seul avec exactement un autre personnage,
 * entre l'étape 3 et l'étape 6. Empoisonné, il continue de se déplacer.
 */
export const MURDER_STEPS = [2, 3, 4, 5]; // index 0-based ⇒ étapes 3 à 6

export interface Meeting {
  culprit: CharacterId;
  room: RoomId;
  step: number;
}

/** Tous les moments où `victim` est seul avec exactement un autre personnage. */
export function teteATetes(paths: Paths, victim: CharacterId): Meeting[] {
  const out: Meeting[] = [];
  (paths[victim] ?? []).forEach((room, step) => {
    const others = presentAt(paths, room, step).filter((id) => id !== victim);
    if (others.length === 1) out.push({ culprit: others[0]!, room, step });
  });
  return out;
}

/** Le détective (victime) ; à défaut de rôle défini, le premier personnage. */
export function detectiveOf(config: StoryConfig): CharacterId {
  return (config.characters.find((c) => c.role === 'detective') ?? config.characters[0]!).id;
}

/** Le meurtre de l'histoire, ou null si la prémisse n'est pas respectée. */
export function murderOf(paths: Paths, victim: CharacterId): Meeting | null {
  const meetings = teteATetes(paths, victim);
  return meetings.length === 1 && MURDER_STEPS.includes(meetings[0]!.step) ? meetings[0]! : null;
}

const key = (m: Meeting) => `${m.culprit}@${m.room}@${m.step}`;

export const teteATete: Mode = {
  id: 'tete',
  name: 'Tête-à-tête mortel',
  intro: [
    'Le Détective a été empoisonné au cours de la soirée, entre l’étape 3 et l’étape 6.',
    'Le coupable était seul avec lui — c’est le seul moment de la soirée où le Détective a été seul avec quelqu’un.',
    'Le poison agit lentement : le Détective continue de se déplacer jusqu’à la fin.',
  ],
  question: 'Trouvez QUI, OÙ et à quelle ÉTAPE.',
  build(map, config) {
    const story = generateStory(map, config);
    const victim = detectiveOf(config);
    const murder = murderOf(story.paths, victim);
    if (!murder) return null;
    return {
      story,
      answerKey: key(murder),
      answerText: `${nameOf(config, murder.culprit)} (${murder.culprit}) a empoisonné le Détective — ${map.rooms.find((r) => r.id === murder.room)!.name}, étape ${murder.step + 1}.`,
      highlights: [{ room: murder.room, step: murder.step, kind: 'answer' }],
      facts: [],
      // La case du meurtre ne doit pas révéler le Détective (« 2 présents dont le Détective » = la réponse).
      rules: { stepCharacter: (room, step, c) => room === murder.room && step === murder.step && c === victim },
      answerOf: (paths) => {
        const m = murderOf(paths, victim);
        return m ? key(m) : null;
      },
    };
  },
};
