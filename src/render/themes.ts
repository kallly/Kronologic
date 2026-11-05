/**
 * Thèmes graphiques des supports. Le contenu (cases, fenêtres, positions) ne change jamais :
 * seul l'habillage varie, donc les caches d'un thème restent compatibles avec les cartes de l'autre.
 */
export interface Theme {
  id: 'style' | 'minimal';
  name: string;
  font: string;
  titleFont: string;
  ink: string;
  muted: string;
  /** Accent décoratif (cadres, filets). */
  accent: string;
  /** Fond des cartes (recto et verso). */
  cardFill: string;
  /** Fond des cases d'information partagée. */
  sharedFill: string;
  /** Remplissage opaque des caches. */
  maskFill: string;
  maskLabelFill: string;
  roomFill: string;
  highlightFill: string;
  /** Pastilles personnage : pleines (couleur) ou au trait. */
  badge: 'filled' | 'outline';
  /** Cadre décoratif autour d'une carte / d'un cache. */
  decorated: boolean;
  /** Définitions SVG (motifs) injectées dans chaque page. */
  defs: string;
}

export const stylish: Theme = {
  id: 'style',
  name: 'Stylisé',
  font: "Georgia, 'Times New Roman', serif",
  titleFont: "Georgia, 'Times New Roman', serif",
  ink: '#2b2118',
  muted: '#7a6a55',
  accent: '#a8812f',
  cardFill: '#f7f0e1',
  sharedFill: '#cfe0c3',
  maskFill: 'url(#mask-deco)',
  maskLabelFill: '#f7f0e1',
  roomFill: '#fbf7ee',
  highlightFill: '#e3cf9f',
  badge: 'filled',
  decorated: true,
  defs: `<pattern id="mask-deco" width="6" height="6" patternUnits="userSpaceOnUse">
      <rect width="6" height="6" fill="#2b2118"/>
      <path d="M3 0.6 L5.4 3 L3 5.4 L0.6 3 Z" fill="none" stroke="#a8812f" stroke-width="0.25"/>
    </pattern>
    <pattern id="shared-dots" width="2" height="2" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="0.18" fill="#888"/>
    </pattern>
    <pattern id="room-hatch" width="2" height="2" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="2" stroke="#a8812f" stroke-width="0.3"/>
    </pattern>`,
};

/** Économie d'encre : aucun aplat, traits fins, caches en hachures légères. */
export const minimal: Theme = {
  id: 'minimal',
  name: 'Minimaliste (économie d\'encre)',
  font: 'system-ui, sans-serif',
  titleFont: 'system-ui, sans-serif',
  ink: '#000',
  muted: '#666',
  accent: '#000',
  cardFill: 'none',
  sharedFill: 'url(#shared-dots)',
  maskFill: 'url(#mask-hatch)',
  maskLabelFill: '#fff',
  roomFill: 'none',
  highlightFill: 'url(#room-hatch)',
  badge: 'outline',
  decorated: false,
  defs: `<pattern id="mask-hatch" width="1.6" height="1.6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="1.6" stroke="#9a9a9a" stroke-width="0.35"/>
    </pattern>
    <pattern id="shared-dots" width="1.6" height="1.6" patternUnits="userSpaceOnUse">
      <circle cx="0.8" cy="0.8" r="0.16" fill="#777"/>
    </pattern>
    <pattern id="room-hatch" width="2" height="2" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="2" stroke="#999" stroke-width="0.3"/>
    </pattern>`,
};

export const themes: Theme[] = [stylish, minimal];
