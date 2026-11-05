import { describe, expect, it } from 'vitest';
import { generateMurderStory, teteATetes } from '../src/core/scenario';
import { maps, defaultCharacters } from '../src/maps';

describe('scénario Tête-à-tête mortel', () => {
  it.each(maps.map((m) => [m.id, m] as const))('produit un meurtre unique et cohérent sur %s', (_, map) => {
    for (let i = 1; i <= 30; i++) {
      const { story, murder } = generateMurderStory(map, { seed: `${map.id}#${i}`, steps: 6, characters: defaultCharacters });
      expect(teteATetes(story, murder.victim)).toHaveLength(1);
      const present = Object.entries(story.paths).filter(([, p]) => p[murder.step] === murder.room).map(([id]) => id);
      expect(present.sort()).toEqual([murder.victim, murder.culprit].sort());
    }
  });

  it('la victime est toujours le détective', () => {
    const { murder } = generateMurderStory(maps[0]!, { seed: 'x', steps: 6, characters: defaultCharacters });
    expect(defaultCharacters.find((c) => c.id === murder.victim)!.role).toBe('detective');
  });

  it('est reproductible', () => {
    const cfg = { seed: 'manoir#7', steps: 6, characters: defaultCharacters };
    expect(generateMurderStory(maps[0]!, cfg)).toEqual(generateMurderStory(maps[0]!, cfg));
  });
});
