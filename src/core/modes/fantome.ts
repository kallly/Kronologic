import { buildAdjacency } from '../map';
import { createRng } from '../rng';
import type { Paths } from '../solver';
import type { CharacterId, RoomId } from '../types';
import { nameOf, presentAt, type Mode } from './types';

/**
 * « Le Fantôme » (scénario 2 du jeu original) : un personnage est **seul à chacune des étapes** ; qui est-ce ?
 * Construction dirigée : on trace le Fantôme, puis les autres en évitant sa salle à chaque étape.
 * Garde-fou : à chaque étape, au moins un autre personnage est seul aussi, pour qu'aucune carte
 * « 1 présent : X » ne désigne directement le Fantôme.
 */
export function alonePerStep(paths: Paths, steps: number): CharacterId[][] {
  return Array.from({ length: steps }, (_, s) =>
    Object.entries(paths).filter(([, p]) => presentAt(paths, p[s]!, s).length === 1).map(([id]) => id),
  );
}

export function phantomOf(paths: Paths, steps: number): CharacterId | null {
  const alone = alonePerStep(paths, steps);
  const always = Object.keys(paths).filter((id) => alone.every((ids) => ids.includes(id)));
  return always.length === 1 ? always[0]! : null;
}

export const fantome: Mode = {
  id: 'fantome',
  name: 'Le Fantôme',
  intro: [
    'Un fantôme hante la demeure : l’un des personnages se cache sous son drap.',
    'Le Fantôme est SEUL dans sa salle à chacune des étapes — c’est le seul personnage dans ce cas.',
  ],
  question: 'Trouvez QUI est le Fantôme.',
  build(map, config) {
    const rng = createRng(`${config.seed}:fantome`);
    const adj = buildAdjacency(map);
    const roomIds = map.rooms.map((r) => r.id);
    const phantom = rng.pick(config.characters).id;

    const walk = (avoid?: RoomId[]): RoomId[] | null => {
      const startOptions = roomIds.filter((r) => r !== avoid?.[0]);
      const path: RoomId[] = [rng.pick(startOptions)];
      for (let s = 1; s < config.steps; s++) {
        const options = (adj.get(path[s - 1]!) ?? []).filter((r) => r !== avoid?.[s]);
        if (options.length === 0) return null;
        path.push(rng.pick(options));
      }
      return path;
    };

    const paths: Paths = {};
    const phantomPath = walk();
    if (!phantomPath) return null;
    paths[phantom] = phantomPath;
    for (const c of config.characters) {
      if (c.id === phantom) continue;
      const p = walk(phantomPath);
      if (!p) return null;
      paths[c.id] = p;
    }
    if (phantomOf(paths, config.steps) !== phantom) return null;
    // Garde-fou anti-révélation : un autre personnage seul à chaque étape.
    if (alonePerStep(paths, config.steps).some((ids) => ids.length < 2)) return null;

    const story = { config, map, paths };
    return {
      story,
      answerKey: phantom,
      answerText: `Le Fantôme est ${nameOf(config, phantom)} (${phantom}), seul à chaque étape.`,
      highlights: phantomPath.map((room, step) => ({ room, step, kind: 'answer' as const })),
      facts: [],
      rules: {},
      answerOf: (p) => phantomOf(p, config.steps),
    };
  },
};
