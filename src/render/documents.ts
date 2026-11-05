import type { Murder } from '../core/scenario';
import type { Character, GameMap, RoomStory, Story } from '../core/types';
import { cutMarks, gridPlacement } from './cutMarks';
import { cornerMarker, replayIcon } from './icons';
import { CARD_H, CARD_W, MASK_LABEL, cardLayout, columnWindow, titleWindow, type Box } from './layout';
import { drawMap, type MapDrawOptions } from './mapSvg';
import { PAGE_H, PAGE_W, chunk, esc, n, rect, sheet, text } from './svg';
import type { Theme } from './themes';

/** Contexte commun à tous les supports d'un plan (réutilisables d'une partie à l'autre). */
export interface Material {
  map: GameMap;
  characters: Character[];
  steps: number;
  theme: Theme;
}

const roomName = (map: GameMap, id: string) => map.rooms.find((r) => r.id === id)?.name ?? id;
const line = 'stroke="currentColor" stroke-width="0.25"';

function mapOpts(t: Theme, extra: MapDrawOptions = {}): MapDrawOptions {
  return { roomFill: t.roomFill, highlightFill: t.highlightFill, ...extra };
}

function title(t: Theme, x: number, y: number, content: string, size: number, anchor: 'start' | 'middle' | 'end' = 'middle', maxWidth?: number): string {
  const label = t.decorated ? content.toUpperCase() : content;
  // Réduit la police si le texte risque de déborder (largeur moyenne d'un caractère ≈ 0,62 × taille, + espacement).
  const charW = (t.decorated ? 0.72 : 0.6) + (t.decorated ? 0.3 / size : 0);
  const fitted = maxWidth ? Math.min(size, maxWidth / (label.length * charW)) : size;
  const deco = t.decorated ? 'letter-spacing="0.3"' : '';
  return text(x, y, label, { size: fitted, anchor, weight: 'bold', extra: `font-family="${esc(t.titleFont)}" ${deco}` });
}

function characterBadge(t: Theme, c: Character, cx: number, cy: number, r: number): string {
  if (t.badge === 'outline') {
    return `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="none" stroke="currentColor" stroke-width="0.3"/>` +
      text(cx, cy + 0.1, c.symbol, { size: r * 1.3, weight: 'bold' });
  }
  const ring = t.decorated ? `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r + 0.45)}" fill="none" stroke="${t.accent}" stroke-width="0.3"/>` : '';
  return ring + `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="${c.color}"/>` +
    text(cx, cy + 0.1, c.symbol, { size: r * 1.3, weight: 'bold', fill: '#fff' });
}

/** Cadre double décoratif (thème stylisé). */
function frame(t: Theme, x: number, y: number, w: number, h: number): string {
  if (!t.decorated) return '';
  return rect(x + 1.2, y + 1.2, w - 2.4, h - 2.4, `fill="none" stroke="${t.accent}" stroke-width="0.4"`) +
    rect(x + 2, y + 2, w - 4, h - 4, `fill="none" stroke="${t.accent}" stroke-width="0.15"`);
}

/** Filet orné : ── ◆ ── */
function ornament(t: Theme, cx: number, y: number, w: number): string {
  if (!t.decorated) return '';
  const d = 1;
  return `<path d="M ${n(cx - w / 2)} ${n(y)} H ${n(cx - d * 2)} M ${n(cx + d * 2)} ${n(y)} H ${n(cx + w / 2)}" stroke="${t.accent}" stroke-width="0.25"/>` +
    `<path d="M ${n(cx)} ${n(y - d)} L ${n(cx + d)} ${n(y)} L ${n(cx)} ${n(y + d)} L ${n(cx - d)} ${n(y)} Z" fill="${t.accent}"/>`;
}

// ---------------------------------------------------------------------------
// 1. Plan seul
// ---------------------------------------------------------------------------
export function mapSheet(m: Material): string {
  const t = m.theme;
  const { svg, height } = drawMap(m.map, 10, 24, PAGE_W - 20, mapOpts(t, { labelSize: 6, stroke: 1 }));
  return sheet(
    t,
    frame(t, 0, 0, PAGE_W, Math.min(PAGE_H, 24 + height + 14)) +
      title(t, PAGE_W / 2, 11, m.map.name, 7) +
      ornament(t, PAGE_W / 2, 17, 60) +
      svg +
      `<rect x="20" y="${n(24 + height + 5.5)}" width="8" height="2" fill="currentColor"/>` +
      text(31, 24 + height + 6.5, 'porte = passage · mur plein = infranchissable · 1 salle voisine par étape, jamais 2 fois de suite la même', { size: 2.8, anchor: 'start' }),
    m.map.name,
  );
}

// ---------------------------------------------------------------------------
// 2. Cartes de salle (une partie = une carte par salle), pliées en deux
// ---------------------------------------------------------------------------
function cardFront(m: Material, rs: RoomStory, questLabel: string, ox: number, oy: number): string {
  const t = m.theme;
  const L = cardLayout(m.steps, m.characters.length);
  const p: string[] = [];
  const cell = (b: Box, fill: string) => rect(ox + b.x, oy + b.y, b.w, b.h, `fill="${fill}" ${line}`);
  const mid = (b: Box) => [ox + b.x + b.w / 2, oy + b.y + b.h / 2] as const;
  const head = (b: Box, label: string) => { const [x, y] = mid(b); return text(x, y, label, { size: 2.4, fill: t.muted }); };
  const big = (b: Box, v: string) => { const [x, y] = mid(b); return text(x, y, v, { size: 4.5, weight: 'bold' }); };

  if (t.cardFill !== 'none') p.push(rect(ox, oy, CARD_W, CARD_H, `fill="${t.cardFill}"`));
  p.push(frame(t, ox, oy, CARD_W, CARD_H));
  p.push(cornerMarker(ox, oy, 6));
  p.push(title(t, ox + L.title.x + L.title.w / 2, oy + L.title.y + L.title.h / 2, roomName(m.map, rs.roomId), 4, 'middle', L.title.w - 2));

  p.push(text(ox + CARD_W / 2, oy + L.stepsLabelY, 'Étapes', { size: 2.4, fill: t.muted }));
  L.steps.forEach((col, i) => {
    const info = rs.steps[i]!;
    p.push(head(col.head, String(i + 1)), cell(col.shared, t.sharedFill), cell(col.private, 'none'));
    p.push(big(col.shared, String(info.count)));
    const [px, py] = mid(col.private);
    const c = m.characters.find((x) => x.id === info.revealedCharacter);
    p.push(c ? characterBadge(t, c, px, py, 2.7) : replayIcon(px, py, 2.2));
  });

  p.push(text(ox + CARD_W / 2, oy + L.charactersLabelY, 'Personnages', { size: 2.4, fill: t.muted }));
  L.characters.forEach((col, i) => {
    const c = m.characters[i]!;
    const info = rs.characters[c.id]!;
    p.push(head(col.head, c.symbol), cell(col.shared, t.sharedFill), cell(col.private, 'none'));
    p.push(big(col.shared, String(info.visits)));
    const [px, py] = mid(col.private);
    p.push(info.revealedStep === null ? replayIcon(px, py, 2.2) : big(col.private, String(info.revealedStep + 1)));
  });

  p.push(text(ox + CARD_W / 2, oy + L.footerY, questLabel, { size: 2.4, fill: t.muted }));
  return p.join('');
}

/** Dos de carte (moitié haute, imprimée à 180° pour être lisible une fois pliée). */
function cardBack(m: Material, roomId: string, questLabel: string, ox: number, oy: number): string {
  const t = m.theme;
  const { svg, height } = drawMap(m.map, 8, 30, CARD_W - 16, mapOpts(t, { labels: false, highlight: roomId, stroke: 0.3 }));
  const content =
    (t.cardFill !== 'none' ? rect(0, 0, CARD_W, CARD_H, `fill="${t.cardFill}"`) : '') +
    frame(t, 0, 0, CARD_W, CARD_H) +
    title(t, CARD_W / 2, 14, roomName(m.map, roomId), 5, 'middle', CARD_W - 12) +
    ornament(t, CARD_W / 2, 21, 30) +
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
    return sheet(
      m.theme,
      parts.join('') +
        cutMarks(g, Math.ceil(page.length / g.cols), Math.min(page.length, g.cols)) +
        text(5, 3, "Cartes de salle — découper, plier sur les pointillés (dos vers l'extérieur)", { size: 2.5, anchor: 'start', fill: m.theme.muted }),
      `${m.map.name} · cartes de salle`,
    );
  });
}

// ---------------------------------------------------------------------------
// 3. Caches (communs à toutes les parties d'un plan)
// ---------------------------------------------------------------------------
function mask(t: Theme, label: string, badge: string, windows: Box[], ox: number, oy: number): string {
  const holes = [titleWindow(cardLayout(1, 1)), ...windows]
    .map((w) => `M ${n(ox + w.x)} ${n(oy + w.y)} h ${n(w.w)} v ${n(w.h)} h ${n(-w.w)} Z`)
    .join(' ');
  return (
    // Fond opaque avec trous (evenodd) : les fenêtres sont à évider au cutter.
    `<path d="M ${n(ox)} ${n(oy)} h ${CARD_W} v ${CARD_H} h ${-CARD_W} Z ${holes}" fill="${t.maskFill}" fill-rule="evenodd"/>` +
    (t.decorated ? rect(ox + 1.2, oy + 1.2, CARD_W - 2.4, CARD_H - 2.4, `fill="none" stroke="${t.accent}" stroke-width="0.4"`) : '') +
    rect(ox, oy, CARD_W, CARD_H, 'fill="none" stroke="currentColor" stroke-width="0.2"') +
    `<path d="${holes}" fill="none" stroke="currentColor" stroke-width="0.3"/>` +
    cornerMarker(ox, oy, 6, t.decorated ? t.accent : 'currentColor') +
    rect(ox + MASK_LABEL.x, oy + MASK_LABEL.y, MASK_LABEL.w, MASK_LABEL.h, `fill="${t.maskLabelFill}" stroke="${t.decorated ? t.accent : 'currentColor'}" stroke-width="0.3" rx="2"`) +
    badge +
    title(t, ox + CARD_W / 2, oy + MASK_LABEL.y + 9.5, label, 3.4, 'middle', MASK_LABEL.w - 4)
  );
}

export function maskSheets(m: Material): string[] {
  const t = m.theme;
  const L = cardLayout(m.steps, m.characters.length);
  const g = gridPlacement(CARD_W, CARD_H);
  const masks: ((x: number, y: number) => string)[] = [
    ...L.steps.map((col, i) => (x: number, y: number) =>
      mask(t, `Étape ${i + 1}`, text(x + CARD_W / 2, y + MASK_LABEL.y + 3.5, 'nb de présents · un présent', { size: 2.2, fill: t.muted }), [columnWindow(col)], x, y)),
    ...L.characters.map((col, i) => (x: number, y: number) => {
      const c = m.characters[i]!;
      return mask(t, c.name, characterBadge(t, c, x + CARD_W / 2, y + MASK_LABEL.y + 3.8, 2.3), [columnWindow(col)], x, y);
    }),
  ];
  const hint = t.id === 'minimal' ? ' — imprimer sur papier épais (≥ 160 g) pour rester opaque' : '';
  return chunk(masks, g.cols * g.rows).map((page) =>
    sheet(
      t,
      page.map((draw, i) => { const { x, y } = g.at(i); return draw(x, y); }).join('') +
        cutMarks(g, Math.ceil(page.length / g.cols), Math.min(page.length, g.cols)) +
        text(5, 3, `Caches — découper, évider les fenêtres, aligner le coin marqué sur celui de la carte${hint}`, { size: 2.5, anchor: 'start', fill: t.muted }),
      `${m.map.name} · caches`,
    ),
  );
}

// ---------------------------------------------------------------------------
// 4. Feuilles de notes (communes) : 6 plans (1 par étape) + personnages × salles au centre
// ---------------------------------------------------------------------------
export function noteSheets(m: Material, perSheet = 6): string[] {
  const t = m.theme;
  const W = PAGE_H; // paysage : 277 × 190 mm
  const H = PAGE_W;
  const stepGroups = chunk(Array.from({ length: m.steps }, (_, i) => i), perSheet);
  const headFill = t.id === 'minimal' ? 'none' : t.decorated ? t.highlightFill : '#eee';
  const aspect = m.map.width / m.map.height;
  const top = 11;
  const gap = 4;
  // Trois plans empilés à gauche (étapes 1-3), trois à droite (4-6), tableau au centre.
  const slotH = (H - top - 4 - 2 * gap) / 3;
  const mapH = slotH - 5;
  const mapW = Math.min(mapH * aspect, 80);
  const tableX = 5 + mapW + 8;
  const tableW = W - 2 * tableX;

  return stepGroups.map((group, sheetIndex) => {
    const p: string[] = [];
    p.push(title(t, 5, 5.5, `Feuille d'enquête — ${m.map.name}`, 4.5, 'start'));
    p.push(text(W - 5, 5.5, 'Joueur : ____________   Partie n° ______', { size: 3.2, anchor: 'end' }));

    const drawStep = (step: number, x: number, y: number) => {
      p.push(title(t, x, y + 2, `Étape ${step + 1}`, 3.4, 'start'));
      p.push(drawMap(m.map, x, y + 4.5, mapW, mapOpts(t, {
        labelSize: 2.4,
        stroke: 0.35,
        roomExtra: (box) => {
          // Lettres à cocher, réparties dans la salle sous son nom (s'adapte aux salles asymétriques).
          const top = box.y + 5;
          const area = { x: box.x + 1.5, y: top, w: box.w - 3, h: box.y + box.h - top - 1.5 };
          const cols = area.w >= area.h * 1.6 ? 6 : area.w >= area.h * 0.6 ? 3 : 2;
          const rows = Math.ceil(m.characters.length / cols);
          const size = Math.max(1.8, Math.min(2.8, (area.h / rows) * 0.75, (area.w / cols) * 0.75));
          return m.characters
            .map((c, i) => {
              const cx = area.x + area.w * ((i % cols) + 0.5) / cols;
              const cy = area.y + area.h * (Math.floor(i / cols) + 0.5) / rows;
              return text(cx, cy, c.symbol, { size, fill: '#b5b5b5', weight: 'bold' });
            })
            .join('');
        },
      })).svg);
    };
    group.forEach((s, i) => {
      const left = i < 3;
      drawStep(s, left ? 5 : W - 5 - mapW, top + (i % 3) * (slotH + gap));
    });

    // Tableau central : personnages × salles (nombre de passages). Noms de salles à la verticale.
    const nameW = 30;
    const cw = (tableW - nameW) / m.map.rooms.length;
    const longest = Math.max(...m.map.rooms.map((r) => r.name.length));
    const headSize = 3.2;
    const hh = Math.max(14, longest * headSize * 0.6 + 4);
    const rh = Math.min(16, (H - top - 16 - hh) / m.characters.length);
    const tableTop = top + (H - top - 4 - hh - rh * m.characters.length) / 2 + 3;
    p.push(title(t, tableX + tableW / 2, tableTop - 4, 'Nombre de passages par salle', 3.4));
    m.map.rooms.forEach((r, j) => {
      const cx = tableX + nameW + j * cw + cw / 2;
      p.push(rect(tableX + nameW + j * cw, tableTop, cw, hh, `fill="${headFill}" ${line}`));
      p.push(`<g transform="translate(${n(cx)} ${n(tableTop + hh - 2)}) rotate(-90)">${text(0, 0, r.name, { size: headSize, anchor: 'start', weight: 'bold' })}</g>`);
    });
    m.characters.forEach((c, i) => {
      const y = tableTop + hh + rh * i;
      p.push(rect(tableX, y, nameW, rh, `fill="none" ${line}`));
      p.push(characterBadge(t, c, tableX + 4.5, y + rh / 2, 2.6) + text(tableX + 9, y + rh / 2, c.name, { size: 3, anchor: 'start' }));
      m.map.rooms.forEach((_, j) => p.push(rect(tableX + nameW + j * cw, y, cw, rh, `fill="none" ${line}`)));
    });

    const suffix = stepGroups.length > 1 ? ` · feuille ${sheetIndex + 1}/${stepGroups.length}` : '';
    return sheet(t, p.join(''), `${m.map.name} · feuille de notes${suffix}`, 'landscape');
  });
}

// ---------------------------------------------------------------------------
// 5. Fiche de partie : mise en place (haut, public) + solution (bas, à découper)
// ---------------------------------------------------------------------------
export function questSheet(m: Material, story: Story, murder: Murder, label: string): string {
  const t = m.theme;
  const p: string[] = [];
  const half = PAGE_H / 2;
  const headFill = t.id === 'minimal' ? 'none' : t.decorated ? t.highlightFill : '#eee';
  const byId = (id: string) => m.characters.find((c) => c.id === id)!;
  const victim = byId(murder.victim);

  // --- Haut : mise en place (public) ---------------------------------------
  p.push(title(t, 5, 6, `${label} — mise en place`, 4.5, 'start'));
  p.push(text(5, 13, `Victime : le ${victim.name} (${victim.symbol}), empoisonné au cours de la soirée.`, { size: 3.2, anchor: 'start', weight: 'bold' }));
  p.push(text(5, 18.5, "Le coupable était seul avec lui. Le poison agit lentement : il continue de se déplacer jusqu'à la fin.", { size: 3, anchor: 'start' }));
  p.push(text(5, 24, "Trouvez QUI, OÙ et à quelle ÉTAPE. Position des personnages à l'étape 1 :", { size: 3, anchor: 'start' }));
  const mapW = Math.min(PAGE_W - 60, (half - 34) * (m.map.width / m.map.height));
  p.push(drawMap(m.map, (PAGE_W - mapW) / 2, 28, mapW, mapOpts(t, {
    labelSize: 3.2,
    roomExtra: (box) =>
      m.characters
        .filter((c) => story.paths[c.id]![0] === box.id)
        .map((c, i) => characterBadge(t, c, box.x + 6 + (i % 4) * 6.5, box.y + 9 + Math.floor(i / 4) * 6.5, 2.6))
        .join(''),
  })).svg);

  p.push(`<line x1="0" y1="${half}" x2="${PAGE_W}" y2="${half}" stroke="currentColor" stroke-width="0.3" stroke-dasharray="3 2"/>`);
  p.push(text(PAGE_W / 2, half + 3, '✂ découper — partie basse = SOLUTION, à garder cachée', { size: 2.5, fill: t.muted }));

  // --- Bas : solution = salles × étapes, lettres des présents ----------------
  const top = half + 10;
  p.push(title(t, 5, top, `${label} — solution`, 4.5, 'start'));
  const nameW = 34;
  const cw = (PAGE_W - 10 - nameW) / m.steps;
  const rh = Math.min(13, (PAGE_H - top - 30) / (m.map.rooms.length + 1));
  const gridTop = top + 5;
  for (let s = 0; s < m.steps; s++) {
    p.push(rect(5 + nameW + s * cw, gridTop, cw, rh, `fill="${headFill}" ${line}`));
    p.push(text(5 + nameW + s * cw + cw / 2, gridTop + rh / 2, `Étape ${s + 1}`, { size: 2.8, weight: 'bold' }));
  }
  const murderFill = t.id === 'minimal' ? '#f6d0d0' : '#e9a3a3';
  m.map.rooms.forEach((room, r) => {
    const y = gridTop + rh * (r + 1);
    p.push(rect(5, y, nameW, rh, `fill="${headFill}" ${line}`));
    p.push(text(8, y + rh / 2, room.name, { size: 3, anchor: 'start', weight: 'bold' }));
    for (let s = 0; s < m.steps; s++) {
      const x = 5 + nameW + s * cw;
      const isMurder = room.id === murder.room && s === murder.step;
      p.push(rect(x, y, cw, rh, `fill="${isMurder ? murderFill : 'none'}" ${isMurder ? 'stroke="#b22" stroke-width="0.6"' : line}`));
      const present = m.characters.filter((c) => story.paths[c.id]![s] === room.id);
      const r0 = Math.min(2.3, rh / 4.6);
      present.forEach((c, k) => {
        const perRow = 4;
        const rows = Math.ceil(present.length / perRow);
        const inRow = Math.min(perRow, present.length - Math.floor(k / perRow) * perRow);
        const cx = x + cw / 2 + ((k % perRow) - (inRow - 1) / 2) * (r0 * 2.4);
        const cy = y + rh / 2 + (Math.floor(k / perRow) - (rows - 1) / 2) * (r0 * 2.4);
        p.push(characterBadge(t, c, cx, cy, r0));
      });
    }
  });
  const culprit = byId(murder.culprit);
  const answerY = gridTop + rh * (m.map.rooms.length + 1) + 7;
  p.push(rect(5, answerY - 4, 6, 6, `fill="${murderFill}" stroke="#b22" stroke-width="0.6"`));
  p.push(text(14, answerY - 1, `Meurtre : ${culprit.name} (${culprit.symbol}) a empoisonné le ${victim.name}`
    + ` — ${roomName(m.map, murder.room)}, étape ${murder.step + 1}.`, { size: 3.2, anchor: 'start', weight: 'bold' }));
  return sheet(t, p.join(''), `${m.map.name} · ${label}`);
}
