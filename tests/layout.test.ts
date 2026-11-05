import { describe, expect, it } from 'vitest';
import { CARD_H, CARD_W, MASK_LABEL, cardLayout, columnWindow, titleWindow, type Box } from '../src/render/layout';

const inside = (inner: Box, outer: Box) =>
  inner.x >= outer.x && inner.y >= outer.y && inner.x + inner.w <= outer.x + outer.w && inner.y + inner.h <= outer.y + outer.h;
const overlaps = (a: Box, b: Box) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
const card: Box = { x: 0, y: 0, w: CARD_W, h: CARD_H };

describe('gabarit carte / caches', () => {
  it.each([[6, 6], [8, 6], [6, 7]])('aligne chaque fenêtre sur sa colonne (%i étapes, %i personnages)', (steps, chars) => {
    const L = cardLayout(steps, chars);
    const cols = [...L.steps, ...L.characters];
    for (const col of cols) {
      const w = columnWindow(col);
      const cellArea: Box = { x: col.shared.x, y: col.shared.y, w: col.shared.w, h: col.shared.h + col.private.h };
      expect(inside(w, cellArea)).toBe(true);
      expect(inside(w, card)).toBe(true);
      expect(overlaps(w, MASK_LABEL)).toBe(false);
      // une fenêtre ne doit rien révéler des autres colonnes
      for (const other of cols) if (other !== col) {
        expect(overlaps(w, { ...other.shared, h: other.shared.h + other.private.h })).toBe(false);
      }
    }
    expect(overlaps(titleWindow(L), MASK_LABEL)).toBe(false);
    expect(inside(MASK_LABEL, card)).toBe(true);
  });
});
