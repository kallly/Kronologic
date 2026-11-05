/** Générateur pseudo-aléatoire à graine : même graine ⇒ même partie. */
export interface Rng {
  /** Flottant dans [0, 1). */
  next(): number;
  /** Entier dans [0, max). */
  int(max: number): number;
  pick<T>(items: readonly T[]): T;
  shuffle<T>(items: readonly T[]): T[];
}

/** Hache une graine texte en entier 32 bits (xmur3). */
function hashSeed(seed: string): number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^= h >>> 16) >>> 0;
}

export function createRng(seed: string | number): Rng {
  let a = hashSeed(String(seed));
  // mulberry32
  const next = (): number => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (max: number): number => Math.floor(next() * max);
  return {
    next,
    int,
    pick<T>(items: readonly T[]): T {
      if (items.length === 0) throw new Error('pick() sur une liste vide');
      return items[int(items.length)] as T;
    },
    shuffle<T>(items: readonly T[]): T[] {
      const out = [...items];
      for (let i = out.length - 1; i > 0; i--) {
        const j = int(i + 1);
        [out[i], out[j]] = [out[j] as T, out[i] as T];
      }
      return out;
    },
  };
}

export function randomSeed(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}
