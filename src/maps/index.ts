import type { GameMap } from '../core/types';
import { manoir } from './manoir';
import { musee } from './musee';
import { villa } from './villa';

export const maps: GameMap[] = [manoir, musee, villa];
export { defaultCharacters } from './villa';
