import { bijou } from './bijou';
import { fantome } from './fantome';
import { teteATete } from './teteATete';
import type { Mode, ModeId } from './types';

export const modes: Mode[] = [teteATete, fantome, bijou];
export const modeById = (id: ModeId): Mode => modes.find((m) => m.id === id)!;
export type { Mode, ModeId, ModeStory, Highlight } from './types';
