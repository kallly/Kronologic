import { describe, expect, it } from 'vitest';
import { createRng } from '../src/core/rng';
import { validateMap } from '../src/core/map';
import { generateStory, isValidPath } from '../src/core/story';
import { buildRoomStories } from '../src/core/roomStory';
import { maps, defaultCharacters } from '../src/maps';
import type { GameMap, StoryConfig } from '../src/core/types';

const config = (seed: string, extra: Partial<StoryConfig> = {}): StoryConfig => ({
  seed,
  steps: 6,
  characters: defaultCharacters,
  allowStay: false,
  ...extra,
});

describe('rng', () => {
  it('est déterministe pour une même graine', () => {
    const a = createRng('ABC');
    const b = createRng('ABC');
    expect(Array.from({ length: 5 }, () => a.next())).toEqual(Array.from({ length: 5 }, () => b.next()));
  });
  it('diffère selon la graine', () => {
    expect(createRng('ABC').next()).not.toEqual(createRng('ABD').next());
  });
});

describe('plans', () => {
  it.each(maps.map((m) => [m.id, m] as const))('%s est valide', (_, map) => {
    expect(validateMap(map)).toEqual([]);
  });
  it('détecte une salle inaccessible et une porte inconnue', () => {
    const bad: GameMap = {
      id: 'bad', name: 'bad', width: 1, height: 1,
      rooms: [
        { id: 'a', name: 'a', x: 0, y: 0, w: 1, h: 1 },
        { id: 'b', name: 'b', x: 0, y: 0, w: 1, h: 1 },
      ],
      doors: [['a', 'z']],
    };
    expect(validateMap(bad).join()).toContain('inconnue');
  });
});

describe('génération des histoires', () => {
  const map = maps[0]!;

  it('est reproductible', () => {
    expect(generateStory(map, config('X1')).paths).toEqual(generateStory(map, config('X1')).paths);
  });

  it.each([false, true])('respecte les déplacements (allowStay=%s)', (allowStay) => {
    for (let i = 0; i < 50; i++) {
      const story = generateStory(map, config(`s${i}`, { allowStay }));
      for (const path of Object.values(story.paths)) {
        expect(path).toHaveLength(6);
        expect(isValidPath(map, path, allowStay)).toBe(true);
        if (!allowStay) path.slice(1).forEach((r, k) => expect(r).not.toBe(path[k]));
      }
    }
  });

  it('applique la salle de départ commune', () => {
    const story = generateStory(map, config('S', { startRoom: 'hall' }));
    for (const path of Object.values(story.paths)) expect(path[0]).toBe('hall');
  });

  it('produit des cartes de salle cohérentes', () => {
    const story = generateStory(map, config('CARDS', { steps: 9 }));
    const rooms = buildRoomStories(story);
    for (let step = 0; step < 9; step++) {
      expect(rooms.reduce((s, r) => s + r.presenceByStep[step]!, 0)).toBe(defaultCharacters.length);
    }
    for (const c of defaultCharacters) {
      expect(rooms.reduce((s, r) => s + r.characters[c.id]!.visits, 0)).toBe(9);
      for (const r of rooms) {
        const info = r.characters[c.id]!;
        if (info.visits === 0) expect(info.revealedStep).toBeNull();
        else expect(story.paths[c.id]![info.revealedStep!]).toBe(r.roomId);
      }
    }
  });
});
