import { Player } from './player';
import { UUID } from './uuid';

export interface Team {
  id: UUID;
  players: Player[];
}
