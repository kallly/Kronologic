import { n } from './svg';

/** Flèche « rejouer » (case privée vide : personne / jamais passé). */
export function replayIcon(cx: number, cy: number, r: number, color = 'currentColor'): string {
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
export function cornerMarker(x: number, y: number, size: number, color = 'currentColor'): string {
  return `<path d="M ${n(x)} ${n(y)} h ${n(size)} L ${n(x)} ${n(y + size)} Z" fill="${color}"/>`;
}

/**
 * Logo de salle : une forme simple par salle (selon son rang dans le plan), reprise sur tous
 * les plans et sur la ligne de comptage de la feuille de notes pour relier case ↔ salle.
 */
export function roomGlyph(index: number, cx: number, cy: number, size: number, color = 'currentColor'): string {
  const r = size / 2;
  const sw = Math.max(0.2, size * 0.12);
  const style = `fill="none" stroke="${color}" stroke-width="${n(sw)}" stroke-linejoin="round"`;
  const poly = (pts: [number, number][]) => `<polygon points="${pts.map(([x, y]) => `${n(cx + x * r)},${n(cy + y * r)}`).join(' ')}" ${style}/>`;
  const star = (k: number, inner: number): [number, number][] =>
    Array.from({ length: k * 2 }, (_, i) => {
      const a = -Math.PI / 2 + (i * Math.PI) / k;
      const rr = i % 2 ? inner : 1;
      return [Math.cos(a) * rr, Math.sin(a) * rr];
    });
  switch (index % 8) {
    case 0: return `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r * 0.9)}" ${style}/>`;
    case 1: return poly([[-0.8, -0.8], [0.8, -0.8], [0.8, 0.8], [-0.8, 0.8]]);
    case 2: return poly([[0, -0.95], [0.9, 0.75], [-0.9, 0.75]]);
    case 3: return poly([[0, -1], [0.85, 0], [0, 1], [-0.85, 0]]);
    case 4: return poly(star(5, 0.45));
    case 5: return poly(Array.from({ length: 6 }, (_, i) => [Math.cos((i * Math.PI) / 3), Math.sin((i * Math.PI) / 3)] as [number, number]));
    case 6: return poly([[-0.3, -0.9], [0.3, -0.9], [0.3, -0.3], [0.9, -0.3], [0.9, 0.3], [0.3, 0.3], [0.3, 0.9], [-0.3, 0.9], [-0.3, 0.3], [-0.9, 0.3], [-0.9, -0.3], [-0.3, -0.3]]);
    default: return poly([[0, 0.95], [0.9, -0.75], [-0.9, -0.75]]);
  }
}
