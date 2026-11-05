import './render/print.css';
import { LEVELS, formatQuestList, generateQuest, parseQuestList, type Quest, type QuestRef } from './core/quests';
import { modes } from './core/modes';
import { maps as builtinMaps, defaultCharacters } from './maps';
import { parseMap } from './core/map';
import type { GameMap } from './core/types';
import { themes } from './render/themes';
import { mapSheet, maskSheets, noteSheets, questSheet, roomCardSheets, type Material } from './render/documents';

const STEPS = 6; // fixe (règle du jeu) ; le moteur reste paramétrable.

type DocKey = 'map' | 'masks' | 'notes' | 'cards' | 'quest';
const DOCS: { key: DocKey; label: string; common: boolean }[] = [
  { key: 'map', label: 'Plan', common: true },
  { key: 'masks', label: 'Caches', common: true },
  { key: 'notes', label: 'Feuilles de notes', common: true },
  { key: 'cards', label: 'Cartes de salle', common: false },
  { key: 'quest', label: 'Mise en place + solution', common: false },
];

const app = document.querySelector<HTMLDivElement>('#app')!;

// Plans importés (JSON) conservés dans ce navigateur.
const IMPORT_KEY = 'kronologic.importedMaps';
function loadImported(): GameMap[] {
  try {
    return (JSON.parse(localStorage.getItem(IMPORT_KEY) ?? '[]') as unknown[]).flatMap((j) => { try { return [parseMap(j)]; } catch { return []; } });
  } catch { return []; }
}
let imported = loadImported();
const allMaps = (): GameMap[] => [...builtinMaps, ...imported.filter((m) => !builtinMaps.some((b) => b.id === m.id))];
function saveImported(): void {
  try { localStorage.setItem(IMPORT_KEY, JSON.stringify(imported)); } catch { /* stockage indisponible */ }
}
const params = new URLSearchParams(location.search);
const state = {
  mapId: params.get('map') ?? builtinMaps[0]!.id,
  themeId: params.get('theme') ?? themes[0]!.id,
  quests: parseQuestList(params.get('quests') ?? 'tete:1'),
  players: Math.max(1, Number(params.get('players') ?? 4)),
  docs: new Set<DocKey>((params.get('docs')?.split(',') as DocKey[] | undefined) ?? DOCS.map((d) => d.key)),
};

/** Une partie = un numéro ; la graine en dérive (même plan + même n° ⇒ même partie). */
const sameRef = (a: QuestRef, b: QuestRef) => a.mode === b.mode && a.level === b.level;

// Les quêtes sont déterministes : on les garde en cache (plan × mode × niveau).
const questCache = new Map<string, Quest>();
function questFor(map: GameMap, ref: QuestRef): Quest {
  const k = `${map.id}|${JSON.stringify(map)}|${ref.mode}|${ref.level}`;
  if (!questCache.has(k)) questCache.set(k, generateQuest(map, defaultCharacters, ref, STEPS));
  return questCache.get(k)!;
}

function render(): void {
  const maps = allMaps();
  const map = maps.find((m) => m.id === state.mapId) ?? maps[0]!;
  const theme = themes.find((t) => t.id === state.themeId) ?? themes[0]!;
  const material: Material = { map, characters: defaultCharacters, steps: STEPS, theme };
  // Ordre stable : mode puis niveau.
  const refs = modes.flatMap((md) => LEVELS.map((level) => ({ mode: md.id, level }))).filter((r) => state.quests.some((q) => sameRef(q, r)));
  const quests = refs.map((ref) => questFor(map, ref));

  const pages: string[] = [];
  if (state.docs.has('map')) pages.push(mapSheet(material));
  if (state.docs.has('masks')) pages.push(...maskSheets(material));
  if (state.docs.has('notes')) for (let i = 0; i < state.players; i++) pages.push(...noteSheets(material));
  if (state.docs.has('cards')) pages.push(...roomCardSheets(material, quests));
  if (state.docs.has('quest')) pages.push(...quests.map((q) => questSheet(material, q)));

  history.replaceState(null, '', `?map=${map.id}&theme=${theme.id}&quests=${formatQuestList(refs)}&players=${state.players}&docs=${[...state.docs].join(',')}`);

  const checkbox = (d: (typeof DOCS)[number]) =>
    `<label><input type="checkbox" data-doc="${d.key}" ${state.docs.has(d.key) ? 'checked' : ''}> ${d.label}</label>`;

  app.innerHTML = `
    <div class="toolbar no-print">
      <fieldset><legend>Plan & thème</legend>
        <label>Plan <select id="map">${maps.map((m) => `<option value="${m.id}" ${m.id === map.id ? 'selected' : ''}>${m.name}</option>`).join('')}</select></label>
        <label>Importer un plan (JSON) <input id="import" type="file" accept="application/json,.json"></label>
        <button id="export">Télécharger ce plan (modèle JSON)</button>
        <label>Thème <select id="theme">${themes.map((t) => `<option value="${t.id}" ${t.id === theme.id ? 'selected' : ''}>${t.name}</option>`).join('')}</select></label>
      </fieldset>
      <fieldset><legend>Matériel commun (réutilisable)</legend>
        ${DOCS.filter((d) => d.common).map(checkbox).join('')}
        <label>Joueurs <input id="players" type="number" min="1" max="8" value="${state.players}"></label>
      </fieldset>
      <fieldset><legend>Par quête (1 jeu de 6 cartes chacune)</legend>
        ${DOCS.filter((d) => !d.common).map(checkbox).join('')}
        <table class="quest-grid">
          <tr><th></th>${LEVELS.map((l) => `<th>Enquête ${l}</th>`).join('')}<th></th></tr>
          ${modes.map((md) => `<tr><th>${md.name}</th>${LEVELS.map((level) => `<td><input type="checkbox" data-quest="${md.id}:${level}" ${refs.some((r) => sameRef(r, { mode: md.id, level })) ? 'checked' : ''} aria-label="${md.name} enquête ${level}"></td>`).join('')}<td><button data-row="${md.id}">tout</button></td></tr>`).join('')}
        </table>
        <button id="all-quests">Tout cocher (15)</button>
      </fieldset>
      <span>${pages.length} page(s)</span>
      <button onclick="print()">Imprimer</button>
    </div>
    ${pages.join('')}`;

  const num = (id: string) => Math.max(1, Number(app.querySelector<HTMLInputElement>(`#${id}`)!.value) || 1);
  app.querySelector<HTMLSelectElement>('#map')!.onchange = (e) => { state.mapId = (e.target as HTMLSelectElement).value; render(); };
  app.querySelector<HTMLSelectElement>('#theme')!.onchange = (e) => { state.themeId = (e.target as HTMLSelectElement).value; render(); };
  app.querySelector<HTMLButtonElement>('#export')!.onclick = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(map, null, 2)], { type: 'application/json' }));
    a.download = `${map.id}.json`;
    a.click();
  };
  app.querySelector<HTMLInputElement>('#import')!.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      const m = parseMap(JSON.parse(await file.text()));
      imported = [...imported.filter((x) => x.id !== m.id), m];
      saveImported();
      state.mapId = m.id;
      render();
    } catch (err) {
      alert(`Plan refusé :\n${(err as Error).message}`);
    }
  };
  app.querySelector<HTMLInputElement>('#players')!.onchange = () => { state.players = num('players'); render(); };
  app.querySelectorAll<HTMLInputElement>('[data-quest]').forEach((el) => {
    el.onchange = () => {
      const [mode, level] = el.dataset.quest!.split(':');
      const ref = { mode, level: Number(level) } as QuestRef;
      state.quests = el.checked ? [...state.quests, ref] : state.quests.filter((q) => !sameRef(q, ref));
      render();
    };
  });
  app.querySelectorAll<HTMLButtonElement>('[data-row]').forEach((el) => {
    el.onclick = () => {
      const mode = el.dataset.row as QuestRef['mode'];
      state.quests = [...state.quests.filter((q) => q.mode !== mode), ...LEVELS.map((level) => ({ mode, level }))];
      render();
    };
  });
  app.querySelector<HTMLButtonElement>('#all-quests')!.onclick = () => {
    state.quests = modes.flatMap((md) => LEVELS.map((level) => ({ mode: md.id, level })));
    render();
  };
  app.querySelectorAll<HTMLInputElement>('[data-doc]').forEach((el) => {
    el.onchange = () => { const k = el.dataset.doc as DocKey; if (el.checked) state.docs.add(k); else state.docs.delete(k); render(); };
  });
}

render();
