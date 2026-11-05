import { PAGE_H, PAGE_W, n } from './svg';

export interface GridPlacement {
  cols: number;
  rows: number;
  x0: number;
  y0: number;
  itemW: number;
  itemH: number;
  /** Coin haut-gauche de l'élément i. */
  at(i: number): { x: number; y: number };
}

/** Place des éléments jointifs (bords communs = une seule coupe), centrés sur la page. */
export function gridPlacement(itemW: number, itemH: number, minMargin = 5): GridPlacement {
  const cols = Math.floor((PAGE_W - 2 * minMargin) / itemW);
  const rows = Math.floor((PAGE_H - 2 * minMargin) / itemH);
  const x0 = (PAGE_W - cols * itemW) / 2;
  const y0 = (PAGE_H - rows * itemH) / 2;
  return {
    cols, rows, x0, y0, itemW, itemH,
    at: (i) => ({ x: x0 + (i % cols) * itemW, y: y0 + Math.floor(i / cols) * itemH }),
  };
}

/** Traits de coupe dans les marges, dans le prolongement de chaque bord. */
export function cutMarks(g: GridPlacement, usedRows = g.rows, usedCols = g.cols): string {
  const gap = 1;
  const len = Math.min(4, g.x0 - gap, g.y0 - gap);
  const right = g.x0 + usedCols * g.itemW;
  const bottom = g.y0 + usedRows * g.itemH;
  const lines: string[] = [];
  for (let c = 0; c <= usedCols; c++) {
    const x = g.x0 + c * g.itemW;
    lines.push(`M ${n(x)} ${n(g.y0 - gap - len)} V ${n(g.y0 - gap)}`, `M ${n(x)} ${n(bottom + gap)} V ${n(bottom + gap + len)}`);
  }
  for (let r = 0; r <= usedRows; r++) {
    const y = g.y0 + r * g.itemH;
    lines.push(`M ${n(g.x0 - gap - len)} ${n(y)} H ${n(g.x0 - gap)}`, `M ${n(right + gap)} ${n(y)} H ${n(right + gap + len)}`);
  }
  return `<path d="${lines.join(' ')}" stroke="#000" stroke-width="0.2" fill="none"/>`;
}
