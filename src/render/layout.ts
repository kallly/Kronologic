/**
 * Gabarit unique partagé par les cartes de salle et les caches.
 * Les fenêtres des caches sont calculées depuis les mêmes cases que la carte :
 * l'alignement est garanti quel que soit le nombre d'étapes / de personnages.
 */

export const CARD_W = 60;
export const CARD_H = 85;
/** Marge de sécurité des fenêtres par rapport aux cases (tolérance de découpe). */
export const WINDOW_INSET = 0.6;

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Une colonne = case partagée (haut) + case privée (bas). */
export interface Column {
  head: Box;
  shared: Box;
  private: Box;
}

export interface CardLayout {
  title: Box;
  stepsLabelY: number;
  steps: Column[];
  charactersLabelY: number;
  characters: Column[];
  footerY: number;
}

const MARGIN_X = 4;
const HEAD_H = 4.5;
const CELL_H = 8;

function columns(count: number, top: number): Column[] {
  const usable = CARD_W - 2 * MARGIN_X;
  const w = Math.min(9, usable / count);
  const x0 = (CARD_W - w * count) / 2;
  return Array.from({ length: count }, (_, i) => {
    const x = x0 + i * w;
    return {
      head: { x, y: top, w, h: HEAD_H },
      shared: { x, y: top + HEAD_H, w, h: CELL_H },
      private: { x, y: top + HEAD_H + CELL_H, w, h: CELL_H },
    };
  });
}

export function cardLayout(steps: number, characters: number): CardLayout {
  return {
    title: { x: 9, y: 2.5, w: CARD_W - 18, h: 9 },
    stepsLabelY: 16,
    steps: columns(steps, 18.5),
    charactersLabelY: 44,
    characters: columns(characters, 46.5),
    footerY: CARD_H - 4,
  };
}

/** Fenêtre à évider dans un cache pour révéler une colonne (partagé + privé). */
export function columnWindow(col: Column): Box {
  return {
    x: col.shared.x + WINDOW_INSET,
    y: col.shared.y + WINDOW_INSET,
    w: col.shared.w - 2 * WINDOW_INSET,
    h: col.shared.h + col.private.h - 2 * WINDOW_INSET,
  };
}

/** Zone d'étiquette opaque du cache (sous les deux blocs de cases). */
export const MASK_LABEL: Box = { x: 6, y: CARD_H - 16, w: CARD_W - 12, h: 13 };

/** Fenêtre qui laisse voir le nom de la salle. */
export function titleWindow(layout: CardLayout): Box {
  const t = layout.title;
  return { x: t.x + WINDOW_INSET, y: t.y + WINDOW_INSET, w: t.w - 2 * WINDOW_INSET, h: t.h - 2 * WINDOW_INSET };
}
