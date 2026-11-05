import type { GameMap } from '../core/types';

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

/** Rendu SVG vectoriel du plan : salles + passages. */
export function renderMapSvg(map: GameMap, opts: { labels?: boolean } = {}): string {
  const { labels = true } = opts;
  const byId = new Map(map.rooms.map((r) => [r.id, r]));
  const rooms = map.rooms
    .map(
      (r) => `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="#fff" stroke="#111" stroke-width="2"/>` +
        (labels
          ? `<text x="${r.x + r.w / 2}" y="${r.y + 14}" text-anchor="middle" font-size="10">${esc(r.name)}</text>`
          : ''),
    )
    .join('');
  // Passage = petit rectangle noir centré sur le mur commun.
  const doors = map.doors
    .map(([a, b]) => {
      const ra = byId.get(a)!;
      const rb = byId.get(b)!;
      const cx = (Math.max(ra.x, rb.x) + Math.min(ra.x + ra.w, rb.x + rb.w)) / 2;
      const cy = (Math.max(ra.y, rb.y) + Math.min(ra.y + ra.h, rb.y + rb.h)) / 2;
      const vertical = ra.x + ra.w === rb.x || rb.x + rb.w === ra.x;
      const [w, h] = vertical ? [6, 20] : [20, 6];
      return `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" fill="#111"/>`;
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 ${map.width + 8} ${map.height + 8}" width="100%">${rooms}${doors}</svg>`;
}
