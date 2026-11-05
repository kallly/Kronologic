import { describe, expect, it } from 'vitest';
import { createRng } from '../src/core/rng';
import { parseMap, validateMap } from '../src/core/map';
import { generateStory, isValidPath } from '../src/core/story';
import { buildRoomStories } from '../src/core/roomStory';
import { maps, defaultCharacters } from '../src/maps';
import type { GameMap, StoryConfig } from '../src/core/types';

const config = (seed: string, extra: Partial<StoryConfig> = {}): StoryConfig => ({
  seed,
  steps: 6,
  characters: defaultCharacters,
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

  it('déplace vers une salle adjacente, jamais deux étapes de suite au même endroit', () => {
    for (let i = 0; i < 50; i++) {
      const story = generateStory(map, config(`s${i}`));
      for (const path of Object.values(story.paths)) {
        expect(path).toHaveLength(6);
        expect(isValidPath(map, path)).toBe(true);
        path.slice(1).forEach((r, k) => expect(r).not.toBe(path[k]));
      }
    }
  });

  it('applique les positions de départ de la partie', () => {
    const startPositions = Object.fromEntries(defaultCharacters.map((c, i) => [c.id, map.rooms[i % map.rooms.length]!.id]));
    const story = generateStory(map, config('S', { startPositions }));
    for (const c of defaultCharacters) expect(story.paths[c.id]![0]).toBe(startPositions[c.id]);
  });

  it('rejette une salle de départ inconnue', () => {
    expect(() => generateStory(map, config('S', { startPositions: { A: 'nulle-part' } }))).toThrow();
  });

  it('produit des cartes de salle cohérentes', () => {
    const story = generateStory(map, config('CARDS', { steps: 9 }));
    const rooms = buildRoomStories(story);
    for (let step = 0; step < 9; step++) {
      expect(rooms.reduce((s, r) => s + r.steps[step]!.count, 0)).toBe(defaultCharacters.length);
      for (const r of rooms) {
        const { count, revealedCharacter } = r.steps[step]!;
        if (count === 0) expect(revealedCharacter).toBeNull();
        else expect(story.paths[revealedCharacter!]![step]).toBe(r.roomId);
      }
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

describe('portes et murs', () => {
  const musee = maps.find((m) => m.id === 'musee')!;

  it('ne traverse jamais un mur sans porte', () => {
    for (let i = 0; i < 100; i++) {
      const story = generateStory(musee, config(`m${i}`));
      for (const path of Object.values(story.paths)) {
        path.slice(1).forEach((room, k) => {
          const pair = [path[k], room].sort().join('|');
          expect(pair).not.toBe(['cabinet', 'statues'].sort().join('|'));
          expect(pair).not.toBe(['observatoire', 'reserve'].sort().join('|'));
        });
      }
    }
  });

  it('refuse une porte entre deux salles non contiguës (pas de saut)', () => {
    const bad: GameMap = { ...musee, doors: [...musee.doors, ['egypte', 'reserve']] };
    expect(validateMap(bad).join()).toContain('non contiguës');
  });
});

describe('import de plan', () => {
  it('accepte un plan valide et rejette un plan mal formé', () => {
    expect(parseMap(JSON.parse(JSON.stringify(maps[1])))).toEqual(maps[1]);
    expect(() => parseMap({ id: 'x', name: 'x', width: 1, height: 1, rooms: [{ id: 'a' }], doors: [] })).toThrow('Salle mal formée');
  });
});
