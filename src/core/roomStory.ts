import { createRng } from './rng';
import type { RoomStory, Story } from './types';

/**
 * Calcule l'« histoire » de chaque salle, c.-à-d. le contenu de sa carte :
 * - public : nombre de personnages présents à chaque étape ;
 * - privé, par personnage : nombre de passages + une étape exacte où il y était.
 */
export function buildRoomStories(story: Story): RoomStory[] {
  // Tirage indépendant de celui des trajets, mais toujours dérivé de la graine.
  const rng = createRng(`${story.config.seed}:reveal`);
  const { steps, characters } = story.config;

  return story.map.rooms.map((room) => {
    const presenceByStep = Array.from({ length: steps }, () => 0);
    const info: RoomStory['characters'] = {};

    for (const character of characters) {
      const path = story.paths[character.id] ?? [];
      const stepsHere: number[] = [];
      path.forEach((roomId, step) => {
        if (roomId === room.id) {
          stepsHere.push(step);
          presenceByStep[step]!++;
        }
      });
      info[character.id] = {
        visits: stepsHere.length,
        revealedStep: stepsHere.length ? rng.pick(stepsHere) : null,
      };
    }
    return { roomId: room.id, presenceByStep, characters: info };
  });
}
