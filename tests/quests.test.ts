import { describe, expect, it } from 'vitest';
import { alonePerStep, phantomOf } from '../src/core/modes/fantome';
import { followJewel, MIN_TRANSFERS } from '../src/core/modes/bijou';
import { MURDER_STEPS, detectiveOf, murderOf } from '../src/core/modes/teteATete';
import { LEVELS, KNOWN_STARTS, generateQuest, parseQuestList, formatQuestList, type QuestRef } from '../src/core/quests';
import { isValidPath } from '../src/core/story';
import { solve } from '../src/core/solver';
import { maps, defaultCharacters } from '../src/maps';

const ids = defaultCharacters.map((c) => c.id);
const all: QuestRef[] = (['tete', 'fantome', 'bijou'] as const).flatMap((mode) => LEVELS.map((level) => ({ mode, level })));

describe.each(maps.map((m) => [m.id, m] as const))('15 quêtes sur %s', (_, map) => {
  const quests = all.map((ref) => generateQuest(map, defaultCharacters, ref));

  it('génère les 15 quêtes avec des trajets valides', () => {
    expect(quests).toHaveLength(15);
    for (const q of quests) for (const p of Object.values(q.story.paths)) expect(isValidPath(map, p)).toBe(true);
  });

  it('est reproductible', () => {
    expect(generateQuest(map, defaultCharacters, all[7]!).story.paths).toEqual(quests[7]!.story.paths);
  });

  it('a des positions de départ révélées selon le niveau', () => {
    for (const q of quests) expect(Object.keys(q.knownStarts)).toHaveLength(KNOWN_STARTS[q.level]);
  });

  it('Tête-à-tête : meurtre étapes 3-6, la case du meurtre ne révèle jamais le Détective', () => {
    for (const q of quests.filter((x) => x.mode === 'tete')) {
      const victim = detectiveOf(q.story.config);
      const m = murderOf(q.story.paths, victim)!;
      expect(MURDER_STEPS).toContain(m.step);
      for (const r of q.rooms) r.steps.forEach((s) => {
        if (s.count === 2 && s.revealedCharacter === victim) throw new Error(`révélation directe : ${r.roomId} étape ${s}`);
      });
    }
  });

  it('Fantôme : un seul personnage seul à chaque étape, jamais seul personnage seul', () => {
    for (const q of quests.filter((x) => x.mode === 'fantome')) {
      expect(phantomOf(q.story.paths, 6)).not.toBeNull();
      for (const alone of alonePerStep(q.story.paths, 6)) expect(alone.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('Bijou : porteur final jamais révélé par la carte de sa salle à la dernière étape', () => {
    for (const q of quests.filter((x) => x.mode === 'bijou')) {
      const final = q.highlights.find((h) => h.kind === 'answer')!;
      const holder = q.answerText.match(/\((\w)\)/)![1]!;
      const cell = q.rooms.find((r) => r.roomId === final.room)!.steps[5]!;
      expect(cell.count).toBeGreaterThanOrEqual(2);
      expect(cell.revealedCharacter).not.toBe(holder);
    }
  });
});

describe('solveur', () => {
  // Deux salles reliées, deux personnages, deux étapes : X et Y s'échangent (a→b et b→a).
  const tiny = {
    id: 'tiny', name: 'tiny', width: 2, height: 1,
    rooms: [{ id: 'a', name: 'A', x: 0, y: 0, w: 1, h: 1 }, { id: 'b', name: 'B', x: 1, y: 0, w: 1, h: 1 }],
    doors: [['a', 'b']] as [string, string][],
  };
  const whereIsX = (p: Record<string, string[]>) => p.X![0]!;
  const cards = (revealXAtStep1In: string | null) =>
    ['a', 'b'].map((roomId) => ({
      roomId,
      steps: [0, 1].map((s) => ({ count: 1, revealedCharacter: s === 0 && roomId === revealXAtStep1In ? 'X' : null })),
      characters: { X: { visits: 1, revealedStep: null }, Y: { visits: 1, revealedStep: null } },
    }));

  it("trouve plusieurs réponses quand l'information manque", () => {
    const res = solve({ map: tiny, characters: ['X', 'Y'], steps: 2, rooms: cards(null) }, whereIsX);
    expect([...res.answers].sort()).toEqual(['a', 'b']);
  });

  it("tranche dès qu'une révélation privée lève l'ambiguïté", () => {
    const res = solve({ map: tiny, characters: ['X', 'Y'], steps: 2, rooms: cards('a') }, whereIsX);
    expect([...res.answers]).toEqual(['a']);
  });
});

describe('liste de quêtes', () => {
  it('lit et écrit le paramètre d\'URL', () => {
    const refs = parseQuestList('tete:1-5,fantome:2,bijou:1-2');
    expect(refs).toHaveLength(8);
    expect(parseQuestList(formatQuestList(refs))).toEqual(refs);
  });
  it('Bijou : transmissions cohérentes', () => {
    const q = generateQuest(maps[0]!, defaultCharacters, { mode: 'bijou', level: 2 });
    expect(q.facts[0]).toContain('bijou');
    const first = q.facts[0]!.match(/\((\w)\)/)![1]!;
    expect(followJewel(q.story.paths, first, 6).transfers).toBeGreaterThanOrEqual(MIN_TRANSFERS);
  });
});
