import { UUID } from './uuid';

export interface Player {
  readonly id: UUID;
  readonly createdAt: Date;
}
