export type RoomId = string;
export type CharacterId = string;

/** Une salle du plan. Coordonnées dans le repère du plan (unités libres, cf. GameMap.width/height). */
export interface Room {
  id: RoomId;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface GameMap {
  id: string;
  name: string;
  width: number;
  height: number;
  rooms: Room[];
  /** Passages entre salles (non orientés). */
  doors: [RoomId, RoomId][];
}

export interface Character {
  id: CharacterId;
  name: string;
  /** Couleur d'affichage. */
  color: string;
  /** Symbole / initiale, pour rester lisible en noir & blanc. */
  symbol: string;
}

export interface StoryConfig {
  seed: string;
  /** Nombre d'étapes (pas de temps). 6 par défaut. */
  steps: number;
  characters: Character[];
  /** Un personnage peut-il rester dans la même salle d'une étape à l'autre ? */
  allowStay: boolean;
  /** Salle de départ commune à tous (étape 1). Absent ⇒ départ aléatoire. */
  startRoom?: RoomId;
}

/** Une partie générée : le trajet complet de chaque personnage. */
export interface Story {
  config: StoryConfig;
  map: GameMap;
  /** paths[characterId][étape] = salle occupée (index d'étape 0-based). */
  paths: Record<CharacterId, RoomId[]>;
}

/** Infos privées d'un personnage sur la carte d'une salle. */
export interface CharacterRoomInfo {
  /** Nombre d'étapes passées dans la salle. */
  visits: number;
  /** Une étape exacte (0-based) où il y était, ou null s'il n'y est jamais allé. */
  revealedStep: number | null;
}

/** « Histoire d'une pièce » : tout ce qu'imprime la carte de salle. */
export interface RoomStory {
  roomId: RoomId;
  /** Info publique : nombre de personnages présents à chaque étape. */
  presenceByStep: number[];
  /** Infos privées par personnage. */
  characters: Record<CharacterId, CharacterRoomInfo>;
}
