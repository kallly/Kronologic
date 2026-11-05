import type { Theme } from './themes';

/** Utilitaires SVG. Toutes les coordonnées des supports sont en **millimètres**. */

export const PAGE_W = 190; // A4 moins 2 × 10 mm de marge
export const PAGE_H = 277;

export const esc = (s: string): string => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

export const n = (v: number): string => String(Math.round(v * 100) / 100);

export function text(
  x: number,
  y: number,
  content: string,
  opts: { size?: number; anchor?: 'start' | 'middle' | 'end'; weight?: string; fill?: string; extra?: string } = {},
): string {
  const { size = 3, anchor = 'middle', weight = 'normal', fill = 'currentColor', extra = '' } = opts;
  return `<text x="${n(x)}" y="${n(y)}" font-size="${size}" text-anchor="${anchor}" dominant-baseline="central" font-weight="${weight}" fill="${fill}" ${extra}>${esc(content)}</text>`;
}

export function rect(x: number, y: number, w: number, h: number, attrs = ''): string {
  return `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" ${attrs}/>`;
}

/** Une page A4 = une <section class="sheet"> contenant un SVG en mm, habillé par le thème. */
export function sheet(theme: Theme, content: string, footer = ''): string {
  return `<section class="sheet"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${PAGE_W} ${PAGE_H}" width="${PAGE_W}mm" height="${PAGE_H}mm" font-family="${esc(theme.font)}" color="${theme.ink}"><defs>${theme.defs}</defs>${content}${
    footer ? text(PAGE_W, PAGE_H - 1, footer, { size: 2.2, anchor: 'end', fill: theme.muted }) : ''
  }</svg></section>`;
}

export function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}
