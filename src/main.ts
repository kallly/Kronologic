import './render/print.css';
import { generateStory } from './core/story';
import { buildRoomStories } from './core/roomStory';
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
  from: Math.max(1, Number(params.get('from') ?? 1)),
  count: Math.max(1, Number(params.get('count') ?? 1)),
  players: Math.max(1, Number(params.get('players') ?? 4)),
  docs: new Set<DocKey>((params.get('docs')?.split(',') as DocKey[] | undefined) ?? DOCS.map((d) => d.key)),
};

/** Une partie = un numéro ; la graine en dérive (même plan + même n° ⇒ même partie). */
const questSeed = (mapId: string, n: number) => `${mapId}#${n}`;

function render(): void {
  const maps = allMaps();
  const map = maps.find((m) => m.id === state.mapId) ?? maps[0]!;
  const theme = themes.find((t) => t.id === state.themeId) ?? themes[0]!;
  const material: Material = { map, characters: defaultCharacters, steps: STEPS, theme };
  const quests = Array.from({ length: state.count }, (_, i) => {
    const number = state.from + i;
    const story = generateStory(map, { seed: questSeed(map.id, number), steps: STEPS, characters: defaultCharacters });
    return { label: `Partie n° ${number}`, story, rooms: buildRoomStories(story) };
  });

  const pages: string[] = [];
  if (state.docs.has('map')) pages.push(mapSheet(material));
  if (state.docs.has('masks')) pages.push(...maskSheets(material));
  if (state.docs.has('notes')) for (let i = 0; i < state.players; i++) pages.push(...noteSheets(material));
  if (state.docs.has('cards')) pages.push(...roomCardSheets(material, quests));
  if (state.docs.has('quest')) pages.push(...quests.map((q) => questSheet(material, q.story, q.label)));

  history.replaceState(null, '', `?map=${map.id}&theme=${theme.id}&from=${state.from}&count=${state.count}&players=${state.players}&docs=${[...state.docs].join(',')}`);

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
      <fieldset><legend>Par partie</legend>
        ${DOCS.filter((d) => !d.common).map(checkbox).join('')}
        <label>Parties n° <input id="from" type="number" min="1" value="${state.from}"></label>
        <label>à <input id="to" type="number" min="1" value="${state.from + state.count - 1}"></label>
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
  app.querySelector<HTMLInputElement>('#from')!.onchange = () => { const to = state.from + state.count - 1; state.from = num('from'); state.count = Math.max(1, to - state.from + 1); render(); };
  app.querySelector<HTMLInputElement>('#to')!.onchange = () => { state.count = Math.max(1, num('to') - state.from + 1); render(); };
  app.querySelectorAll<HTMLInputElement>('[data-doc]').forEach((el) => {
    el.onchange = () => { const k = el.dataset.doc as DocKey; if (el.checked) state.docs.add(k); else state.docs.delete(k); render(); };
  });
}

render();
