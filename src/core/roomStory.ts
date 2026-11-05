import { createRng } from './rng';
import type { CharacterId, RoomId, RoomStory, Story } from './types';

/**
 * Révélations privées interdites (pour qu'aucune lecture de carte ne donne seule la réponse).
 * - `stepCharacter(room, step, char)` : le cache Étape ne doit pas montrer `char` dans `room` à `step` ;
 * - `characterStep(room, char, step)` : le cache Personnage ne doit pas montrer `step` pour `char` dans `room`.
 */
export interface RevealRules {
  stepCharacter?: (room: RoomId, step: number, char: CharacterId) => boolean;
  characterStep?: (room: RoomId, char: CharacterId, step: number) => boolean;
}

export interface CheckedRoomStories {
  rooms: RoomStory[];
  /** Nombre de cases où toutes les révélations possibles étaient interdites (0 = cartes sûres). */
  unavoidable: number;
}

/**
 * Calcule l'« histoire » de chaque salle = contenu de sa carte (docs/REGLES_KRONOLOGIC.md §5) :
 * - par étape : nombre de présents (partagé) + un personnage présent (privé) ;
 * - par personnage : nombre de passages (partagé) + une étape de passage (privé).
 * Quand plusieurs révélations privées sont possibles, l'une est tirée depuis la graine parmi celles
 * qu'autorisent les `rules` (la règle de choix du jeu original n'est pas documentée publiquement).
 */
export function buildRoomStoriesChecked(story: Story, rules: RevealRules = {}): CheckedRoomStories {
  const rng = createRng(`${story.config.seed}:reveal`);
  const { steps, characters } = story.config;
  let unavoidable = 0;

  const choose = <T>(options: T[], forbidden: (o: T) => boolean): T | null => {
    if (options.length === 0) return null;
    const allowed = options.filter((o) => !forbidden(o));
    if (allowed.length === 0) {
      unavoidable++;
      return rng.pick(options);
    }
    return rng.pick(allowed);
  };

  const rooms = story.map.rooms.map((room) => {
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
        revealedStep: choose(stepsHere, (s) => rules.characterStep?.(room.id, character.id, s) ?? false),
      };
    }
    return {
      roomId: room.id,
      steps: present.map((ids, step) => ({
        count: ids.length,
        revealedCharacter: choose(ids, (c) => rules.stepCharacter?.(room.id, step, c) ?? false),
      })),
      characters: info,
    };
  });
  return { rooms, unavoidable };
}

export function buildRoomStories(story: Story, rules: RevealRules = {}): RoomStory[] {
  return buildRoomStoriesChecked(story, rules).rooms;
}
