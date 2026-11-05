import './render/print.css';
import { generateStory } from './core/story';
import { buildRoomStories } from './core/roomStory';
import { randomSeed } from './core/rng';
import { maps, defaultCharacters } from './maps';
import { renderMapSvg } from './render/mapSvg';

const app = document.querySelector<HTMLDivElement>('#app')!;
const params = new URLSearchParams(location.search);

const state = {
  mapId: params.get('map') ?? maps[0]!.id,
  seed: params.get('seed') ?? randomSeed(),
  steps: Number(params.get('steps') ?? 6),
};

function render(): void {
  const map = maps.find((m) => m.id === state.mapId) ?? maps[0]!;
  const story = generateStory(map, {
    seed: state.seed,
    steps: state.steps,
    characters: defaultCharacters,
  });
  const rooms = buildRoomStories(story);
  const footer = `${map.name} · graine ${state.seed} · ${state.steps} étapes`;
  const stepHeaders = Array.from({ length: state.steps }, (_, i) => `<th>${i + 1}</th>`).join('');

  history.replaceState(null, '', `?map=${map.id}&seed=${state.seed}&steps=${state.steps}`);

  app.innerHTML = `
    <div class="toolbar no-print">
      <label>Plan <select id="map">${maps.map((m) => `<option value="${m.id}" ${m.id === map.id ? 'selected' : ''}>${m.name}</option>`).join('')}</select></label>
      <label>Graine <input id="seed" value="${state.seed}" size="8"></label>
      <button id="reroll">Nouvelle partie</button>
      <label>Étapes <input id="steps" type="number" min="1" max="12" value="${state.steps}"></label>
      <button onclick="print()">Imprimer</button>
    </div>

    <section class="sheet">
      <h2>${map.name}</h2>
      ${renderMapSvg(map)}
      <div class="sheet-footer">${footer}</div>
    </section>

    <section class="sheet debug">
      <h2>Solution (aperçu provisoire)</h2>
      <table>
        <tr><th></th>${stepHeaders}</tr>
        ${defaultCharacters.map((c) => `<tr><th style="color:${c.color}">${c.name}</th>${story.paths[c.id]!.map((r) => `<td>${map.rooms.find((x) => x.id === r)!.name}</td>`).join('')}</tr>`).join('')}
      </table>
      <h2 style="margin-top:8mm">Histoires des salles (aperçu provisoire)</h2>
      ${rooms.map((rs) => `
        <h3>${map.rooms.find((r) => r.id === rs.roomId)!.name}</h3>
        <table>
          <tr><th>Étape</th>${stepHeaders}</tr>
          <tr><th>Présents</th>${rs.steps.map((s) => `<td>${s.count}</td>`).join('')}</tr>
          <tr><th>Perso vu</th>${rs.steps.map((s) => `<td>${s.revealedCharacter ?? '–'}</td>`).join('')}</tr>
        </table>
        <table style="margin-top:1mm">
          <tr><th></th>${defaultCharacters.map((c) => `<th style="color:${c.color}">${c.symbol}</th>`).join('')}</tr>
          <tr><th>Passages</th>${defaultCharacters.map((c) => `<td>${rs.characters[c.id]!.visits}</td>`).join('')}</tr>
          <tr><th>Étape vue</th>${defaultCharacters.map((c) => { const s = rs.characters[c.id]!.revealedStep; return `<td>${s === null ? '–' : s + 1}</td>`; }).join('')}</tr>
        </table>`).join('')}
      <div class="sheet-footer">${footer}</div>
    </section>`;

  app.querySelector<HTMLSelectElement>('#map')!.onchange = (e) => { state.mapId = (e.target as HTMLSelectElement).value; render(); };
  app.querySelector<HTMLInputElement>('#seed')!.onchange = (e) => { state.seed = (e.target as HTMLInputElement).value; render(); };
  app.querySelector<HTMLInputElement>('#steps')!.onchange = (e) => { state.steps = Math.max(1, Number((e.target as HTMLInputElement).value)); render(); };
  app.querySelector<HTMLButtonElement>('#reroll')!.onclick = () => { state.seed = randomSeed(); render(); };
}

render();
