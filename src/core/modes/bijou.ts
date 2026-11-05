import { createRng } from '../rng';
import { generateStory } from '../story';
import type { Paths } from '../solver';
import type { CharacterId, RoomId } from '../types';
import { nameOf, presentAt, type Highlight, type Mode } from './types';

/**
 * « Le Bijou » (scénario 3 du jeu original) : un bijou volé change de main chaque fois que son porteur
 * se retrouve seul avec exactement un autre personnage. Qui le détient à la dernière étape, et où ?
 * ⚠️ Règle de transmission issue d'une seule source (docs/REGLES_KRONOLOGIC.md §8) — hypothèse à valider.
 */
export const MIN_TRANSFERS = 2;

export interface JewelTrail {
  holder: CharacterId;
  room: RoomId;
  transfers: number;
  /** Porteur à chaque étape (après transmission éventuelle). */
  holders: CharacterId[];
}

export function followJewel(paths: Paths, firstHolder: CharacterId, steps: number): JewelTrail {
  let holder = firstHolder;
  let transfers = 0;
  const holders: CharacterId[] = [];
  for (let s = 0; s < steps; s++) {
    const present = presentAt(paths, paths[holder]![s]!, s);
    if (present.length === 2) {
      holder = present.find((id) => id !== holder)!;
      transfers++;
    }
    holders.push(holder);
  }
  return { holder, room: paths[holder]![steps - 1]!, transfers, holders };
}

const key = (t: JewelTrail) => `${t.holder}@${t.room}`;

export const bijou: Mode = {
  id: 'bijou',
  name: 'Le Bijou',
  intro: [
    'Le bijou de la cantatrice a été dérobé et passe de main en main.',
    'Chaque fois que son porteur se retrouve SEUL avec exactement un autre personnage, il le lui remet.',
  ],
  question: 'Trouvez QUI détient le bijou à la dernière étape, et OÙ.',
  build(map, config) {
    const story = generateStory(map, config);
    const first = createRng(`${config.seed}:bijou`).pick(config.characters).id;
    const trail = followJewel(story.paths, first, config.steps);
    if (trail.transfers < MIN_TRANSFERS) return null;
    const last = config.steps - 1;
    // Le porteur final seul à la dernière étape serait révélé directement par sa carte : on écarte.
    if (presentAt(story.paths, trail.room, last).length < 2) return null;

    const highlights: Highlight[] = trail.holders.map((h, s) => ({
      room: story.paths[h]![s]!,
      step: s,
      kind: s === last ? 'answer' : 'trail',
    }));
    return {
      story,
      answerKey: key(trail),
      answerText: `${nameOf(config, trail.holder)} (${trail.holder}) détient le bijou — ${map.rooms.find((r) => r.id === trail.room)!.name}, étape ${config.steps} (${trail.transfers} transmissions).`,
      highlights,
      facts: [`Au début de la soirée, le bijou est entre les mains de : ${nameOf(config, first)} (${first}).`],
      rules: { stepCharacter: (room, step, c) => room === trail.room && step === last && c === trail.holder },
      answerOf: (p) => key(followJewel(p, first, config.steps)),
    };
  },
};
