import { n } from './svg';

/** Flèche « rejouer » (case privée vide : personne / jamais passé). */
export function replayIcon(cx: number, cy: number, r: number, color = '#111'): string {
  const sw = r * 0.28;
  // Arc de cercle ouvert en haut à droite + pointe de flèche.
  const a0 = -60 * (Math.PI / 180);
  const a1 = 240 * (Math.PI / 180);
  const p = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  const head = r * 0.75;
  return `<g fill="none" stroke="${color}" stroke-width="${n(sw)}" stroke-linecap="round">
    <path d="M ${n(x1)} ${n(y1)} A ${n(r)} ${n(r)} 0 1 0 ${n(x0)} ${n(y0)}"/>
  </g>
  <path d="M ${n(x0 + head * 0.15)} ${n(y0 - head * 0.85)} L ${n(x0 + head * 0.55)} ${n(y0 + head * 0.25)} L ${n(x0 - head * 0.6)} ${n(y0 + head * 0.05)} Z" fill="${color}"/>`;
}

/** Repère d'alignement : triangle plein dans le coin haut-gauche (carte ET cache). */
export function cornerMarker(x: number, y: number, size: number, color = '#111'): string {
  return `<path d="M ${n(x)} ${n(y)} h ${n(size)} L ${n(x)} ${n(y + size)} Z" fill="${color}"/>`;
}
