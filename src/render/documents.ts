import type { Character, GameMap, RoomStory, Story } from '../core/types';
import { cutMarks, gridPlacement } from './cutMarks';
import { cornerMarker, replayIcon } from './icons';
import { CARD_H, CARD_W, MASK_LABEL, cardLayout, columnWindow, titleWindow, type Box, type Column } from './layout';
import { drawMap } from './mapSvg';
import { PAGE_H, PAGE_W, chunk, n, rect, sheet, text } from './svg';

const SHARED_BG = '#cfe8cf'; // fond vert = information partagée
const MASK_FILL = '#8a8a8a';

/** Contexte commun à tous les supports d'un plan (réutilisables d'une partie à l'autre). */
export interface Material {
  map: GameMap;
  characters: Character[];
  steps: number;
}

const roomName = (map: GameMap, id: string) => map.rooms.find((r) => r.id === id)?.name ?? id;

function characterBadge(c: Character, cx: number, cy: number, r: number): string {
  return `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="${c.color}"/>` + text(cx, cy + 0.1, c.symbol, { size: r * 1.3, weight: 'bold', fill: '#fff' });
}

// ---------------------------------------------------------------------------
// 1. Plan seul
// ---------------------------------------------------------------------------
export function mapSheet(m: Material): string {
  const { svg } = drawMap(m.map, 5, 20, PAGE_W - 10, { labelSize: 6, stroke: 1 });
  return sheet(text(PAGE_W / 2, 8, m.map.name, { size: 7, weight: 'bold' }) + svg, m.map.name);
}

// ---------------------------------------------------------------------------
// 2. Cartes de salle (une partie = une carte par salle), pliées en deux
// ---------------------------------------------------------------------------
function cellLabel(col: Column, label: string): string {
  return text(col.head.x + col.head.w / 2, col.head.y + col.head.h / 2, label, { size: 2.4, fill: '#555' });
}

function cardFront(m: Material, rs: RoomStory, questLabel: string, ox: number, oy: number): string {
  const L = cardLayout(m.steps, m.characters.length);
  const p: string[] = [];
  const cell = (b: Box, fill: string) => rect(ox + b.x, oy + b.y, b.w, b.h, `fill="${fill}" stroke="#111" stroke-width="0.25"`);
  const at = (b: Box) => [ox + b.x + b.w / 2, oy + b.y + b.h / 2] as const;

  p.push(cornerMarker(ox, oy, 6));
  p.push(text(ox + L.title.x + L.title.w / 2, oy + L.title.y + L.title.h / 2, roomName(m.map, rs.roomId), { size: 4, weight: 'bold' }));

  p.push(text(ox + CARD_W / 2, oy + L.stepsLabelY, 'ÉTAPES', { size: 2.4, fill: '#555' }));
  L.steps.forEach((col, i) => {
    const info = rs.steps[i]!;
    p.push(cellLabel({ ...col, head: { ...col.head, x: ox + col.head.x, y: oy + col.head.y } }, String(i + 1)));
    p.push(cell(col.shared, SHARED_BG), cell(col.private, '#fff'));
    const [sx, sy] = at(col.shared);
    p.push(text(sx, sy, String(info.count), { size: 4.5, weight: 'bold' }));
    const [px, py] = at(col.private);
    const c = m.characters.find((x) => x.id === info.revealedCharacter);
    p.push(c ? characterBadge(c, px, py, 2.8) : replayIcon(px, py, 2.2));
  });

  p.push(text(ox + CARD_W / 2, oy + L.charactersLabelY, 'PERSONNAGES', { size: 2.4, fill: '#555' }));
  L.characters.forEach((col, i) => {
    const c = m.characters[i]!;
    const info = rs.characters[c.id]!;
    p.push(cellLabel({ ...col, head: { ...col.head, x: ox + col.head.x, y: oy + col.head.y } }, c.symbol));
    p.push(cell(col.shared, SHARED_BG), cell(col.private, '#fff'));
    const [sx, sy] = at(col.shared);
    p.push(text(sx, sy, String(info.visits), { size: 4.5, weight: 'bold' }));
    const [px, py] = at(col.private);
    p.push(info.revealedStep === null ? replayIcon(px, py, 2.2) : text(px, py, String(info.revealedStep + 1), { size: 4.5, weight: 'bold' }));
  });

  p.push(text(ox + CARD_W / 2, oy + L.footerY, questLabel, { size: 2.4, fill: '#555' }));
  return p.join('');
}

/** Dos de carte (moitié haute, imprimée à 180° pour être lisible une fois pliée). */
function cardBack(m: Material, roomId: string, questLabel: string, ox: number, oy: number): string {
  const { svg, height } = drawMap(m.map, 8, 30, CARD_W - 16, { labels: false, highlight: roomId, stroke: 0.3 });
  const content =
    text(CARD_W / 2, 14, roomName(m.map, roomId), { size: 5, weight: 'bold' }) +
    svg +
    text(CARD_W / 2, 30 + height + 10, questLabel, { size: 3 });
  return `<g transform="translate(${n(ox + CARD_W)} ${n(oy + CARD_H)}) rotate(180)">${content}</g>`;
}

export function roomCardSheets(m: Material, quests: { label: string; rooms: RoomStory[] }[]): string[] {
  const g = gridPlacement(CARD_W, CARD_H * 2);
  const items = quests.flatMap((q) => q.rooms.map((rs) => ({ q, rs })));
  return chunk(items, g.cols * g.rows).map((page) => {
    const parts = page.map(({ q, rs }, i) => {
      const { x, y } = g.at(i);
      return (
        cardBack(m, rs.roomId, q.label, x, y) +
        cardFront(m, rs, q.label, x, y + CARD_H) +
        `<line x1="${n(x)}" y1="${n(y + CARD_H)}" x2="${n(x + CARD_W)}" y2="${n(y + CARD_H)}" stroke="#999" stroke-width="0.25" stroke-dasharray="1.5 1"/>`
      );
    });
    const usedCols = Math.min(page.length, g.cols);
    const usedRows = Math.ceil(page.length / g.cols);
    return sheet(
      parts.join('') + cutMarks(g, usedRows, usedCols) + text(5, 3, 'Cartes de salle — découper, plier sur les pointillés (dos vers l\'extérieur)', { size: 2.5, anchor: 'start', fill: '#555' }),
      `${m.map.name} · cartes de salle`,
    );
  });
}

// ---------------------------------------------------------------------------
// 3. Caches (communs à toutes les parties d'un plan)
// ---------------------------------------------------------------------------
function mask(title: string, badge: string, windows: Box[], ox: number, oy: number): string {
  const L = cardLayout(1, 1); // seules la position du titre et le repère comptent ici
  const holes = [titleWindow(L), ...windows]
    .map((w) => `M ${n(ox + w.x)} ${n(oy + w.y)} h ${n(w.w)} v ${n(w.h)} h ${n(-w.w)} Z`)
    .join(' ');
  // Fond opaque avec trous (règle evenodd) : les fenêtres sont à évider au cutter.
  return (
    `<path d="M ${n(ox)} ${n(oy)} h ${CARD_W} v ${CARD_H} h ${-CARD_W} Z ${holes}" fill="${MASK_FILL}" fill-rule="evenodd"/>` +
    `<path d="${holes}" fill="none" stroke="#000" stroke-width="0.3"/>` +
    cornerMarker(ox, oy, 6, '#000') +
    rect(ox + MASK_LABEL.x, oy + MASK_LABEL.y, MASK_LABEL.w, MASK_LABEL.h, 'fill="#fff" rx="2"') +
    badge +
    text(ox + CARD_W / 2, oy + MASK_LABEL.y + 9.5, title, { size: 3.6, weight: 'bold' })
  );
}

export function maskSheets(m: Material): string[] {
  const L = cardLayout(m.steps, m.characters.length);
  const g = gridPlacement(CARD_W, CARD_H);
  const masks: ((x: number, y: number) => string)[] = [
    ...L.steps.map((col, i) => (x: number, y: number) =>
      mask(`Étape ${i + 1}`, text(x + CARD_W / 2, y + MASK_LABEL.y + 3.5, 'nb de présents · un présent', { size: 2.2, fill: '#555' }), [columnWindow(col)], x, y)),
    ...L.characters.map((col, i) => (x: number, y: number) => {
      const c = m.characters[i]!;
      return mask(c.name, characterBadge(c, x + CARD_W / 2, y + MASK_LABEL.y + 3.8, 2.4), [columnWindow(col)], x, y);
    }),
  ];
  return chunk(masks, g.cols * g.rows).map((page) =>
    sheet(
      page.map((draw, i) => { const { x, y } = g.at(i); return draw(x, y); }).join('') +
        cutMarks(g, Math.ceil(page.length / g.cols), Math.min(page.length, g.cols)) +
        text(5, 3, 'Caches — découper le contour, évider les fenêtres ; aligner le coin noir sur celui de la carte', { size: 2.5, anchor: 'start', fill: '#555' }),
      `${m.map.name} · caches`,
    ),
  );
}

// ---------------------------------------------------------------------------
// 4. Feuilles de notes (communes) : 6 plans (1 par étape) + personnages × salles au centre
// ---------------------------------------------------------------------------
export function noteSheets(m: Material, perSheet = 6): string[] {
  const stepGroups = chunk(Array.from({ length: m.steps }, (_, i) => i), perSheet);
  return stepGroups.map((group, sheetIndex) => {
    const p: string[] = [];
    p.push(text(5, 6, `Feuille d'enquête — ${m.map.name}`, { size: 4.5, weight: 'bold', anchor: 'start' }));
    p.push(text(PAGE_W - 5, 6, 'Joueur : ____________   Partie n° ______', { size: 3.2, anchor: 'end' }));

    const mapW = (PAGE_W - 10 - 2 * 4) / 3;
    const drawStep = (step: number, x: number, y: number) => {
      p.push(text(x, y + 2.5, `Étape ${step + 1}`, { size: 3.4, weight: 'bold', anchor: 'start' }));
      const { svg } = drawMap(m.map, x, y + 5, mapW, {
        labelSize: 2.4,
        stroke: 0.35,
        roomExtra: (box) =>
          m.characters
            .map((c, i) => {
              const cols = 3;
              const cx = box.x + box.w * ((i % cols) + 0.5) / cols;
              const cy = box.y + box.h * 0.45 + Math.floor(i / cols) * 4.5;
              return text(cx, cy, c.symbol, { size: 2.8, fill: '#b5b5b5', weight: 'bold' });
            })
            .join(''),
      });
      p.push(svg);
    };
    const mapH = mapW * (m.map.height / m.map.width) + 6;
    const top = group.slice(0, 3);
    const bottom = group.slice(3);
    top.forEach((s, i) => drawStep(s, 5 + i * (mapW + 4), 10));

    // Tableau central : personnages × salles (nombre de passages).
    const tableTop = 10 + mapH + 6;
    const rows = m.characters.length;
    const cols = m.map.rooms.length;
    const nameW = 32;
    const cw = (PAGE_W - 10 - nameW) / cols;
    const rh = 8;
    p.push(text(5, tableTop - 2, 'Nombre de passages par salle', { size: 3, weight: 'bold', anchor: 'start' }));
    m.map.rooms.forEach((r, j) => {
      p.push(rect(5 + nameW + j * cw, tableTop, cw, rh, 'fill="#eee" stroke="#111" stroke-width="0.25"'));
      p.push(text(5 + nameW + j * cw + cw / 2, tableTop + rh / 2, r.name, { size: 2.6 }));
    });
    m.characters.forEach((c, i) => {
      const y = tableTop + rh * (i + 1);
      p.push(rect(5, y, nameW, rh, 'fill="#fff" stroke="#111" stroke-width="0.25"'));
      p.push(characterBadge(c, 9, y + rh / 2, 2.6) + text(13, y + rh / 2, c.name, { size: 3, anchor: 'start' }));
      for (let j = 0; j < cols; j++) p.push(rect(5 + nameW + j * cw, y, cw, rh, 'fill="#fff" stroke="#111" stroke-width="0.25"'));
    });

    const bottomTop = tableTop + rh * (rows + 1) + 6;
    bottom.forEach((s, i) => drawStep(s, 5 + i * (mapW + 4), bottomTop));

    const notesTop = bottomTop + (bottom.length ? mapH + 4 : 0);
    p.push(text(5, notesTop + 2, 'Notes', { size: 3, weight: 'bold', anchor: 'start' }));
    for (let y = notesTop + 9; y < PAGE_H - 5; y += 7) p.push(`<line x1="5" y1="${n(y)}" x2="${PAGE_W - 5}" y2="${n(y)}" stroke="#ccc" stroke-width="0.25"/>`);

    const suffix = stepGroups.length > 1 ? ` · feuille ${sheetIndex + 1}/${stepGroups.length}` : '';
    return sheet(p.join(''), `${m.map.name} · feuille de notes${suffix}`);
  });
}

// ---------------------------------------------------------------------------
// 5. Fiche de partie : mise en place (haut, public) + solution (bas, à découper)
// ---------------------------------------------------------------------------
export function questSheet(m: Material, story: Story, label: string): string {
  const p: string[] = [];
  const half = PAGE_H / 2;

  p.push(text(5, 6, `${label} — mise en place`, { size: 4.5, weight: 'bold', anchor: 'start' }));
  p.push(text(5, 13, 'Position des personnages à l\'étape 1 :', { size: 3, anchor: 'start' }));
  const { svg } = drawMap(m.map, 30, 17, PAGE_W - 60, {
    labelSize: 3.4,
    roomExtra: (box) =>
      m.characters
        .filter((c) => story.paths[c.id]![0] === box.id)
        .map((c, i) => characterBadge(c, box.x + 10 + (i % 4) * 7, box.y + box.h / 2 + Math.floor(i / 4) * 7, 2.8))
        .join(''),
  });
  p.push(svg);

  p.push(`<line x1="0" y1="${half}" x2="${PAGE_W}" y2="${half}" stroke="#000" stroke-width="0.3" stroke-dasharray="3 2"/>`);
  p.push(text(PAGE_W / 2, half + 3, '✂ découper — partie basse = SOLUTION, à garder cachée', { size: 2.5, fill: '#555' }));

  const top = half + 10;
  p.push(text(5, top, `${label} — solution`, { size: 4.5, weight: 'bold', anchor: 'start' }));
  const nameW = 34;
  const cw = (PAGE_W - 10 - nameW) / m.steps;
  const rh = 9;
  for (let s = 0; s < m.steps; s++) {
    p.push(rect(5 + nameW + s * cw, top + 5, cw, rh, 'fill="#eee" stroke="#111" stroke-width="0.25"'));
    p.push(text(5 + nameW + s * cw + cw / 2, top + 5 + rh / 2, `Étape ${s + 1}`, { size: 2.8, weight: 'bold' }));
  }
  m.characters.forEach((c, i) => {
    const y = top + 5 + rh * (i + 1);
    p.push(rect(5, y, nameW, rh, 'fill="#fff" stroke="#111" stroke-width="0.25"'));
    p.push(characterBadge(c, 9, y + rh / 2, 2.6) + text(13, y + rh / 2, c.name, { size: 3, anchor: 'start' }));
    story.paths[c.id]!.forEach((roomId, s) => {
      p.push(rect(5 + nameW + s * cw, y, cw, rh, 'fill="#fff" stroke="#111" stroke-width="0.25"'));
      p.push(text(5 + nameW + s * cw + cw / 2, y + rh / 2, roomName(m.map, roomId), { size: 2.6 }));
    });
  });
  const enigmaY = top + 5 + rh * (m.characters.length + 1) + 8;
  p.push(text(5, enigmaY, 'Énigme : à venir (jalon J4 — objectif + solution unique)', { size: 3, anchor: 'start', fill: '#777' }));
  return sheet(p.join(''), `${m.map.name} · ${label}`);
}
