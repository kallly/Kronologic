import { createRng } from './rng';
import type { CharacterId, RoomStory, Story } from './types';

/**
 * Calcule l'« histoire » de chaque salle = contenu de sa carte (docs/REGLES_KRONOLOGIC.md §5) :
 * - par étape : nombre de présents (partagé) + un personnage présent (privé) ;
 * - par personnage : nombre de passages (partagé) + une étape de passage (privé).
 * Quand plusieurs réponses privées sont possibles, l'une est tirée depuis la graine
 * (la règle de choix du jeu original n'est pas documentée publiquement).
 */
export function buildRoomStories(story: Story): RoomStory[] {
  const rng = createRng(`${story.config.seed}:reveal`);
  const { steps, characters } = story.config;

  return story.map.rooms.map((room) => {
    const present: CharacterId[][] = Array.from({ length: steps }, () => []);
    const info: RoomStory['characters'] = {};

    for (const character of characters) {
      const stepsHere: number[] = [];
      (story.paths[character.id] ?? []).forEach((roomId, step) => {
        if (roomId === room.id) {
          stepsHere.push(step);
          present[step]!.push(character.id);
        }
      });
      info[character.id] = {
        visits: stepsHere.length,
        revealedStep: stepsHere.length ? rng.pick(stepsHere) : null,
      };
    }
    return {
      roomId: room.id,
      steps: present.map((ids) => ({
        count: ids.length,
        revealedCharacter: ids.length ? rng.pick(ids) : null,
      })),
      characters: info,
    };
  });
}
