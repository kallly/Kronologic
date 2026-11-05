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
  /** Rôle particulier : le détective est la victime du scénario « Tête-à-tête mortel ». */
  role?: 'detective';
}

export interface StoryConfig {
  seed: string;
  /** Nombre d'étapes (pas de temps). 6 par défaut. */
  steps: number;
  characters: Character[];
  /**
   * Position de chaque personnage à l'étape 1, fixée par l'histoire / le n° de partie.
   * Absent ⇒ tirée à partir de la graine (et imprimée avec la partie).
   */
  startPositions?: Record<CharacterId, RoomId>;
}

/** Une partie générée : le trajet complet de chaque personnage. */
export interface Story {
  config: StoryConfig;
  map: GameMap;
  /** paths[characterId][étape] = salle occupée (index d'étape 0-based). */
  paths: Record<CharacterId, RoomId[]>;
}

/** Ce que révèle le cache d'une étape posé sur la carte de salle. */
export interface StepRoomInfo {
  /** Partagé : nombre de personnages présents à cette étape. */
  count: number;
  /** Privé : un personnage présent, ou null si personne. */
  revealedCharacter: CharacterId | null;
}

/** Ce que révèle le cache d'un personnage posé sur la carte de salle. */
export interface CharacterRoomInfo {
  /** Partagé : nombre de passages dans la salle, toutes étapes confondues. */
  visits: number;
  /** Privé : une étape exacte (0-based) où il y était, ou null s'il n'y est jamais allé. */
  revealedStep: number | null;
}

/** « Histoire d'une pièce » : tout ce qu'imprime la carte de salle (cf. docs/REGLES_KRONOLOGIC.md §5). */
export interface RoomStory {
  roomId: RoomId;
  /** Une entrée par étape. */
  steps: StepRoomInfo[];
  /** Une entrée par personnage. */
  characters: Record<CharacterId, CharacterRoomInfo>;
}
