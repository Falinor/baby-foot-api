import { createVertexCollection } from '../../services/arango/vertex';

export const PLAYER_COLLECTION = 'players';

export const playerCollection = async () => {
  const Player = await createVertexCollection(PLAYER_COLLECTION);
  // Other custom methods
  // ...
  return Player;
};
