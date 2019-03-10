import { Team } from './team';
import { UUID } from './uuid';

type TeamAndScore = Team & { points: number };

export interface Match {
  id: UUID;
  red: TeamAndScore;
  blue: TeamAndScore;
  playedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
