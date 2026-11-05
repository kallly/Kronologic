import type { GameMap, RoomId } from '../core/types';
import { esc, n, text } from './svg';

export interface MapDrawOptions {
  /** Afficher le nom des salles. */
  labels?: boolean;
  labelSize?: number;
  /** Salle à mettre en évidence. */
  highlight?: RoomId;
  /** Contenu supplémentaire par salle (reçoit la boîte de la salle en mm). */
  roomExtra?: (room: { id: RoomId; x: number; y: number; w: number; h: number }) => string;
  stroke?: number;
  roomFill?: string;
  highlightFill?: string;
}

/** Dessine le plan dans la boîte (x, y, width), hauteur proportionnelle. Retourne le SVG et la hauteur. */
export function drawMap(map: GameMap, x: number, y: number, width: number, opts: MapDrawOptions = {}): { svg: string; height: number } {
  const { labels = true, labelSize = 3, highlight, roomExtra, stroke = 0.5, roomFill = '#fff', highlightFill = '#d9d9d9' } = opts;
  const k = width / map.width;
  const height = map.height * k;
  const byId = new Map(map.rooms.map((r) => [r.id, r]));
  const parts: string[] = [];

  for (const r of map.rooms) {
    const box = { id: r.id, x: x + r.x * k, y: y + r.y * k, w: r.w * k, h: r.h * k };
    parts.push(
      `<rect x="${n(box.x)}" y="${n(box.y)}" width="${n(box.w)}" height="${n(box.h)}" fill="${r.id === highlight ? highlightFill : roomFill}" stroke="currentColor" stroke-width="${stroke}"/>`,
    );
    if (labels) parts.push(text(box.x + box.w / 2, box.y + labelSize * 0.9, r.name, { size: labelSize }));
    if (roomExtra) parts.push(roomExtra(box));
  }
  // Passage (porte) : petit bloc à cheval sur le mur commun. Un mur sans porte ne se traverse pas.
  for (const [a, b] of map.doors) {
    const ra = byId.get(a)!;
    const rb = byId.get(b)!;
    const cx = (Math.max(ra.x, rb.x) + Math.min(ra.x + ra.w, rb.x + rb.w)) / 2;
    const cy = (Math.max(ra.y, rb.y) + Math.min(ra.y + ra.h, rb.y + rb.h)) / 2;
    const vertical = ra.x + ra.w === rb.x || rb.x + rb.w === ra.x;
    const [dw, dh] = vertical ? [stroke * 4, width * 0.09] : [width * 0.09, stroke * 4];
    parts.push(`<rect x="${n(x + cx * k - dw / 2)}" y="${n(y + cy * k - dh / 2)}" width="${n(dw)}" height="${n(dh)}" fill="currentColor"/>`);
  }
  return { svg: parts.join(''), height };
}

/** Plan seul, en SVG autonome (aperçu écran). */
export function renderMapSvg(map: GameMap): string {
  const { svg, height } = drawMap(map, 2, 2, 100, { labelSize: 4 });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 104 ${n(height + 4)}" width="100%"><title>${esc(map.name)}</title>${svg}</svg>`;
}
