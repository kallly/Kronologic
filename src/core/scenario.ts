import { generateStory } from './story';
import type { CharacterId, GameMap, RoomId, Story, StoryConfig } from './types';

/**
 * Scénario « Tête-à-tête mortel » (inspiré de l'objectif documenté du scénario 1 du jeu original :
 * le coupable était seul avec la victime, cf. docs/REGLES_KRONOLOGIC.md §8).
 * - La victime est le **détective**, l'un des 6 personnages (validé par l'utilisateur, qui possède le jeu).
 * - Le meurtre (empoisonnement) a lieu au **seul** moment où la victime se trouve seule avec
 *   exactement un autre personnage : celui-ci est le coupable.
 * - Empoisonnée, la victime continue de se déplacer normalement jusqu'à la fin.
 */
export interface Murder {
  victim: CharacterId;
  culprit: CharacterId;
  room: RoomId;
  /** Index d'étape 0-based. */
  step: number;
}

/** Tous les moments où `victim` est seule avec exactement un autre personnage. */
export function teteATetes(story: Story, victim: CharacterId): Omit<Murder, 'victim'>[] {
  const out: Omit<Murder, 'victim'>[] = [];
  const victimPath = story.paths[victim] ?? [];
  victimPath.forEach((room, step) => {
    const others = Object.entries(story.paths).filter(([id, path]) => id !== victim && path[step] === room);
    if (others.length === 1) out.push({ culprit: others[0]![0], room, step });
  });
  return out;
}

export interface MurderStory {
  story: Story;
  murder: Murder;
  /** Nombre de tirages nécessaires (diagnostic). */
  attempts: number;
}

/** Le détective (victime) ; à défaut de rôle défini, le premier personnage. */
export function detectiveOf(config: StoryConfig): CharacterId {
  return (config.characters.find((c) => c.role === 'detective') ?? config.characters[0]!).id;
}

/**
 * Tire des histoires (déterministes à partir de la graine) jusqu'à en trouver une où le détective
 * a exactement un tête-à-tête : la réponse est alors unique.
 */
export function generateMurderStory(map: GameMap, config: StoryConfig, maxAttempts = 2000): MurderStory {
  const victim = detectiveOf(config);
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const story = generateStory(map, { ...config, seed: attempt === 0 ? config.seed : `${config.seed}/${attempt}` });
    const meetings = teteATetes(story, victim);
    if (meetings.length === 1) return { story, murder: { victim, ...meetings[0]! }, attempts: attempt + 1 };
  }
  throw new Error(`Aucune histoire avec un meurtre unique après ${maxAttempts} essais`);
}
