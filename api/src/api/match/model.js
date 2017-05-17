import { createVertexCollection } from '../../services/arango/vertex';

export const MATCH_COLLECTION = 'matches';

export const matchCollection = async () => {
  const Match = await createVertexCollection(MATCH_COLLECTION);
  // Other custom methods
  // ...
  return Match;
};
